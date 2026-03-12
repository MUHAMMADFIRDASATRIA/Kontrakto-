import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface PKWT {
    employee_id?: number
    end_date: string
    [key: string]: unknown
}

interface Employee {
    id: number
    position_id?: number
    [key: string]: unknown
}

interface Position {
    id: number
    department_id: number
    [key: string]: unknown
}

interface Department {
    id: number
    name: string
    [key: string]: unknown
}

interface DepartmentStatItem {
    id: number
    name: string
    sub: string
    count: number
    color: string
}

interface WorkerPieLegendItem {
    id: number
    label: string
    count: number
    pct: string
    color: string
    ratio: number
}

interface WorkerPieSegment {
    id: number
    color: string
    strokeDasharray: string
    strokeDashoffset: number
}

interface ChartItem {
    label: string
    active: number
    near: number
    exp: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_RADIUS = 50
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS
const WORKER_PIE_TOP_LIMIT = 8

export function useDashboard() {
    const router = useRouter()

    const activeNav = ref('Dashboard')
    const selectedYear = ref(new Date().getFullYear())
    const pkwtRaw = ref<PKWT[]>([])
    const employeesRaw = ref<Employee[]>([])
    const positionsRaw = ref<Position[]>([])
    const departmentsRaw = ref<Department[]>([])

    const chartWrap = ref<HTMLElement | null>(null)
    const chartW = ref(600)

    const chartH = 260
    const chartTopPad = 16
    const chartInnerH = 190
    const yAxisW = 28
    const barW = 22

    const calcSisaHari = (tglBerakhirRaw: string) => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const end = new Date(tglBerakhirRaw)
        return Math.round((end.getTime() - now.getTime()) / 86400000)
    }

    const statusFromSisa = (sisaHari: number) => {
        if (sisaHari < 0) return 'exp'
        if (sisaHari <= 30) return 'near'
        return 'active'
    }

    const statusTotals = computed(() => {
        return pkwtRaw.value.reduce(
            (acc, item) => {
                const endDate = item.end_date
                if (!endDate) return acc

                const bucket = statusFromSisa(calcSisaHari(endDate))
                acc[bucket] += 1
                return acc
            },
            { active: 0, near: 0, exp: 0 }
        )
    })

    const totalEmployees = computed(() => employeesRaw.value.length)
    const activeCount = computed(() => statusTotals.value.active + statusTotals.value.near)
    const nearExpiryCount = computed(() => statusTotals.value.near)
    const expiredCount = computed(() => statusTotals.value.exp)

    const departmentColor = (departmentId: number) => {
        // Deterministic HSL color so departments stay visually consistent without manual palette entries.
        const hue = (departmentId * 47) % 360
        return `hsl(${hue}, 58%, 56%)`
    }

