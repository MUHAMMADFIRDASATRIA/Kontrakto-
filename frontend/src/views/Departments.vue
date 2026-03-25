<template>
  <div class="page-root">
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <div class="main-wrap">
      <AppTopbar username="Admin (HRD)" />

      <div class="content-area">

        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <span class="bc-parent">Master Data</span>
          <span class="bc-sep">/</span>
          <span class="bc-current">Kelola Departemen</span>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">Kelola Departemen</h1>
          <button class="btn-add" @click="openAddModal">
            Tambah Departemen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        <!-- Table Card -->
        <div class="table-card">
          <div class="table-card-header">
            <h2 class="table-card-title"> Daftar Departemen</h2>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-wrap">
            <div class="loading-spinner"></div>
            <span>Memuat data...</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="departemenList.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            <p>Belum ada departemen</p>
            <span>Klik tombol "Tambah Departemen" untuk menambahkan</span>
          </div>

          <!-- Table -->
          <table v-else class="data-table">
            <thead>
              <tr>
                <th class="col-nama">Nama Departemen</th>
                <th class="col-aksi">Aksi</th>
              </tr>
            </thead>
            <TransitionGroup name="row" tag="tbody">
              <tr v-for="item in paginatedData" :key="item.id">
                <td class="col-nama">{{ item.name }}</td>
                <td class="col-aksi">
                  <div class="action-buttons">
                    <button class="btn-edit" @click="openEditModal(item)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button class="btn-delete" @click="confirmDelete(item)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </TransitionGroup>
          </table>

          <!-- Pagination -->
          <div class="pagination" v-if="!isLoading && totalPages > 1">
            <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage = 1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>
            <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="pg-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: Tambah / Edit -->
    <Teleport to="body">
      <Transition name="modal">
        <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
          <div class="modal">
            <div class="modal-header">
              <h3>{{ isEditing ? 'Edit Departemen' : 'Tambah Departemen' }}</h3>
              <button class="modal-close" @click="closeModal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Nama Departemen</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Masukkan nama departemen"
                  @keyup.enter="saveData"
                  autofocus
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="closeModal">Batal</button>
              <button class="btn-save" @click="saveData" :disabled="isSaving">
                <span v-if="isSaving" class="btn-spinner"></span>
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL: Konfirmasi Hapus -->
    <Teleport to="body">
      <Transition name="modal">
        <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
          <div class="modal modal-sm">
            <div class="modal-header">
              <h3>Hapus Departemen</h3>
              <button class="modal-close" @click="showDeleteModal = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <p class="delete-confirm-text">
                Yakin ingin menghapus departemen <strong>{{ deleteTargetName }}</strong>?
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showDeleteModal = false">Batal</button>
              <button class="btn-danger" @click="deleteData" :disabled="isDeleting">
                <span v-if="isDeleting" class="btn-spinner"></span>
                {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST NOTIFICATIONS -->
    <Teleport to="body">
      <div class="toast-container">
        <TransitionGroup name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast"
            :class="'toast--' + toast.type"
          >
            <div class="toast-icon">
              <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <span class="toast-msg">{{ toast.message }}</span>
            <button class="toast-close" @click="removeToast(toast.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import { useDepartmentCreate, type DepartmentForm } from '@/composables/useCreate'
import { useDepartmentEdit } from '@/composables/useEdit'
import { useDepartmentList, type DepartmentListItem } from '@/composables/useList'
import { useDeleteDepartment } from '@/composables/useDelete'
import { useToast } from '@/composables/useToast'

const activeNav = ref('departemen')

const { toasts, removeToast } = useToast()
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const showDeleteModal = ref(false)
const deleteTarget = ref<number | null>(null)
const deleteTargetName = ref('')
const form = ref<DepartmentForm>({ name: '' })

const {
  items: departemenList,
    isLoading,
    loadData,
    currentPage,
    perPage,
    totalPages,
    paginatedData,
} = useDepartmentList()

const { isSaving: isCreating, createDepartment } = useDepartmentCreate()
const { isSaving: isUpdating, updateDepartment } = useDepartmentEdit()
const { isDeleting, deleteItem } = useDeleteDepartment()
const isSaving = computed(() => isCreating.value || isUpdating.value)

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '' }
  showModal.value = true
}

const openEditModal = (item: DepartmentListItem) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { name: item.name }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveData = async () => {
  if (!form.value.name.trim()) {
    window.alert('Nama departemen tidak boleh kosong')
    return
  }

  const payload: DepartmentForm = { name: form.value.name.trim() }

  if (isEditing.value && editingId.value !== null) {
    const success = await updateDepartment(editingId.value, payload)
    if (!success) return
  } else {
    const created = await createDepartment(payload)
    if (!created) return
  }

  showModal.value = false
  await loadData()
}

