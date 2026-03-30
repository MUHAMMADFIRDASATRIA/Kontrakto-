import { computed, ref, unref, watch } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface ApiError {
	message: string
	[key: string]: unknown
}

// Helper untuk extractor yang clean
const createExtractor = <T>(key: string) => (data: unknown): T[] => {
	const value = (data as Record<string, unknown>)?.[key]
	return (Array.isArray(value) ? value : []) as T[]
}

interface UseListOptions<TItem> {
	endpoint: string
	perPage?: number
	initialPage?: number
	extractor: (data: unknown) => TItem[]
	loadErrorMessage?: string
	onLoaded?: (items: TItem[], data: unknown) => void | Promise<void>
	params?: Record<string, any>
}

export function useList<TItem>(options: UseListOptions<TItem>) {
	const { addToast } = useToast()
	const isLoading = ref(false)
	const items = ref<TItem[]>([])
	const currentPage = ref(options.initialPage ?? 1)
	const perPage = ref(options.perPage ?? 10)
	const totalItems = ref(0)
	const totalPages = ref(1)
	const params = options.params ?? {}

	const extractItems = (data: unknown): TItem[] => {
		return options.extractor(data)
	}

	const clampCurrentPage = () => {
		if (currentPage.value > totalPages.value) {
			currentPage.value = totalPages.value
		}

		if (currentPage.value < 1) {
			currentPage.value = 1
		}
	}

	const loadData = async (): Promise<void> => {
		isLoading.value = true
		try {
			const response = await api.get(options.endpoint, {
				params: {
					per_page: perPage.value,
					page: currentPage.value,

					...Object.fromEntries(
						Object.entries(params).map(([key, value])=>[
							key, 
							unref(value)
						])
			)
				}
			})

			const data = response.data

			const nextItems = options.extractor(data)
			items.value = nextItems

			totalItems.value = data.meta?.total ?? 0
			totalPages.value = data.meta?.last_page ?? 1

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

	watch(
		()=> [currentPage.value, perPage.value], 
		loadData
	)

	watch(
		()=> Object.values(params).map(v => unref(v)),
		() => {
			currentPage.value = 1
			loadData()
		}
	)
	
	const paginatedData = computed(() => items.value)

	return {
		isLoading,
		items,
		currentPage,
		perPage,
		totalPages,
		paginatedData,
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

export interface EmployeeListItem {
	id: number
	name: string
	email: string
	phone: string
	address: string
	position_id: number
	position?: {
		id: number
		title: string
		department_id: number
	}
	[key: string]: unknown
}

export function useDepartmentList() {
	return useList<DepartmentListItem>({
		endpoint: '/Departments',
		perPage: 10,
		extractor: createExtractor<DepartmentListItem>('data'),
		loadErrorMessage: 'Gagal memuat daftar departemen',
	})
}

export function useJabatanList() {
	const departmentOptions = ref<DepartmentListItem[]>([])

	const listState = useList<JabatanListItem>({
		endpoint: '/Positions',
		perPage: 10,
		extractor: createExtractor<JabatanListItem>('data'),
		loadErrorMessage: 'Gagal memuat daftar jabatan',
	})

	const loadDepartmentOptions = async () => {
		try {
			const response = await api.get('/Departments')
			departmentOptions.value = response.data.data || []
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
		const options = Array.isArray(departmentOptions.value) ? departmentOptions.value : [];
		const department = options.find((item) => item.id === departmentId);
		return department ? department.name : 'Unknown';
	}

	return {
		...listState,
		departmentOptions,
		loadDepartmentOptions,
		loadData,
		getDepartmentName,
	}
}

	export function useKaryawanList() {
			const filterDept = ref<number | null>(null)
			const sortBy = ref<'nama-asc' | 'nama-desc' | 'dept'>('nama-asc')
			const searchQuery = ref('')

			const departmentOptions = ref<DepartmentListItem[]>([])

			const getDepartmentName = (deptId: number) => {
				const dept = departmentOptions.value.find(d => d.id === deptId)
				return dept ? dept.name : 'Unknown'
			}

			const listState = useList<EmployeeListItem>({
				endpoint: '/Employees',
				perPage: 10,
				extractor: createExtractor('data'),
				loadErrorMessage: 'Gagal memuat daftar karyawan',

				params: {
					department_id:  filterDept,
					search: searchQuery,
					sort: sortBy
				}
			})

			watch([filterDept, searchQuery, sortBy], () => {
				listState.currentPage.value = 1
				listState.loadData()
			})

			const loadDepartmentOptions = async () => {
				try {
					const response = await api.get('/Departments')
					departmentOptions.value = response.data.data || []
					console.log('OPTIONS:', departmentOptions.value)
				} catch (error) {
					const err = error as ApiError & { response?: { data?: ApiError } }
					const message = err.response?.data?.message || err.message || 'Gagal memuat data departemen'
					useToast().addToast(message, 'error')
				}
			}

		// Load data karyawan dan departemen sekaligus
		const loadAllData = async () => {
			await Promise.all([
				listState.loadData(),
				loadDepartmentOptions(),
			])
		}

		return {
			...listState,
			departmentOptions,
			filterDept,
			sortBy,
			searchQuery,
			loadAllData,
			getDepartmentName,
		}
}
