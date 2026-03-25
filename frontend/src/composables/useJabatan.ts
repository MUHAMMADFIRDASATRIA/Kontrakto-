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
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useCreate } from '@/composables/useCreate'
import { useDelete } from '@/composables/useDelete'
import { useEdit } from '@/composables/useEdit'
import { useList } from '@/composables/useList'

interface Jabatan {
  id: number
  title: string
  department_id: number
}

interface Department {
  id: number
  name: string
}

interface JabatanForm {
  title: string
  department_id: number | null
}

export function useJabatan() {
  const router = useRouter()
  const jabatan = ref<Jabatan | null>(null)
  const departmentOptions = ref<Department[]>([])
  const error = ref<string | null>(null)
  const form = ref<JabatanForm>({
    title: '',
    department_id: null,
  })

  const showModal = ref(false)
  const isEditMode = ref(false)
  const editingId = ref<number | null>(null)
  const deleteTarget = ref<Jabatan | null>(null)
  const showDeleteModal = ref(false)
  const isSaving = ref(false)

  const {
    isLoading: loading,
    items: jabatanList,
    currentPage,
    perPage,
    totalPages,
    paginatedData,
    loadData: loadJabatanList,
  } = useList<Jabatan>({
    endpoint: '/Positions',
    perPage: 10,
    extractor: (data) => ((data as { positions?: Jabatan[] })?.positions || []) as Jabatan[],
    loadErrorMessage: 'Gagal memuat data jabatan',
  })

  const { createItem } = useCreate<JabatanForm>({
    createEndpoint: '/Positions',
    successMessage: 'Jabatan berhasil ditambahkan',
    errorMessage: 'Gagal menyimpan jabatan',
  })

  const { updateById } = useEdit<Jabatan, JabatanForm>({
    listEndpoint: '/Positions',
    updateEndpoint: (id) => `/Positions/${id}`,
    getId: (item) => item.id,
    mapItemToPayload: (item) => ({
      title: item.title,
      department_id: item.department_id,
    }),
    listExtractor: (data) => ((data as { positions?: Jabatan[] })?.positions || []) as Jabatan[],
    successMessage: 'Jabatan berhasil diperbarui',
    loadErrorMessage: 'Data jabatan tidak ditemukan',
    updateErrorMessage: 'Gagal menyimpan jabatan',
  })

  const { isDeleting, deleteItem } = useDelete<number>({
    deleteEndpoint: (id) => `/Positions/${id}`,
    successMessage: 'Jabatan berhasil dihapus',
    errorMessage: 'Gagal menghapus jabatan',
  })

  const loadDepartmentOptions = async () => {
    try {
      const response = await api.get('/Departments')
      departmentOptions.value = (response.data.departments || response.data || []) as Department[]
    } catch {
      error.value = 'Failed to load data'
    }
  }

  const resetForm = () => {
    form.value = {
      title: '',
      department_id: null,
    }
  }

  const getDepartmentName = (deptId: number) => {
    const dept = departmentOptions.value.find((item) => item.id === deptId)
    return dept ? dept.name : 'Unknown'
  }

  const openAddModal = () => {
    showModal.value = true
    isEditMode.value = false
    editingId.value = null
    resetForm()
  }

  const openEditModal = (item: Jabatan) => {
    showModal.value = true
    isEditMode.value = true
    editingId.value = item.id
    form.value = {
      title: item.title,
      department_id: item.department_id,
    }
  }

  const confirmDelete = (item: Jabatan) => {
    deleteTarget.value = item
    showDeleteModal.value = true
  }

  const deleteData = async () => {
    if (!deleteTarget.value) return

    const success = await deleteItem(deleteTarget.value.id)
    if (!success) {
      error.value = 'Failed to delete position'
      return
    }

    showDeleteModal.value = false
    deleteTarget.value = null
    await loadJabatanList()
  }

  const closeModal = () => {
    showModal.value = false
    isEditMode.value = false
    editingId.value = null
  }

  const saveData = async () => {
    if (!form.value.title.trim() || !form.value.department_id) return

    isSaving.value = true
    error.value = null
    try {
      const payload: JabatanForm = {
        title: form.value.title.trim(),
        department_id: form.value.department_id,
      }

      if (isEditMode.value && editingId.value !== null) {
        const success = await updateById(editingId.value, payload)
        if (!success) {
          error.value = 'Failed to save position'
          return
        }
      } else {
        const created = await createItem(payload)
        if (!created) {
          error.value = 'Failed to save position'
          return
        }
      }

      closeModal()
      await loadJabatanList()
    } finally {
      isSaving.value = false
    }
  }

  const loadData = async () => {
    error.value = null
    try {
      await Promise.all([
        loadJabatanList(),
        loadDepartmentOptions(),
      ])
    } catch {
      error.value = 'Failed to load data'
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return {
    jabatan,
    jabatanList,
    departmentOptions,
    loading,
    isSaving,
    isDeleting,
    error,
    form,
    loadData,
    currentPage,
    perPage,
    totalPages,
    paginatedData,
    showModal,
    isEditMode,
    editingId,
    deleteTarget,
    showDeleteModal,
    deleteData,
    confirmDelete,
    openAddModal,
    openEditModal,
    handleLogout,
    closeModal,
    saveData,
    getDepartmentName,
  }
}
*/