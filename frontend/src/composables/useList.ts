import { computed, ref } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface ApiError {
	message: string
	[key: string]: unknown
}

interface UseListOptions<TItem> {
	endpoint: string
	perPage?: number
	initialPage?: number
	extractor?: (data: unknown) => TItem[]
	loadErrorMessage?: string
	onLoaded?: (items: TItem[], data: unknown) => void | Promise<void>
}

export function useList<TItem>(options: UseListOptions<TItem>) {
	const { addToast } = useToast()
	const isLoading = ref(false)
	const items = ref<TItem[]>([])
	const currentPage = ref(options.initialPage ?? 1)
	const perPage = options.perPage ?? 10

	const extractItems = (data: unknown): TItem[] => {
		if (options.extractor) return options.extractor(data)

		if (Array.isArray(data)) return data as TItem[]

		if (typeof data === 'object' && data !== null) {
			const values = Object.values(data as Record<string, unknown>)
			const firstArray = values.find((value) => Array.isArray(value))
			if (Array.isArray(firstArray)) return firstArray as TItem[]
		}

		return []
	}

	const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / perPage)))

	const paginatedData = computed(() => {
		const start = (currentPage.value - 1) * perPage
		return items.value.slice(start, start + perPage)
	})

	const clampCurrentPage = () => {
		if (currentPage.value > totalPages.value) {
			currentPage.value = totalPages.value
		}

		if (currentPage.value < 1) {
			currentPage.value = 1
		}
	}

	const setItems = (nextItems: TItem[]) => {
		items.value = nextItems
		clampCurrentPage()
	}

	const loadData = async (): Promise<void> => {
		isLoading.value = true
		try {
			const response = await api.get(options.endpoint)
			const nextItems = extractItems(response.data)
			setItems(nextItems)

			if (options.onLoaded) {
				await options.onLoaded(nextItems, response.data)
			}
		} catch (error) {
			const err = error as ApiError & { response?: { data?: ApiError } }
			const message = err.response?.data?.message || err.message || options.loadErrorMessage || 'Gagal memuat data'
			addToast(message, 'error')
		} finally {
			isLoading.value = false
		}
	}

	return {
		isLoading,
		items,
		currentPage,
		perPage,
		totalPages,
		paginatedData,
		setItems,
		loadData,
	}
}

export interface DepartmentListItem {
	id: number
	name: string
	[key: string]: unknown
}

export interface JabatanListItem {
	id: number
	title: string
	department_id: number
	[key: string]: unknown
}

export function useDepartmentList() {
	return useList<DepartmentListItem>({
		endpoint: '/Departments',
		perPage: 10,
		extractor: (data) => ((data as { departments?: DepartmentListItem[] })?.departments || []) as DepartmentListItem[],
		loadErrorMessage: 'Gagal memuat data departemen',
	})
}

export function useJabatanList() {
	const departmentOptions = ref<DepartmentListItem[]>([])

	const listState = useList<JabatanListItem>({
		endpoint: '/Positions',
		perPage: 10,
		extractor: (data) => ((data as { positions?: JabatanListItem[] })?.positions || []) as JabatanListItem[],
		loadErrorMessage: 'Gagal memuat data jabatan',
	})

	const loadDepartmentOptions = async () => {
		try {
			const response = await api.get('/Departments')
			departmentOptions.value = (response.data.departments || response.data || []) as DepartmentListItem[]
		} catch (error) {
			const err = error as ApiError & { response?: { data?: ApiError } }
			const message = err.response?.data?.message || err.message || 'Gagal memuat data departemen'
			useToast().addToast(message, 'error')
		}
	}

	const loadData = async () => {
		await Promise.all([
			listState.loadData(),
			loadDepartmentOptions(),
		])
	}

	const getDepartmentName = (departmentId: number) => {
		const department = departmentOptions.value.find((item) => item.id === departmentId)
		return department ? department.name : 'Unknown'
	}

	return {
		...listState,
		departmentOptions,
		loadData,
		getDepartmentName,
	}
}
