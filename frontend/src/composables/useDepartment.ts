import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
    message: string
    [key: string]: unknown
}

interface Department {
    id: number
    name: string
    [key: string]: unknown
}

export function useDepartment() {
    const router = useRouter()
    const isLoading  = ref(false)
    const isSaving   = ref(false)
    const isDeleting = ref(false)
    const showModal  = ref(false)
    const isEditing  = ref(false)
    const editingId  = ref<number | null>(null)
    const showDeleteModal  = ref(false)
    const deleteTarget     = ref<number | null>(null)
    const deleteTargetName = ref('')
    const currentPage = ref(1)
    const perPage     = 10
    const form = ref({ name: '' })
    const departemenList = ref<Department[]>([])

    const totalPages = computed(() =>
        Math.max(1, Math.ceil(departemenList.value.length / perPage))
    )

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * perPage
        return departemenList.value.slice(start, start + perPage)
    })

    const loadData = async () => {
        isLoading.value = true
        try {
            const response = await api.get('/Departments')
            departemenList.value = response.data.departments ?? response.data
        } catch (error) {
            const apiError = error as ApiError
            alert(apiError.message || 'Gagal memuat data departemen')
        } finally {
            isLoading.value = false
        }
    }

    const openAddModal = () => {
        isEditing.value  = false
        editingId.value  = null
        form.value       = { name: '' }
        showModal.value  = true
    }

    const openEditModal = (item: Department) => {
        isEditing.value  = true
        editingId.value  = item.id
        form.value       = { name: item.name }
        showModal.value  = true
    }

    const closeModal = () => { showModal.value = false }

    const saveData = async () => {
        if (!form.value.name.trim()) {
            alert('Nama departemen tidak boleh kosong')
            return
        }
        isSaving.value = true
        try {
            if (isEditing.value && editingId.value) {
                await api.put(`/Departments/${editingId.value}`, form.value)
            } else {
                await api.post('/Departments', form.value)
            }
            showModal.value = false
            await loadData()
        } catch (error) {
            const apiError = error as ApiError
            alert(apiError.message || 'Gagal menyimpan data')
        } finally {
            isSaving.value = false
        }
    }

    const confirmDelete = (item: Department) => {
        deleteTarget.value     = item.id
        deleteTargetName.value = item.name
        showDeleteModal.value  = true
    }

    const deleteData = async () => {
        isDeleting.value = true
        try {
            await api.delete(`/Departments/${deleteTarget.value}`)
            showDeleteModal.value = false
            await loadData()
            if (currentPage.value > totalPages.value) {
                currentPage.value = totalPages.value
            }
        } catch (error) {
            const apiError = error as ApiError
            alert(apiError.message || 'Gagal menghapus data')
        } finally {
            isDeleting.value = false
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return {
        isLoading, 
        isSaving, 
        isDeleting,
        showModal, 
        isEditing, 
        editingId, 
        form,
        departemenList,
        showDeleteModal, 
        deleteTarget, 
        deleteTargetName,
        currentPage, 
        perPage, 
        totalPages, 
        paginatedData,
        loadData, 
        openAddModal, 
        openEditModal, 
        closeModal,
        saveData, 
        confirmDelete, 
        handleLogout,
        deleteData,
    }
}