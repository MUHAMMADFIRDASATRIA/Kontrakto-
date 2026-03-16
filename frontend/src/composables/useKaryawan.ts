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
    
    watch([searchQuery, filterDept, sortBy], () => { currentPage.value = 1 })

    const filteredData = computed(() => {
    let list = [...karyawanList.value]

    if (filterDept.value !== null) {
        list = list.filter(k => k.position?.department_id === filterDept.value)
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(k => k.name.toLowerCase().includes(q) || k.email.toLowerCase().includes(q))
    }

    if (sortBy.value === 'nama-asc')  list.sort((a,b) => a.name.localeCompare(b.name))
    if (sortBy.value === 'nama-desc') list.sort((a,b) => b.name.localeCompare(a.name))
    if (sortBy.value === 'dept') {
        list.sort((a, b) => {
            const deptA = getDepartmentName(a.position?.department_id ?? 0)
            const deptB = getDepartmentName(b.position?.department_id ?? 0)
            return deptA.localeCompare(deptB)
        })
    }

    return list
    })

    const { toasts, addToast, removeToast } = useToast()

    const karyawanList = ref<Employees[]>([])
    const form = ref({
        name: '',
        email: '',
        phone: '',
        address: '',
        position_id: null as number | null,
    })

    const totalPages = computed(() =>
        Math.max(1, Math.ceil(filteredData.value.length / perPage.value))
    )

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * perPage.value
        return filteredData.value.slice(start, start + perPage.value)
    })

    const visiblePages = computed(() => {
        const total = totalPages.value
        const current = currentPage.value
        const pages: (number | string)[] = []
        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i)
        } else {
            pages.push(1)
            if (current > 3) pages.push('...')
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
            if (current < total - 2) pages.push('...')
            pages.push(total)
        }
        return pages
    })

    const getDepartmentName = (deptId: number) => {
        const dept = departmentOptions.value.find(d => d.id === deptId)
        return dept ? dept.name : 'Unknown'
    }

    const getJabatanName = (posId: number) => {
        const jabatan = jabatanList.value.find(p => p.id === posId)
        return jabatan ? jabatan.title : 'Unknown'
    }

    const openAddModal = () => {
        showModal.value = true
        isEditing.value = false
        editingId.value = null
        form.value = {
            name: '',
            email: '',
            phone: '',
            address: '',
            position_id: null,
        };
    };

    const openEditModal = (karyawan: Employees) => {
        showModal.value = true
        isEditing.value = true
        editingId.value = karyawan.id
        form.value = {
            name: karyawan.name,
            email: karyawan.email,
            phone: karyawan.phone,
            address: karyawan.address,
            position_id: karyawan.position_id,
        }
    }

    const confirmDelete = async (k: Employees) => {
        deleteTarget.value = k.id
        deleteTargetName.value = k.name
        showDeleteModal.value = true
    }

    const deleteData = async () => {
        if (!deleteTarget.value) return
        isDeleting.value = true
        try {
            await api.delete(`/Employees/${deleteTarget.value}`)
            karyawanList.value = karyawanList.value.filter(k => k.id !== deleteTarget.value)
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

    const saveData = async () => {
        isSaving.value = true
        try {
            if (isEditing.value && editingId.value) {
                const res = await api.put(`/Employees/${editingId.value}`, form.value)
                const index = karyawanList.value.findIndex(k => k.id === editingId.value)
                if (index !== -1) karyawanList.value[index] = res.data.employee
                closeModal()
                addToast('Karyawan berhasil diperbarui', 'success')
            } else {
                const res = await api.post('/Employees', form.value)
                karyawanList.value.push(res.data.employee)
                closeModal()
                addToast('Karyawan berhasil ditambahkan', 'success')
            }
        } catch (error) {
            const apiError = error as ApiError
            addToast(apiError.message || 'Gagal menyimpan data', 'error')
        } finally {
            isSaving.value = false
        }
    };

    const loadData = async () => {
        isLoading.value = true
        try {
            const [empRes, posRes, deptRes] = await Promise.all([
                api.get('/Employees'),
                api.get('/Positions'),
                api.get('/Departments'),
            ])

            // API responses have shape: { message, employees } or { positions } / { departments }
            karyawanList.value = empRes.data.employees || empRes.data || []
            jabatanList.value = posRes.data.positions || posRes.data || []
            departmentOptions.value = deptRes.data.departments || deptRes.data || []

            console.log('Loaded departments:', departmentOptions.value)
        } catch (error) {
            console.error('Error loading karyawan data:', error)
        } finally {
            isLoading.value = false
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
        karyawanList,
        form,
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
        totalPages,
        paginatedData,
        visiblePages,
        filterDept,
        filteredData,
        searchQuery,
        sortBy,
        departmentOptions,
        jabatanList,
        departemenOptions: departmentOptions,
        getJabatanName,
        openAddModal,
        openEditModal,
        confirmDelete,
        deleteData,
        closeModal,
        saveData,
        loadData,
        handleLogout,
    }
}