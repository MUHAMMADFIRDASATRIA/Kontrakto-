import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface ApiError {
    message: string
    [key: string]: unknown
}

interface UseCreateOptions<TPayload, TResponse> {
    createEndpoint: string
    successMessage?: string
    errorMessage?: string
    onSuccess?: (responseData: TResponse, payload: TPayload) => void | Promise<void>
}

export interface DepartmentForm {
    name: string
}

export interface JabatanForm {
    title: string
    department_id: number | null
}

export function useCreate<TPayload, TResponse = unknown>(options: UseCreateOptions<TPayload, TResponse>) {
    const { addToast } = useToast()
    const isSaving = ref(false)

    const createItem = async (payload: TPayload): Promise<TResponse | null> => {
        isSaving.value = true
        try {
            const response = await api.post(options.createEndpoint, payload)
            const responseData = response.data as TResponse

            if (options.onSuccess) {
                await options.onSuccess(responseData, payload)
            }

            addToast(options.successMessage || 'Data berhasil ditambahkan', 'success')
            return responseData
        } catch (error) {
            const err = error as ApiError & { response?: { data?: ApiError } }
            const message = err.response?.data?.message || err.message || options.errorMessage || 'Gagal menyimpan data'
            addToast(message, 'error')
            return null
        } finally {
            isSaving.value = false
        }
    }

    return {
        isSaving,
        createItem,
    }
}

export function useDepartmentCreate() {
    const { isSaving, createItem } = useCreate<DepartmentForm>({
        createEndpoint: '/Departments',
        successMessage: 'Departemen berhasil ditambahkan',
        errorMessage: 'Gagal menyimpan data',
    })

    const createDepartment = (payload: DepartmentForm) => createItem(payload)

    return {
        isSaving,
        createDepartment,
    }
}

export function useJabatanCreate() {
    const { isSaving, createItem } = useCreate<JabatanForm>({
        createEndpoint: '/Positions',
        successMessage: 'Jabatan berhasil ditambahkan',
        errorMessage: 'Gagal menyimpan jabatan',
    })

    const createJabatan = (payload: JabatanForm) => createItem(payload)

    return {
        isSaving,
        createJabatan,
    }
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
    education: string
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
    education: '',
    position_id: null,
    department_id: null,
})

export interface PkwtEmployee {
    id: number
    name: string
    position_id: number
    department_id: number
}

export interface PkwtPosition {
    id: number
    title: string
    department_id: number
}

export interface PkwtDepartment {
    id: number
    name: string
}

export interface PkwtForm {
    employee_id: number | null
    tglMulaiRaw: string
    tglBerakhirRaw: string
    contract_type: string
    work_type: string
    work_type_secondary: string
    base_salary: string
    allowance: string
    responsible_name: string
    signed_date: string
    contract_number: string
    work_location: string
    notes: string
}

export interface PkwtFormErrors {
    employee_id?: string
    tglMulaiRaw?: string
    tglBerakhirRaw?: string
    contract_type?: string
    work_type?: string
    work_type_secondary?: string
    base_salary?: string
    responsible_name?: string
    signed_date?: string
    contract_number?: string
    work_location?: string
}

export const pkwtWorkTypeOptions = ['Full-time', 'Part-time', 'Shift', 'Hybrid', 'Remote', 'On-site']
export const pkwtContractTypeOptions = ['PKWT Baru', 'Perpanjangan', 'Addendum']

export function generatePkwtContractNumber(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(100 + Math.random() * 900)
    return `PKWT/${year}${month}${day}/${random}`
}

export function createInitialPkwtForm(): PkwtForm {
    return {
        employee_id: null,
        tglMulaiRaw: '',
        tglBerakhirRaw: '',
        contract_type: 'PKWT Baru',
        work_type: 'Full-time',
        work_type_secondary: 'Full-time',
        base_salary: '',
        allowance: '',
        responsible_name: 'Admin (HRD)',
        signed_date: '',
        contract_number: generatePkwtContractNumber(),
        work_location: '',
        notes: '',
    }
}

export function parsePkwtCurrency(value: string): number {
    const normalized = value.replace(/[^\d]/g, '')
    return normalized ? Number(normalized) : 0
}

export function formatPkwtCurrency(value: string | number): string {
    const numericValue = typeof value === 'number' ? value : parsePkwtCurrency(value)
    return new Intl.NumberFormat('id-ID').format(numericValue)
}

