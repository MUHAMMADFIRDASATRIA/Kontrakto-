import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface ApiError {
    message: string
    [key: string]: unknown
}

interface Employee {
    id: number
    name: string
    email: string
    phone: string
    address: string
    gender : string
    location_of_birth : string
    agama : string
    marital_status : string
    date_of_birth : string
    position_id: number
    department_id: number
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
    [key: string]: unknown
}

interface CreateEmployeePayload {
    name: string
    email: string
    phone: string
    address: string
    gender: string
    location_of_birth: string
    agama: string
    marital_status: string
    date_of_birth: string
    position_id: number | null
    department_id: number | null
}

const createInitialFormData = (): CreateEmployeePayload => ({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    location_of_birth: '',
    agama: '',
    marital_status: '',
    date_of_birth: '',
    position_id: null,
    department_id: null,
})

export function useCreateKaryawan() {
    const router = useRouter()
    const isSaving = ref(false)
    const { toasts, addToast, removeToast } = useToast()
    const isLoading = ref(false)

    const formData = ref<CreateEmployeePayload>(createInitialFormData())

    const jabatanList = ref<Jabatan[]>([])
    const departmentList = ref<Department[]>([])

    const getDepartmentName = (deptId: number) => {
        const dept = departmentList.value.find(d => d.id === deptId)
        return dept ? dept.name : 'Unknown'
    }

    const getJabatanName = (posId: number) => {
        const pos = jabatanList.value.find(j => j.id === posId)
        return pos ? pos.title : 'Unknown'
    }

    const loadData = async () => {
        isLoading.value = true
        try {
            const [posRes, deptRes] = await Promise.all([
                api.get('/Positions'),
                api.get('/Departments'),
            ])

            jabatanList.value = posRes.data.positions || posRes.data || []
            departmentList.value = deptRes.data.departments || deptRes.data || []
        } catch (error) {
            console.error('Error loading create form data:', error)
            addToast('Gagal memuat data departemen dan jabatan', 'error')
        } finally {
            isLoading.value = false
        }
    }

    const resetFormData = () => {
        formData.value = createInitialFormData()
    }

    const saveData = async () => {
        isSaving.value = true
        try {
            await api.post('/Employees', formData.value)
            addToast('Karyawan berhasil ditambahkan', 'success')
            router.push('/Karyawan')
        } catch (error) {
            const err = error as ApiError & { response?: { data?: ApiError } }
            const message = err.response?.data?.message || err.message || 'Gagal menambahkan karyawan'
            addToast(message, 'error')
        } finally {
            isSaving.value = false
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
        formData,
        isSaving,
        isLoading,
        jabatanList,
        departmentList,
        toasts,
        removeToast,
        getDepartmentName,
        getJabatanName,
        loadData,
        resetFormData,
        saveData,
        handleLogout
    }
}