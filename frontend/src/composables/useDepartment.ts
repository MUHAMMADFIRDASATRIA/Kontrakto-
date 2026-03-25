/*
Deprecated file.

This wrapper is intentionally no longer used.
Active CRUD logic now lives in:
- frontend/src/composables/useCreate.ts
- frontend/src/composables/useEdit.ts
- frontend/src/composables/useList.ts
- frontend/src/composables/useShow.ts

Previous implementation retained below for temporary reference only.

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreate } from '@/composables/useCreate'
import { useDelete } from '@/composables/useDelete'
import { useEdit } from '@/composables/useEdit'
import { useList } from '@/composables/useList'

interface Department {
    id: number
    name: string
    [key: string]: unknown
}

interface DepartmentForm {
    name: string
}

export function useDepartment() {
    const router = useRouter()
    const showModal = ref(false)
    const isEditing = ref(false)
    const editingId = ref<number | null>(null)
    const showDeleteModal = ref(false)
    const deleteTarget = ref<number | null>(null)
    const deleteTargetName = ref('')
    const form = ref<DepartmentForm>({ name: '' })
    const isSaving = ref(false)

    const {
        isLoading,
        items: departemenList,
        currentPage,
        perPage,
        totalPages,
        paginatedData,
        loadData,
    } = useList<Department>({
        endpoint: '/Departments',
        perPage: 10,
        extractor: (data) => ((data as { departments?: Department[] })?.departments || []) as Department[],
        loadErrorMessage: 'Gagal memuat data departemen',
    })

    const { createItem } = useCreate<DepartmentForm>({
        createEndpoint: '/Departments',
        successMessage: 'Departemen berhasil ditambahkan',
        errorMessage: 'Gagal menyimpan data',
    })

    const { updateById } = useEdit<Department, DepartmentForm>({
        listEndpoint: '/Departments',
        updateEndpoint: (id) => `/Departments/${id}`,
        getId: (item) => item.id,
        mapItemToPayload: (item) => ({ name: item.name }),
        listExtractor: (data) => ((data as { departments?: Department[] })?.departments || []) as Department[],
        successMessage: 'Departemen berhasil diperbarui',
        loadErrorMessage: 'Data departemen tidak ditemukan',
        updateErrorMessage: 'Gagal menyimpan data',
    })

    const { isDeleting, deleteItem } = useDelete<number>({
        deleteEndpoint: (id) => `/Departments/${id}`,
        successMessage: 'Departemen berhasil dihapus',
        errorMessage: 'Gagal menghapus data',
    })

    const resetForm = () => {
        form.value = { name: '' }
    }

    const buildPayload = (): DepartmentForm => ({
        name: form.value.name.trim(),
    })

    const openAddModal = () => {
        isEditing.value = false
        editingId.value = null
        resetForm()
        showModal.value = true
    }

    const openEditModal = (item: Department) => {
        isEditing.value = true
        editingId.value = item.id
        form.value = { name: item.name }
        showModal.value = true
    }

    const closeModal = () => {
        showModal.value = false
    }

    const saveData = async () => {
        if (!form.value.name.trim()) {
            window.alert('Nama departemen tidak boleh kosong')
            return
        }

        isSaving.value = true
        try {
            const payload = buildPayload()

            if (isEditing.value && editingId.value !== null) {
                const success = await updateById(editingId.value, payload)
                if (!success) return
            } else {
                const created = await createItem(payload)
                if (!created) return
            }

            showModal.value = false
            await loadData()
        } finally {
            isSaving.value = false
        }
    }

    const confirmDelete = (item: Department) => {
        deleteTarget.value = item.id
        deleteTargetName.value = item.name
        showDeleteModal.value = true
    }

    const deleteData = async () => {
        if (deleteTarget.value === null) return

        const success = await deleteItem(deleteTarget.value)
        if (!success) return

        showDeleteModal.value = false
        await loadData()
    }

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
*/