    const activeDepartments = computed<DepartmentStatItem[]>(() => {

        const employeeById = new Map<number, Employee>()
        employeesRaw.value.forEach((employee) => {
            employeeById.set(employee.id, employee)
        })

        const positionDeptById = new Map<number, number>()
        positionsRaw.value.forEach((position) => {
            positionDeptById.set(position.id, position.department_id)
        })

        const departmentById = new Map<number, Department>()
        departmentsRaw.value.forEach((department) => {
            departmentById.set(department.id, department)
        })

        const counts = new Map<number, number>()

        pkwtRaw.value.forEach((pkwt) => {
            const endDate = pkwt.end_date
            if (!endDate) return
            if (statusFromSisa(calcSisaHari(endDate)) == 'exp') return

            const employeeId = pkwt.employee_id
            if (!employeeId) return

            const employee = employeeById.get(employeeId)
            if (!employee?.position_id) return

            const departmentId = positionDeptById.get(employee.position_id)
            if (!departmentId) return

            counts.set(departmentId, (counts.get(departmentId) ?? 0) + 1)
        })

        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([departmentId, count]) => {
                const department = departmentById.get(departmentId)

                return {
                    id: departmentId,
                    name: department?.name ?? 'Unknown',
                    sub: 'PKWT Aktif',
                    count,
                    color: departmentColor(departmentId)
                }
            })
    })

    const workerPieLegend = computed<WorkerPieLegendItem[]>(() => {
        const positionDeptById = new Map<number, number>()
        positionsRaw.value.forEach((position) => {
            positionDeptById.set(position.id, position.department_id)
        })

        const departmentById = new Map<number, Department>()
        departmentsRaw.value.forEach((department) => {
            departmentById.set(department.id, department)
        })

        const counts = new Map<number, number>()

        employeesRaw.value.forEach((employee) => {
            if (!employee.position_id) return
            const departmentId = positionDeptById.get(employee.position_id)
            if (!departmentId) return
            counts.set(departmentId, (counts.get(departmentId) ?? 0) + 1)
        })

        const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
        const topItems = sorted.slice(0, WORKER_PIE_TOP_LIMIT)
        const othersCount = sorted.slice(WORKER_PIE_TOP_LIMIT).reduce((sum, [, count]) => sum + count, 0)
        const combined = othersCount > 0 ? [...topItems, [-1, othersCount] as [number, number]] : topItems

        const total = combined.reduce((sum, [, count]) => sum + count, 0)
        if (total === 0) return []

        return combined.map(([departmentId, count]) => {
            const isOthers = departmentId === -1
            const ratio = count / total

            return {
                id: departmentId,
                label: isOthers ? 'Lainnya' : (departmentById.get(departmentId)?.name ?? 'Unknown'),
                count,
                pct: `${Math.round(ratio * 100)}%`,
                color: isOthers ? '#b8bec8' : departmentColor(departmentId),
                ratio
            }
        })
    })

    const workerPieSegments = computed<WorkerPieSegment[]>(() => {
        let offset = 0

        return workerPieLegend.value.map((item) => {
            const length = item.ratio * PIE_CIRCUMFERENCE
            const segment: WorkerPieSegment = {
                id: item.id,
                color: item.color,
                strokeDasharray: `${length} ${PIE_CIRCUMFERENCE}`,
                strokeDashoffset: -offset
            }
            offset += length
            return segment
        })
    })

    const workerPieHighlight = computed(() => {
        const first = workerPieLegend.value[0]
        if (!first) {
            return {
                pct: '0%',
                label: '-'
            }
        }

        return {
            pct: first.pct,
            label: first.label
        }
    })

    const chartData = computed<ChartItem[]>(() => {
        const base = MONTHS.map((label) => ({ label, active: 0, near: 0, exp: 0 }))

        pkwtRaw.value.forEach((item) => {
            const end = new Date(item.end_date)
            if (Number.isNaN(end.getTime())) return
            if (end.getFullYear() !== selectedYear.value) return

            const monthIndex = end.getMonth()
            if (!base[monthIndex]) return
            const bucket = statusFromSisa(calcSisaHari(item.end_date))
            base[monthIndex][bucket] += 1
        })

        return base
    })

    const yMax = computed(() => {
        const maxTotal = Math.max(
            ...chartData.value.map((m) => m.active + m.near + m.exp),
            0
        )
        if (maxTotal <= 5) return 5
        return Math.ceil(maxTotal / 5) * 5
    })

    const yTicks = computed(() => {
        const max = yMax.value
        return [max, Math.round((max * 2) / 3), Math.round(max / 3), 0]
    })

    const colW = computed(() => {
        if (chartData.value.length === 0) return 0
        return (chartW.value - yAxisW - 16) / chartData.value.length
    })

    const barX = (i: number) => yAxisW + colW.value * i + (colW.value - barW) / 2
    const barPx = (val: number) => {
        if (yMax.value === 0) return 0
        return (val / yMax.value) * chartInnerH
    }
    const barY = (totalAbove: number) => chartTopPad + chartInnerH - barPx(totalAbove)

    const updateChartW = () => {
        if (chartWrap.value) chartW.value = chartWrap.value.clientWidth || 600
    }

    const loadData = async () => {
        try {
            const [pkwtRes, employeeRes, positionRes, departmentRes] = await Promise.all([
                api.get('/Pkwts'),
                api.get('/Employees'),
                api.get('/Positions'),
                api.get('/Departments')
            ])

            pkwtRaw.value = (pkwtRes.data as any).pkwts ?? []
            employeesRaw.value = (employeeRes.data as any).employees ?? []
            positionsRaw.value = (positionRes.data as any).positions ?? []
            departmentsRaw.value = (departmentRes.data as any).departments ?? []
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    onMounted(() => {
        loadData()
        updateChartW()
        window.addEventListener('resize', updateChartW)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', updateChartW)
    })

    return {
        activeNav,
        selectedYear,
        chartWrap,
        chartW,
        chartH,
        chartTopPad,
        chartInnerH,
        yAxisW,
        barW,
        chartData,
        yTicks,
        colW,
        barX,
        barPx,
        barY,
        totalEmployees,
        activeCount,
        nearExpiryCount,
        expiredCount,
        activeDepartments,
        workerPieLegend,
        workerPieSegments,
        workerPieHighlight,
        handleLogout,
        loadData
    }
}