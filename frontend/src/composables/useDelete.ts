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

	const deleteItem = async (target: Target): Promise<boolean> => {
		isDeleting.value = true
		try {
			await api.delete(options.deleteEndpoint(target))

			if (options.onSuccess) {
				await options.onSuccess(target)
			}

			addToast(options.successMessage || 'Data berhasil dihapus', 'success')
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

	return {
		isDeleting,
		deleteItem,
	}
}

interface DeleteConfig {
	endpoint : string
	successMessage?: string
	errorMessage?: string
}

function createDeleteAction(config: DeleteConfig) {
	return function (){
		const { isDeleting, deleteItem } = useDeleteAction<number>({
			deleteEndpoint: (id) => `${config.endpoint}/${id}`,
			successMessage: config.successMessage,
			errorMessage: config.errorMessage,
		})

		return {
			isDeleting,
			deleteItem,
		}
	}
}


export const useDeleteDepartment = createDeleteAction({
	endpoint: '/Departments',
	successMessage: 'Departemen berhasil dihapus',
	errorMessage: 'Gagal menghapus data',
})

export const useDeleteJabatan = createDeleteAction({
	endpoint: '/Positions',
	successMessage: 'Jabatan berhasil dihapus',
	errorMessage: 'Gagal menghapus jabatan',
})

export const useDeleteKaryawan = createDeleteAction({
	endpoint: '/Employees',
	successMessage: 'Karyawan berhasil dihapus',
	errorMessage: 'Gagal menghapus karyawan',
})

export const useDeletePKWT = createDeleteAction({
	endpoint: '/Pkwts',
	successMessage: 'PKWT berhasil dihapus',
	errorMessage: 'Gagal menghapus PKWT',
})

// interface UseDeleteOptions<Target> {
// 	deleteEndpoint: (target: Target) => string
// 	successMessage?: string
// 	errorMessage?: string
// 	onSuccess?: (target: Target) => void | Promise<void>
// }

// export function useDelete<Target>(options: UseDeleteOptions<Target>) {
// 	const { addToast } = useToast()
// 	const isDeleting = ref(false)

// 	const deleteItem = async (target: Target): Promise<boolean> => {
// 		isDeleting.value = true
// 		try {
// 			await api.delete(options.deleteEndpoint(target))

// 			if (options.onSuccess) {
// 				await options.onSuccess(target)
// 			}

// 			addToast(options.successMessage || 'Data berhasil dihapus', 'success')
// 			return true
// 		} catch (error) {
// 			const err = error as ApiError & { response?: { data?: ApiError } }
// 			const message = err.response?.data?.message || err.message || options.errorMessage || 'Gagal menghapus data'
// 			addToast(message, 'error')
// 			return false
// 		} finally {
// 			isDeleting.value = false
// 		}
// 	}

// 	return {
// 		isDeleting,
// 		deleteItem,
// 	}
// }
