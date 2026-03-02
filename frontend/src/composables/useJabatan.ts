import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const { toasts, addToast, removeToast } = useToast()


interface Jabatan {
  id: number;
  title: string;
  department_id: number;
}

interface Department {
  id: number;
  name: string;
}

export function useJabatan() {
  const route = useRoute();
  const router = useRouter();
  const jabatan = ref<Jabatan | null>(null);
  const departmentOptions = ref<Department[]>([]);
  const loading = ref(false);
  const jabatanList = ref<Jabatan[]>([]);
  const error = ref<string | null>(null);
  const form = ref({
    title: '',
    department_id: null as number | null,
  });

  const showModal = ref(false);
  const isEditMode = ref(false);
  const editingId = ref<number | null>(null);
  const deleteTarget = ref<number | null>(null);
  const showDeleteModal = ref(false);

  const currentPage = ref(1)
  const perPage = 10
  const totalPages = computed(() => Math.max(1, Math.ceil(jabatanList.value.length / perPage)))
  const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return jabatanList.value.slice(start, start + perPage)
  })

  const getDepartmentName = (deptId: number) => {
  const dept = departmentOptions.value.find(d => d.id === deptId)
  return dept ? dept.name : 'Unknown'
}
  const openAddModal = () => {
    showModal.value = true;
    isEditMode.value = false;
    editingId.value = null;
    form.value = {
        title: '',
        department_id: null,
    };
  };

  const openEditModal = (jabatan: Jabatan) => {
    showModal.value = true;
    isEditMode.value = true;
    editingId.value = jabatan.id;
    form.value = {
        title: jabatan.title,
        department_id: jabatan.department_id,
    };
  }

  const confirmDelete = async (j: Jabatan) => {
    deleteTarget.value = j.id;
    showDeleteModal.value = true
  }

  const deleteData = async (j:Jabatan) => {
    if (deleteTarget.value === null) return;
    try {
      await api.delete(`/Positions/${deleteTarget.value}`);
      jabatanList.value = jabatanList.value.filter(j => j.id !== deleteTarget.value);
      showDeleteModal.value = false;
      addToast('Jabatan berhasil dihapus', 'success');
    } catch (err) {
      error.value = 'Failed to delete position';
      addToast('Gagal menghapus jabatan', 'error');
    }
  }

  const closeModal = () => {
    showModal.value = false;
    isEditMode.value = false;
    editingId.value = null;
  };

    const saveData = async () => {
    try {
      if (!form.value.title.trim() || !form.value.department_id) return;
      if (isEditMode.value && editingId.value !== null) {
        const res = await api.put(`/Positions/${editingId.value}`, form.value);
        const idx = jabatanList.value.findIndex(j => j.id === editingId.value);
        if (idx !== -1) jabatanList.value[idx] = res.data.position;
        closeModal();
        addToast('Jabatan berhasil diperbarui', 'success');

      } else {
        const res = await api.post('/Positions', form.value);
        jabatanList.value.push(res.data.position);
        closeModal();
        addToast('Jabatan berhasil ditambahkan', 'success');

      }
    } catch (err) {
      error.value = 'Failed to save position';
      addToast('Gagal menyimpan jabatan', 'error');
    }
    };


  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [jabatanRes, departmentsRes] = await Promise.all([
        api.get(`/Positions`),
        api.get('/Departments'),
      ]);

      jabatanList.value = jabatanRes.data.positions;
      departmentOptions.value = departmentsRes.data.departments;
    }
    catch (err) {
      error.value = 'Failed to load data';
    }
    finally {
      loading.value = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return {
    jabatan,
    departmentOptions,
    loading,
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
  };
}