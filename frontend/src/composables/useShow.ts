import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface EmployeeDetail {
    id: number
    name: string
}

interface ApiError {
    message: string
    [key: string]: unknown
}

// interface UseDeleteOptions<TTarget> {
//     deleteEndpoint: (target: TTarget) => string
//     successMessage?: string
//     errorMessage?: string
//     onSuccess?: (target: TTarget) => void | Promise<void>
// }

export function useDetail() {
    const router = useRouter()
    const employeeDetail = ref<EmployeeDetail | null>(null)
    const isLoading = ref(false)

    const fetchEmployeeDetail = async (id: number) => {
        isLoading.value = true
        try {
            const response = await api.get(`/employees/${id}`)
            employeeDetail.value = response.data
        } catch (error) {   
            console.error('Error fetching employee detail:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        employeeDetail,
        isLoading,
        fetchEmployeeDetail
    }

}

// export function useDeleteAction<TTarget>(options: UseDeleteOptions<TTarget>) {
//     const { addToast } = useToast()
//     const isDeleting = ref(false)

//     const deleteItem = async (target: TTarget): Promise<boolean> => {
//         isDeleting.value = true
//         try {
//             await api.delete(options.deleteEndpoint(target))

//             if (options.onSuccess) {
//                 await options.onSuccess(target)
//             }

//             addToast(options.successMessage || 'Data berhasil dihapus', 'success')
//             return true
//         } catch (error) {
//             const err = error as ApiError & { response?: { data?: ApiError } }
//             const message = err.response?.data?.message || err.message || options.errorMessage || 'Gagal menghapus data'
//             addToast(message, 'error')
//             return false
//         } finally {
//             isDeleting.value = false
//         }
//     }

//     return {
//         isDeleting,
//         deleteItem,
//     }
// }

// export function useDepartmentDelete() {
//     const { isDeleting, deleteItem } = useDeleteAction<number>({
//         deleteEndpoint: (id) => `/Departments/${id}`,
//         successMessage: 'Departemen berhasil dihapus',
//         errorMessage: 'Gagal menghapus data',
//     })

//     const deleteDepartment = (id: number) => deleteItem(id)

//     return {
//         isDeleting,
//         deleteDepartment,
//     }
// }

// export function useJabatanDelete() {
//     const { isDeleting, deleteItem } = useDeleteAction<number>({
//         deleteEndpoint: (id) => `/Positions/${id}`,
//         successMessage: 'Jabatan berhasil dihapus',
//         errorMessage: 'Gagal menghapus jabatan',
//     })

//     const deleteJabatan = (id: number) => deleteItem(id)

//     return {
//         isDeleting,
//         deleteJabatan,
//     }
// }
