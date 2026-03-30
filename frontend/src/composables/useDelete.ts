import { ref } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface ApiError {
	message: string
	[key: string]: unknown
}

interface UseDeleteOptions<Target> {
	deleteEndpoint: (target: Target) => string
	successMessage?: string
	errorMessage?: string
	onSuccess?: (target: Target) => void | Promise<void>
}

export function useDeleteAction<Target>(options: UseDeleteOptions<Target>) {
	const { addToast } = useToast()
	const isDeleting = ref(false)
	const showDeleteModal = ref(false)
	const deleteTarget = ref<Target | null>(null)
	const deleteTargetName = ref('')

	const confirmDelete = (target: Target, name: string) => {
		deleteTarget.value = target
		deleteTargetName.value = name
		showDeleteModal.value = true
	}

	const executeDelete = async (): Promise<boolean> => {
		if (!deleteTarget.value) return false

		isDeleting.value = true
		try {
			await api.delete(options.deleteEndpoint(deleteTarget.value))

			if (options.onSuccess) {
				await options.onSuccess(deleteTarget.value)
			}
			addToast(options.successMessage || 'Data berhasil dihapus', 'success')

			showDeleteModal.value = false
			deleteTarget.value = null
			return true
		} catch (error) {
			const err = error as ApiError & { response?: { data?: ApiError } }
			const message = err.response?.data?.message || err.message || options.errorMessage || 'Gagal menghapus data'
			addToast(message, 'error')
			return false
		} finally {
			isDeleting.value = false
		}
	}

	const deleteItem = async (target: Target): Promise<boolean> => {
		if (options.onSuccess){
			await options.onSuccess(target)
		}
		return true
	}

	return {
		isDeleting,
		showDeleteModal,
		deleteTarget,
		deleteTargetName,
		confirmDelete,
		executeDelete,
	}
}

interface DeleteConfig {
	endpoint : string
	successMessage?: string
	errorMessage?: string
}

function createDeleteAction(config: DeleteConfig) {
	return function (onSuccess?: (id: number) => void | Promise<void>) {
		return useDeleteAction<number>({
			deleteEndpoint: (id) => `${config.endpoint}/${id}`,
			successMessage: config.successMessage,
			errorMessage: config.errorMessage,
			onSuccess,
		})
	}
}


const useDeleteDepartmentAction = createDeleteAction({
	endpoint: '/Departments',
	successMessage: 'Departemen berhasil dihapus',
	errorMessage: 'Gagal menghapus data',
})

const useDeleteJabatanAction = createDeleteAction({
	endpoint: '/Positions',
	successMessage: 'Jabatan berhasil dihapus',
	errorMessage: 'Gagal menghapus jabatan',
})

const useDeleteKaryawanAction = createDeleteAction({
	endpoint: '/Employees',
	successMessage: 'Karyawan berhasil dihapus',
	errorMessage: 'Gagal menghapus karyawan',
})

const useDeletePKWTAction = createDeleteAction({
	endpoint: '/Pkwts',
	successMessage: 'PKWT berhasil dihapus',
	errorMessage: 'Gagal menghapus PKWT',
})

export function useDeleteDepartment(onSuccess?: (id: number) => void | Promise<void>) {
	return useDeleteDepartmentAction(onSuccess)
}

export function useDeleteJabatan(onSuccess?: (id: number) => void | Promise<void>) {
	return useDeleteJabatanAction(onSuccess)
}

export function useDeleteKaryawan(onSuccess?: (id: number) => void | Promise<void>) {
	return useDeleteKaryawanAction(onSuccess)
}

export function useDeletePKWT(onSuccess?: (id: number) => void | Promise<void>) {
	return useDeletePKWTAction(onSuccess)
}