const confirmDelete = (item: DepartmentListItem) => {
  deleteTarget.value = item.id
  deleteTargetName.value = item.name
  showDeleteModal.value = true
}

const deleteData = async () => {
  if (deleteTarget.value === null) return

  const success = await deleteItem(deleteTarget.value)
  if (!success) return

  showDeleteModal.value = false
  await loadData()
}

const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.page-root {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f0f2f5;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== CONTENT ===== */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-area::-webkit-scrollbar       { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

/* ===== BREADCRUMB ===== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bc-parent  { color: #888; }
.bc-sep     { color: #bbb; }
.bc-current { color: #1a2e25; font-weight: 600; }

/* ===== PAGE HEADER ===== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a2e25;
  letter-spacing: -0.4px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2e7d5e;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.1s;
}

.btn-add:hover  { background: #256b50; transform: translateY(-1px); }
.btn-add:active { transform: translateY(0); }

/* ===== TABLE CARD ===== */
.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
  overflow: hidden;
}

.table-card-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.table-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2e25;
}

/* ===== LOADING ===== */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 12px;
  color: #aaa;
  font-size: 13px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e8f5ee;
  border-top-color: #2e7d5e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 10px;
  text-align: center;
}

.empty-state p    { font-size: 15px; font-weight: 600; color: #555; margin-top: 4px; }
.empty-state span { font-size: 13px; color: #aaa; }

/* ===== TABLE ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  padding: 12px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-align: left;
}

.data-table tbody tr {
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.1s;
}

.data-table tbody tr:last-child { border-bottom: none; }
.data-table tbody tr:hover      { background: #fafffe; }

.data-table td {
  padding: 16px 24px;
  font-size: 14px;
  color: #2a2a2a;
}

.col-nama { width: 80%; }
.col-aksi { width: 20%; }

/* ===== ROW TRANSITION ===== */
.row-enter-active { transition: all 0.3s ease; }
.row-leave-active { transition: all 0.2s ease; }
.row-enter-from   { opacity: 0; transform: translateY(-6px); }
.row-leave-to     { opacity: 0; transform: translateX(12px); }
.row-move         { transition: transform 0.3s ease; }

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2e7d5e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-edit:hover { background: #256b50; }

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: #fff;
  border: 1.5px solid #e8d0d0;
  border-radius: 8px;
  cursor: pointer;
  color: #d05050;
  transition: all 0.15s;
}

.btn-delete:hover {
  background: #fff0f0;
  border-color: #d05050;
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.pg-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.15s;
}

.pg-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
  color: #333;
}

.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-info {
  font-size: 13px;
  color: #666;
  padding: 0 12px;
  background: #f7f7f7;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

/* ===== MODAL TRANSITION ===== */
.modal-enter-active { transition: opacity 0.25s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }

.modal-enter-active .modal,
.modal-enter-active .modal-sm { animation: modalIn 0.25s ease; }
.modal-leave-active .modal,
.modal-leave-active .modal-sm { animation: modalOut 0.2s ease forwards; }

@keyframes modalIn  { from { transform: translateY(-12px) scale(0.97); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes modalOut { from { transform: none; opacity: 1; } to { transform: translateY(-8px) scale(0.97); opacity: 0; } }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  overflow: hidden;
}

.modal-sm { width: 380px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a2e25;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.15s;
}

.modal-close:hover { background: #eee; color: #333; }

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.form-group input {
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
}

.form-group input:focus {
  border-color: #2e7d5e;
  box-shadow: 0 0 0 3px rgba(46,125,94,0.1);
}

.form-group input::placeholder { color: #bbb; }

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.delete-confirm-text {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.delete-confirm-text strong { color: #1a2e25; }

/* ===== BUTTONS ===== */
.btn-cancel {
  padding: 9px 20px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  font-size: 13.5px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.btn-cancel:hover { background: #f5f5f5; }

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: #2e7d5e;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-save:hover:not(:disabled) { background: #256b50; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: #d05050;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-danger:hover:not(:disabled) { background: #b83e3e; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* ===== BUTTON SPINNER ===== */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}

/* ===== TOAST ===== */
.toast-container {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  min-width: 260px;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  pointer-events: all;
  font-size: 13.5px;
  font-weight: 500;
}

.toast--success {
  background: #f0faf5;
  border: 1.5px solid #b6e2ce;
  color: #1a6044;
}

.toast--error {
  background: #fff5f5;
  border: 1.5px solid #f5c0c0;
  color: #a03030;
}

.toast-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast--success .toast-icon { background: #2e7d5e; color: #fff; }
.toast--error   .toast-icon { background: #d05050; color: #fff; }

.toast-msg  { flex: 1; line-height: 1.4; }

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.5;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.toast-close:hover { opacity: 1; }

/* ===== TOAST TRANSITION ===== */
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(40px) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(40px); }
.toast-move         { transition: transform 0.3s ease; }
</style>