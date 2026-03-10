import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface PKWT {
    end_date: string
    [key: string]: unknown
}

interface ChartItem {
    label: string
    active: number
    near: number
    exp: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function useDashboard() {
    const router = useRouter()

    const activeNav = ref('Dashboard')
    const selectedYear = ref(new Date().getFullYear())
    const pkwtRaw = ref<PKWT[]>([])

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
            const res = await api.get('/Pkwts')
            pkwtRaw.value = (res.data as any).pkwts ?? []
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/login')
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
        handleLogout,
        loadData
    }
}