import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface EmployeeDetail {
    id: number
    name: string
}

export function useDetail() {
    const router = useRouter()
    const employeeDetail = ref<EmployeeDetail | null>(null)
    const isLoading = ref(false)

    const fetchEmployeeDetail = async (id: number) => {
        isLoading.value = true
        try {
            const response = await api.get(`/employees/${id}`)
            employeeDetail.value = response.data
        } catch (error) {   
            console.error('Error fetching employee detail:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        employeeDetail,
        isLoading,
        fetchEmployeeDetail
    }

}
