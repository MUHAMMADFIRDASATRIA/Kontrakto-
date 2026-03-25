import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import {
  buildPkwtPayload,
  createInitialPkwtForm,
  formatPkwtCurrency,
  parsePkwtCurrency,
  pkwtContractTypeOptions,
  pkwtWorkTypeOptions,
  type DepartmentForm,
  type JabatanForm,
  type PkwtDepartment,
  type PkwtEmployee,
  type PkwtForm,
  type PkwtFormErrors,
  type PkwtPosition,
} from '@/composables/useCreate'
import type { DepartmentListItem, JabatanListItem } from '@/composables/useList'

interface ApiError {
  message: string
  [key: string]: unknown
}

interface UseEditOptions<TItem, TPayload> {
  listEndpoint: string
  updateEndpoint: (id: number) => string
  getId: (item: TItem) => number
  mapItemToPayload: (item: TItem) => TPayload
  listExtractor?: (data: unknown) => TItem[]
  successMessage?: string
  loadErrorMessage?: string
  updateErrorMessage?: string
  redirectTo?: string
  onSuccess?: (payload: TPayload, id: number) => void | Promise<void>
}

export function useEdit<TItem, TPayload>(options: UseEditOptions<TItem, TPayload>) {
  const router = useRouter()
  const { addToast } = useToast()
  const isLoading = ref(false)
  const isSaving = ref(false)

  const extractList = (data: unknown): TItem[] => {
    if (options.listExtractor) return options.listExtractor(data)

    if (Array.isArray(data)) return data as TItem[]

    if (typeof data === 'object' && data !== null) {
      const values = Object.values(data as Record<string, unknown>)
      const firstArray = values.find((value) => Array.isArray(value))
      if (Array.isArray(firstArray)) return firstArray as TItem[]
    }

    return []
  }

  const loadById = async (id: number): Promise<TPayload | null> => {
    isLoading.value = true
    try {
      const res = await api.get(options.listEndpoint)
      const list = extractList(res.data)
      const item = list.find((entry) => options.getId(entry) === id)

      if (!item) {
        addToast(options.loadErrorMessage || 'Data tidak ditemukan', 'error')
        return null
      }

      return options.mapItemToPayload(item)
    } catch (error) {
      const err = error as ApiError & { response?: { data?: ApiError } }
      const message = err.response?.data?.message || err.message || options.loadErrorMessage || 'Gagal memuat data edit'
      addToast(message, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateById = async (id: number, payload: TPayload): Promise<boolean> => {
    isSaving.value = true
    try {
      await api.put(options.updateEndpoint(id), payload)

      if (options.onSuccess) {
        await options.onSuccess(payload, id)
      }

      addToast(options.successMessage || 'Data berhasil diperbarui', 'success')

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }

      return true
    } catch (error) {
      const err = error as ApiError & { response?: { data?: ApiError } }
      const message = err.response?.data?.message || err.message || options.updateErrorMessage || 'Gagal memperbarui data'
      addToast(message, 'error')
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    isLoading,
    isSaving,
    loadById,
    updateById,
  }
}

export function useDepartmentEdit() {
  const { isSaving, updateById } = useEdit<DepartmentListItem, DepartmentForm>({
    listEndpoint: '/Departments',
    updateEndpoint: (id) => `/Departments/${id}`,
    getId: (item) => item.id,
    mapItemToPayload: (item) => ({ name: item.name }),
    listExtractor: (data) => ((data as { departments?: DepartmentListItem[] })?.departments || []) as DepartmentListItem[],
    successMessage: 'Departemen berhasil diperbarui',
    loadErrorMessage: 'Data departemen tidak ditemukan',
    updateErrorMessage: 'Gagal menyimpan data',
  })

  const updateDepartment = (id: number, payload: DepartmentForm) => updateById(id, payload)

  return {
    isSaving,
    updateDepartment,
  }
}

export function useJabatanEdit() {
  const { isSaving, updateById } = useEdit<JabatanListItem, JabatanForm>({
    listEndpoint: '/Positions',
    updateEndpoint: (id) => `/Positions/${id}`,
    getId: (item) => item.id,
    mapItemToPayload: (item) => ({
      title: item.title,
      department_id: item.department_id,
    }),
    listExtractor: (data) => ((data as { positions?: JabatanListItem[] })?.positions || []) as JabatanListItem[],
    successMessage: 'Jabatan berhasil diperbarui',
    loadErrorMessage: 'Data jabatan tidak ditemukan',
    updateErrorMessage: 'Gagal menyimpan jabatan',
  })

  const updateJabatan = (id: number, payload: JabatanForm) => updateById(id, payload)

  return {
    isSaving,
    updateJabatan,
  }
}

interface PkwtItem {
  id: number
  employee_id: number
  contract_number: string
  start_date: string
  end_date: string
  contract_type?: string
  work_type?: string
  work_type_secondary?: string
  base_salary?: number | string
  allowance?: number | string
  responsible_name?: string
  signed_date?: string
  work_location?: string
  notes?: string
  employee?: PkwtEmployee
}

export function useEditPkwt(editingId: number | null) {
  const router = useRouter()
  const activeNav = ref('pkwt')
  const currentStep = ref(1)
  const signedContractFile = ref<File | null>(null)
  const employeeList = ref<PkwtEmployee[]>([])
  const positionList = ref<PkwtPosition[]>([])
  const departmentList = ref<PkwtDepartment[]>([])
  const errors = ref<PkwtFormErrors>({})
  const form = ref<PkwtForm>(createInitialPkwtForm())
  const { toasts, addToast, removeToast } = useToast()

  const {
    isLoading: isEditLoading,
    loadById,
  } = useEdit<PkwtItem, PkwtForm>({
    listEndpoint: '/Pkwts',
    updateEndpoint: (id) => `/Pkwts/${id}`,
    getId: (item) => item.id,
    mapItemToPayload: (item) => ({
      employee_id: item.employee_id,
      tglMulaiRaw: item.start_date,
      tglBerakhirRaw: item.end_date,
      contract_type: item.contract_type || 'PKWT Baru',
      work_type: item.work_type || 'Full-time',
      work_type_secondary: item.work_type_secondary || item.work_type || 'Full-time',
      base_salary: String(item.base_salary || ''),
      allowance: String(item.allowance || ''),
      responsible_name: item.responsible_name || 'Admin (HRD)',
      signed_date: item.signed_date || '',
      contract_number: item.contract_number || '',
      work_location: item.work_location || '',
      notes: item.notes || '',
    }),
    listExtractor: (data) => ((data as { pkwts?: PkwtItem[] })?.pkwts || []) as PkwtItem[],
    successMessage: 'PKWT berhasil diperbarui',
    loadErrorMessage: 'Data PKWT tidak ditemukan',
    updateErrorMessage: 'Gagal memperbarui PKWT',
    redirectTo: '/PKWT',
  })

  const isLoading = ref(false)
  const isSaving = ref(false)
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

      if (editingId) {
        const payload = await loadById(editingId)
        if (payload) form.value = payload
      }
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

    if (step === 1 && !form.value.employee_id) errors.value.employee_id = 'Nama karyawan wajib dipilih'

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

  const handleSignedContractChange = (event: Event): void => {
    signedContractFile.value = (event.target as HTMLInputElement).files?.[0] ?? null
  }

  const handleCancel = (): void => {
    router.push('/PKWT')
  }

  const triggerGenerateLetter = (): void => {
    const employeeName = selectedEmployee.value?.name || 'Nama karyawan'
    const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /><title>Surat PKWT ${form.value.contract_number}</title></head>
<body><h1>Surat PKWT</h1><p>${employeeName}</p></body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${form.value.contract_number.replace(/[^a-zA-Z0-9-]/g, '_')}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!editingId || !validateStep(3)) return
    const payload = buildPkwtPayload(form.value, signedContractFile.value)
    isSaving.value = true
    try {
      await api.post(`/Pkwts/${editingId}?_method=PUT`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      addToast('PKWT berhasil diperbarui', 'success')
      router.push('/PKWT')
    } catch (error) {
      const err = error as ApiError & { response?: { data?: ApiError } }
      const message = err.response?.data?.message || err.message || 'Gagal memperbarui PKWT'
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
    isLoading: computed(() => isLoading.value || isEditLoading.value),
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
    handleCancel,
    handleSubmit,
    handleLogout,
    handleSignedContractChange,
    triggerGenerateLetter,
  }
}
