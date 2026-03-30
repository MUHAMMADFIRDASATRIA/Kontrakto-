import { ref, computed, watch } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

interface ApiError {
    message: string
    [key: string]: unknown
}

interface Employees {
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

interface Jabatan {
    id: number
    title: string
    department_id: number
    [key: string]: unknown
}

interface Department {
    id: number
    name: string
}

export function useKaryawan() {
    const router = useRouter()
    const isLoading  = ref(false)
    const isSaving   = ref(false)
    const isDeleting = ref(false)
    const showModal  = ref(false)
    const isEditing  = ref(false)
    const editingId  = ref<number | null>(null)
    const jabatanList = ref<Jabatan[]>([])
    const showDeleteModal  = ref(false)
    const deleteTarget     = ref<number | null>(null)
    const deleteTargetName = ref('')
    const currentPage = ref(1)
    const perPage = ref(10)
    const departmentOptions = ref<Department[]>([])

    const searchQuery = ref('')
    const filterDept  = ref<number | null>(null)
    const sortBy      = ref('nama-asc')

    const { toasts, addToast, removeToast } = useToast()

    // const confirmDelete = async (k: Employees) => {
    //     deleteTarget.value = k.id
    //     deleteTargetName.value = k.name
    //     showDeleteModal.value = true
    // }

    const deleteData = async () => {
        if (!deleteTarget.value) return
        isDeleting.value = true
        try {
            await api.delete(`/Employees/${deleteTarget.value}`)
            showDeleteModal.value = false
            addToast('Karyawan berhasil dihapus', 'success')
        } catch (error) {
            addToast('Gagal menghapus karyawan', 'error')
        } finally {
            isDeleting.value = false
        }
    }

    const closeModal = () => {
        showModal.value = false
        isEditing.value = false
        editingId.value = null
    }

    // const saveData = async () => {
    //     isSaving.value = true
    //     try {
    //         if (isEditing.value && editingId.value) {
    //             const res = await api.put(`/Employees/${editingId.value}`, form.value)
    //             closeModal()
    //             addToast('Karyawan berhasil diperbarui', 'success')
    //         } else {
    //             const res = await api.post('/Employees', form.value)
    //             closeModal()
    //             addToast('Karyawan berhasil ditambahkan', 'success')
    //         }
    //     } catch (error) {
    //         const apiError = error as ApiError
    //         addToast(apiError.message || 'Gagal menyimpan data', 'error')
    //     } finally {
    //         isSaving.value = false
    //     }
    // };

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
        isLoading,
        isSaving,
        isDeleting,
        showModal,
        isEditing,
        editingId,
        showDeleteModal,
        deleteTarget,
        deleteTargetName,
        currentPage,
        perPage,
        // paginatedData,
        filterDept,
        searchQuery,
        sortBy,
        departmentOptions,
        jabatanList,
        departemenOptions: departmentOptions,
        // confirmDelete,
        deleteData,
        closeModal,
        // saveData,
        handleLogout,
    }
}