export function buildPkwtPayload(form: PkwtForm, signedContractFile: File | null): FormData {
    const totalSalaryValue = parsePkwtCurrency(form.base_salary) + parsePkwtCurrency(form.allowance)
    const payload = new FormData()

    payload.append('employee_id', String(form.employee_id))
    payload.append('contract_number', form.contract_number.trim())
    payload.append('tglMulaiRaw', form.tglMulaiRaw)
    payload.append('tglBerakhirRaw', form.tglBerakhirRaw)
    payload.append('contract_type', form.contract_type)
    payload.append('work_type', form.work_type)
    payload.append('work_type_secondary', form.work_type_secondary)
    payload.append('base_salary', String(parsePkwtCurrency(form.base_salary)))
    payload.append('allowance', String(parsePkwtCurrency(form.allowance)))
    payload.append('total_salary', String(totalSalaryValue))
    payload.append('responsible_name', form.responsible_name)
    payload.append('signed_date', form.signed_date)
    payload.append('work_location', form.work_location.trim())
    payload.append('notes', form.notes.trim())

    if (signedContractFile) {
        payload.append('signed_contract_file', signedContractFile)
    }

    return payload
}

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

export function useCreatePkwt() {
    const router = useRouter()
    const activeNav = ref('pkwt')
    const currentStep = ref(1)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const signedContractFile = ref<File | null>(null)
    const employeeList = ref<PkwtEmployee[]>([])
    const positionList = ref<PkwtPosition[]>([])
    const departmentList = ref<PkwtDepartment[]>([])
    const errors = ref<PkwtFormErrors>({})
    const form = ref<PkwtForm>(createInitialPkwtForm())
    const { toasts, addToast, removeToast } = useToast()

    const stepTitles = ['Informasi Karyawan', 'Detail Kontrak', 'Administrasi']
    const contractTypes = pkwtContractTypeOptions
    const workTypes = pkwtWorkTypeOptions

    const employeeOptions = computed(() =>
        employeeList.value.map((employee) => ({ value: employee.id, label: employee.name })),
    )

    const responsibleOptions = computed(() => [
        { value: 'Admin (HRD)', label: 'Admin (HRD)' },
    ])

    const selectedEmployee = computed(() =>
        employeeList.value.find((employee) => employee.id === form.value.employee_id) ?? null,
    )

    const selectedPosition = computed(() => {
        if (!selectedEmployee.value) return null
        const employee = selectedEmployee.value
        return positionList.value.find((position) => position.id === employee.position_id) ?? null
    })

    const selectedDepartment = computed(() => {
        const departmentId = selectedEmployee.value?.department_id ?? selectedPosition.value?.department_id
        if (!departmentId) return null
        return departmentList.value.find((department) => department.id === departmentId) ?? null
    })

    const autoDepartment = computed(() => selectedDepartment.value?.name ?? '')
    const autoJabatan = computed(() => selectedPosition.value?.title ?? '')
    const totalSalaryValue = computed(() => parsePkwtCurrency(form.value.base_salary) + parsePkwtCurrency(form.value.allowance))
    const totalSalaryLabel = computed(() => `Rp ${formatPkwtCurrency(totalSalaryValue.value)}`)
    const baseSalaryLabel = computed(() => `Rp ${formatPkwtCurrency(form.value.base_salary)}`)
    const allowanceLabel = computed(() => `Rp ${formatPkwtCurrency(form.value.allowance)}`)
    const signedContractFileName = computed(() => signedContractFile.value?.name ?? '')

    const stepDescription = computed(() => {
        if (currentStep.value === 1) return 'Isi informasi karyawan yang akan menandatangani PKWT.'
        if (currentStep.value === 2) return 'Lengkapi detail PKWT.'
        return 'Isi administratif PKWT.'
    })

    const loadOptions = async (): Promise<void> => {
        isLoading.value = true
        try {
            const [employeesRes, positionsRes, departmentsRes] = await Promise.all([
                api.get('/Employees'),
                api.get('/Positions'),
                api.get('/Departments'),
            ])

            employeeList.value = (employeesRes.data.employees || []) as PkwtEmployee[]
            positionList.value = (positionsRes.data.positions || []) as PkwtPosition[]
            departmentList.value = (departmentsRes.data.departments || []) as PkwtDepartment[]
        } catch (error) {
            addToast('Gagal memuat data PKWT', 'error')
        } finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        loadOptions()
    })

    const clearErrors = (): void => {
        errors.value = {}
    }

    const validateStep = (step: number): boolean => {
        clearErrors()

        if (step === 1) {
            if (!form.value.employee_id) errors.value.employee_id = 'Nama karyawan wajib dipilih'
        }

        if (step === 2) {
            if (!form.value.tglMulaiRaw) errors.value.tglMulaiRaw = 'Tanggal mulai wajib diisi'
            if (!form.value.tglBerakhirRaw) errors.value.tglBerakhirRaw = 'Tanggal berakhir wajib diisi'
            if (!form.value.contract_type) errors.value.contract_type = 'Jenis kontrak wajib dipilih'
            if (!form.value.work_type) errors.value.work_type = 'Tipe kerja wajib dipilih'
            if (!form.value.work_type_secondary) errors.value.work_type_secondary = 'Tipe kerja wajib dipilih'
            if (!parsePkwtCurrency(form.value.base_salary)) errors.value.base_salary = 'Gaji pokok wajib diisi'
        }

        if (step === 3) {
            if (!form.value.responsible_name) errors.value.responsible_name = 'Penanggung jawab wajib dipilih'
            if (!form.value.signed_date) errors.value.signed_date = 'Tanggal TTD wajib diisi'
            if (!form.value.contract_number.trim()) errors.value.contract_number = 'Nomor kontrak wajib diisi'
            if (!form.value.work_location.trim()) errors.value.work_location = 'Lokasi kerja wajib diisi'
        }

        return Object.keys(errors.value).length === 0
    }

    const nextStep = (): void => {
        if (currentStep.value >= 3) return
        if (!validateStep(currentStep.value)) return
        currentStep.value += 1
    }

    const prevStep = (): void => {
        if (currentStep.value <= 1) return
        currentStep.value -= 1
    }

    const resetForm = (): void => {
        currentStep.value = 1
        clearErrors()
        form.value = createInitialPkwtForm()
        signedContractFile.value = null
    }

    const handleSignedContractChange = (event: Event): void => {
        const file = (event.target as HTMLInputElement).files?.[0] ?? null
        signedContractFile.value = file
    }

    const handleCancel = (): void => {
        resetForm()
        router.push('/PKWT')
    }

    const triggerGenerateLetter = (): void => {
        const employeeName = selectedEmployee.value?.name || 'Nama karyawan'
        const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Surat PKWT ${form.value.contract_number}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
    h1 { font-size: 22px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 8px 0; vertical-align: top; }
    .label { width: 220px; color: #6b7280; }
  </style>
</head>
<body>
  <h1>Surat PKWT</h1>
  <p>Dokumen ini dihasilkan dari sistem untuk kebutuhan administrasi internal.</p>
  <table>
    <tr><td class="label">Nomor Kontrak</td><td>${form.value.contract_number}</td></tr>
    <tr><td class="label">Nama Karyawan</td><td>${employeeName}</td></tr>
    <tr><td class="label">Departemen</td><td>${autoDepartment.value || '-'}</td></tr>
    <tr><td class="label">Jabatan</td><td>${autoJabatan.value || '-'}</td></tr>
    <tr><td class="label">Tanggal Mulai</td><td>${form.value.tglMulaiRaw || '-'}</td></tr>
    <tr><td class="label">Tanggal Berakhir</td><td>${form.value.tglBerakhirRaw || '-'}</td></tr>
    <tr><td class="label">Jenis Kontrak</td><td>${form.value.contract_type}</td></tr>
    <tr><td class="label">Tipe Kerja</td><td>${form.value.work_type}</td></tr>
    <tr><td class="label">Tipe Kerja Lanjutan</td><td>${form.value.work_type_secondary}</td></tr>
    <tr><td class="label">Total Gaji</td><td>Rp ${formatPkwtCurrency(totalSalaryValue.value)}</td></tr>
    <tr><td class="label">Lokasi Kerja</td><td>${form.value.work_location || '-'}</td></tr>
  </table>
</body>
</html>`

        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${form.value.contract_number.replace(/[^a-zA-Z0-9-]/g, '_')}.html`
        link.click()
        URL.revokeObjectURL(url)
        addToast('Draft surat PKWT berhasil digenerate', 'success')
    }

    const handleSubmit = async (): Promise<void> => {
        if (!validateStep(3)) return

        isSaving.value = true
        try {
            const payload = buildPkwtPayload(form.value, signedContractFile.value)
            await api.post('/Pkwts', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            addToast('PKWT berhasil disimpan', 'success')
            router.push('/PKWT')
        } catch (error) {
            const apiError = error as ApiError & { response?: { data?: ApiError } }
            const message = apiError.response?.data?.message || apiError.message || 'Gagal menyimpan PKWT'
            addToast(message, 'error')
        } finally {
            isSaving.value = false
        }
    }

    const handleLogout = (): void => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
        activeNav,
        currentStep,
        isLoading,
        isSaving,
        form,
        errors,
        toasts,
        removeToast,
        stepTitles,
        stepDescription,
        employeeOptions,
        responsibleOptions,
        contractTypes,
        workTypes,
        autoDepartment,
        autoJabatan,
        totalSalaryLabel,
        baseSalaryLabel,
        allowanceLabel,
        signedContractFileName,
        nextStep,
        prevStep,
        resetForm,
        handleCancel,
        handleSubmit,
        handleLogout,
        handleSignedContractChange,
        triggerGenerateLetter,
    }
}