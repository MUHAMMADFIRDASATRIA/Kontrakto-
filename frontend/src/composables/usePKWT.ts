import { computed, watch, ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

interface PKWT {
    id: number       
    employee_name: string
    start_date: string
    end_date: string
    position: string
    [key: string]: unknown
}

interface Department {
    id: number
    name: string
}

interface Employee {
    id: number
    name: string
    position_id: number
}

interface Position {
    id: number
    department_id: number
    title: string
}

export function usePKWT() {
    const router = useRouter()
    const searchQuery  = ref('')
    const filterStatus = ref('')
    const filterDept   = ref('')
    const filterDate   = ref('')
    
    const formatDate = (raw: string) => {
        const date = new Date(raw)
        const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
        return `${String(date.getDate()).padStart(2,'0')} ${months[date.getMonth()]} ${date.getFullYear()}`
    }

    const calcSisa = (tglBerakhirRaw: string) => {
    const now  = new Date(); now.setHours(0,0,0,0)
    const end  = new Date(tglBerakhirRaw)
    return Math.round((end.getTime() - now.getTime()) / 86400000)
    }

    const calcStatus = (sisa: number) => {
        if (sisa < 0)   return 'Expired'
        if (sisa <= 30) return 'Akan Berakhir'
        return 'Aktif'
    }

    const pkwtRaw = ref<PKWT[]>([])
    const deptRaw  = ref<{ id: number, name: string }[]>([])
    const posRaw   = ref<Position[]>([])
    const empRaw   = ref<Employee[]>([])

    const pkwtList = computed<PKWT[]>(() =>
        pkwtRaw.value.map(item => {
            const sisa = calcSisa(item.end_date)
            const emp = (item as any).employee
            const pos = posRaw.value.find(p => p.id === emp?.position_id)
            const dept = deptRaw.value.find(d => d.id === pos?.department_id)
            return {
                ...item,
                nama: emp?.name ?? '',
                employee_name: emp?.name ?? '',
                jabatan: pos?.title ?? '',
                department: dept?.name ?? '',
                tglMulai: formatDate(item.start_date),
                tglBerakhir: formatDate(item.end_date),
                start_date: formatDate(item.start_date),
                end_date: formatDate(item.end_date),
                start_date_raw: item.start_date,
                end_date_raw: item.end_date,
                sisa,
                sisaHari: sisa,
                status: calcStatus(sisa)
            }
        })
    )

    const departemenOptions = computed(() =>
        deptRaw.value.map(dept => ({ value: dept.id, label: dept.name }))
    )

    const employeeOptions = computed(() =>
        empRaw.value.map(e => ({ value: e.id, label: e.name }))
    )

    const stats = computed(() => ({
    total       : pkwtList.value.length,
    aktif       : pkwtList.value.filter(k => k.status === 'Aktif' || k.status === 'Akan Berakhir').length,
    akanBerakhir: pkwtList.value.filter(k => k.status === 'Akan Berakhir').length,
    expired     : pkwtList.value.filter(k => k.status === 'Expired').length,
    }))


    const sisaClass = (sisa: number) => ({
    'sisa-normal'  : sisa > 30,
    'sisa-warning' : sisa > 0 && sisa <= 30,
    'sisa-expired' : sisa <= 0,
    })

    const statusClass = (status: string) => ({
    'status-aktif'        : status === 'Aktif',
    'status-akan-berakhir': status === 'Akan Berakhir',
    'status-expired'      : status === 'Expired',
    })

    const filteredData = computed(() => {   
        return pkwtList.value.filter(item => {
            const matchesSearch = ((item as any).nama ?? '').toLowerCase().includes(searchQuery.value.toLowerCase())
            const matchesStatus = filterStatus.value ? item.status === filterStatus.value : true
            const matchesDept   = filterDept.value ? String((item as any).department_id) === String(filterDept.value) : true
            const matchesDate   = filterDate.value ? (item as any).end_date_raw === filterDate.value : true
            return matchesSearch && matchesStatus && matchesDept && matchesDate
        })
    })

    watch([searchQuery, filterStatus, filterDept, filterDate], () => { currentPage.value = 1 })

    const currentPage = ref(1)
    const perPage = ref(10)

    const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value))

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * perPage.value
        return filteredData.value.slice(start, start + perPage.value)
    })

    const visiblePages = computed(() => {
    const total = totalPages.value
    const cur   = currentPage.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = []
    pages.push(1)
    if (cur > 3) pages.push('...')
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
    if (cur < total - 2) pages.push('...')
    pages.push(total)
    return pages
    })

    const loadData = async () => {
        try {
            const [pkwtRes, deptRes, posRes, empRes] = await Promise.all([
                api.get('/Pkwts'),
                api.get('/Departments'),
                api.get('/Positions'),
                api.get('/Employees')
            ])
            pkwtRaw.value = (pkwtRes.data as any).pkwts ?? []
            deptRaw.value = (deptRes.data as any).departments ?? []
            posRaw.value  = (posRes.data as any).positions ?? []
            empRaw.value  = (empRes.data as any).employees ?? []
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    onMounted(loadData)

    const showModal = ref(false)
    const isEditing = ref(false)
    const editingId = ref<number | null>(null)
    const showDeleteModal  = ref(false)
    const deleteTarget     = ref<number | null>(null)
    const deleteTargetName = ref('')
    const isDeleting       = ref(false)
    const isSaving         = ref(false)
    const { toasts, addToast, removeToast } = useToast()
    const form = ref({
        'employee_id': '' as number | '',
        'tglMulaiRaw': '',
        'tglBerakhirRaw': '',
    })

    const autoJabatan = computed(() => {
        if (!form.value.employee_id) return ''
        const emp = empRaw.value.find(e => e.id === form.value.employee_id)
        if (!emp) return ''
        const pos = posRaw.value.find(p => p.id === emp.position_id)
        return pos?.title ?? ''
    })

    const autoDepartment = computed(() => {
        if (!form.value.employee_id) return ''
        const emp = empRaw.value.find(e => e.id === form.value.employee_id)
        if (!emp) return ''
        const pos = posRaw.value.find(p => p.id === emp.position_id)
        if (!pos) return ''
        const dept = deptRaw.value.find(d => d.id === pos.department_id)
        return dept?.name ?? ''
    })

    const openAddModal = () => {
        showModal.value = true
        isEditing.value = false
        editingId.value = null
        form.value = {
            'employee_id': '',
            'tglMulaiRaw': '',
            'tglBerakhirRaw': '',
        }
    }

    const openEditModal = (item: PKWT) => {
        showModal.value = true
        isEditing.value = true
        editingId.value = item.id
        form.value = {
            'employee_id': (item as any).employee_id as number,
            'tglMulaiRaw': (item as any).start_date_raw,
            'tglBerakhirRaw': (item as any).end_date_raw,
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
            if (isEditing.value && editingId.value !== null) {
                await api.put(`/Pkwts/${editingId.value}`, form.value)
            } else {
                await api.post('/Pkwts', form.value)
            }
            closeModal()
            await loadData()
            addToast(isEditing.value ? 'PKWT berhasil diperbarui' : 'PKWT berhasil ditambahkan', 'success')
        } catch (error) {
            addToast('Gagal menyimpan PKWT', 'error')
        } finally {
            isSaving.value = false
        }
    }

    const confirmDelete = (item: PKWT) => {
        deleteTarget.value = item.id
        deleteTargetName.value = (item as any).nama ?? ''
        showDeleteModal.value = true
    }

    const deleteData = async () => {
        if (!deleteTarget.value) return
        isDeleting.value = true
        try {
            await api.delete(`/Pkwts/${deleteTarget.value}`)
            pkwtRaw.value = pkwtRaw.value.filter(k => k.id !== deleteTarget.value)
            showDeleteModal.value = false
            addToast('PKWT berhasil dihapus', 'success')
        } catch (error) {
            addToast('Gagal menghapus PKWT', 'error')
        } finally {
            isDeleting.value = false
        }
    }

    const activeNav = ref('pkwt')

    const handleLogout = () => {
        router.push('/login')
    }

    return {
        searchQuery,
        filterStatus,
        filterDept,
        filterDate,
        pkwtList,
        departemenOptions,
        employeeOptions,
        autoJabatan,
        autoDepartment,
        stats,
        sisaClass,
        statusClass,
        calcStatus,
        filteredData,
        currentPage,
        perPage,
        totalPages,
        paginatedData,
        visiblePages,
        showModal,
        isEditing,
        isSaving,
        form,
        showDeleteModal,
        deleteTarget,
        deleteTargetName,
        isDeleting,
        toasts,
        removeToast,
        openAddModal,
        openEditModal,
        closeModal,
        saveData,
        confirmDelete,
        deleteData,
        handleLogout,
        loadData,
        activeNav
    }
}
