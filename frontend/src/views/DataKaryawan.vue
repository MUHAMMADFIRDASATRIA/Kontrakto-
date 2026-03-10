<template>
  <div class="page-root">
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <div class="main-wrap">
      <AppTopbar username="Admin (HRD)" />

      <div class="content-area">

        <!-- Breadcrumb + Button -->
        <div class="top-row">
          <div class="breadcrumb">
            <span class="bc-parent">Master Data</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">Data Karyawan</span>
          </div>
          <button class="btn-add" @click="openAddModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Karyawan
          </button>
        </div>

        <!-- Title -->
        <div class="title-block">
          <h1 class="page-title">Data Karyawan</h1>
          <p class="page-sub">{{ karyawanList.length }} Karyawan</p>
        </div>

        <!-- Table Card -->
        <div class="table-card">

          <!-- Filter Bar -->
          <div class="filter-bar">
            <div class="filter-select">
              <select v-model="filterDept">
                <option value="">Departemen</option>
                <option v-for="d in departemenOptions" :key="d" :value="d">{{ d.name }}</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>

            <div class="filter-select sortir">
              <span class="sortir-label">Sortir</span>
              <select v-model="sortBy">
                <option value="nama-asc">Nama (A-Z)</option>
                <option value="nama-desc">Nama (Z-A)</option>
                <option value="dept">Departemen</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>

            <div class="search-input">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Cari nama atau email..." />
            </div>
          </div>

          <!-- Table -->
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-no">No</th>
                <th class="col-nama">Nama Lengkap</th>
                <th class="col-email">Email</th>
                <th class="col-dept">Jabatan</th>
                <th class="col-aksi1">Aksi</th>
                <th class="col-aksi2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.id">
                <td class="col-no td-no">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td class="col-nama">
                  <div class="karyawan-cell">
                    <div class="avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#bbb"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    </div>
                    <div class="nama-info">
                      <p class="nama-text">{{ item.name }}</p>
                      <p class="email-sub">{{ item.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="col-email td-email">{{ item.email }}</td>
                <td class="col-dept">
                  <span class="dept-badge">{{ item.position?.title }}</span>
                </td>
                <td class="col-aksi1">
                  <button class="btn-edit" @click="openEditModal(item)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </td>
                <td class="col-aksi2">
                  <div class="aksi2-wrap">
                    <button class="btn-delete" @click="confirmDelete(item)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                    <button class="btn-more">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td colspan="6" class="empty-row">Tidak ada data ditemukan.</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination-bar">
            <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <template v-for="p in visiblePages" :key="p + '-' + Math.random()">
              <span v-if="p === '...'" class="pg-ellipsis">...</span>
              <button v-else class="pg-num" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            </template>

            <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div class="pg-per-page">
              <select v-model="perPage" @change="currentPage = 1">
                <option :value="5">5 / page</option>
                <option :value="10">10 / page</option>
                <option :value="25">25 / page</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: Tambah / Edit -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit Karyawan' : 'Tambah Karyawan' }}</h3>
            <button class="modal-close" @click="closeModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input v-model="form.name" type="text" placeholder="Masukkan nama lengkap" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="Masukkan email" />
            </div>
            <div class="form-group">
              <label>phone</label>
              <input v-model="form.phone" type="text" placeholder="Masukkan nomor telepon" />
            </div>
            <div class="form-group">
              <label>Alamat</label>
              <input v-model="form.address" type="text" placeholder="Masukkan alamat" />
            </div>
            <div class="form-group">
              <label>Positions</label>
              <select v-model="form.position_id">
                <option value="" disabled>Pilih jabatan</option>
                <option v-for="p in jabatanList" :key="p.id" :value="p.id">{{ p.title }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" :disabled="isSaving" @click="closeModal">Batal</button>
            <button class="btn-save" :disabled="isSaving" @click="saveData">
              <span v-if="isSaving" class="btn-spinner"></span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Konfirmasi Hapus -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3>Hapus Karyawan</h3>
            <button class="modal-close" @click="showDeleteModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="delete-confirm-text">
              Yakin ingin menghapus <strong>{{ deleteTargetName }}</strong>?
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" :disabled="isDeleting" @click="showDeleteModal = false">Batal</button>
            <button class="btn-danger" :disabled="isDeleting" @click="deleteData">
              <svg v-if="isDeleting" class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 0 1 10 10" /></svg>
              {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import { useKaryawan } from '@/composables/useKaryawan.js'
import { useToast } from '@/composables/useToast.js'

const activeNav = ref('karyawan')

const { toasts, addToast, removeToast } = useToast()

const {
  karyawanList,
  filterDept,
  sortBy,
  searchQuery,
  filteredData,
  departemenOptions,
  showModal,
  isEditing,
  form,
  paginatedData,
  currentPage,
  perPage,
  visiblePages,
  jabatanList,
  totalPages,
  isSaving,
  openAddModal,
  openEditModal,
  closeModal,
  showDeleteModal,
  deleteTarget,
  deleteTargetName,
  isDeleting,
  confirmDelete,
  deleteData,
  saveData,
  loadData,
  handleLogout,
} = useKaryawan()

onMounted(()=> {
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
  padding: 24px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.content-area::-webkit-scrollbar       { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

/* ===== TOP ROW ===== */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bc-parent  { color: #888; }
.bc-sep     { color: #bbb; }
.bc-current { color: #1a2e25; font-weight: 600; }

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

/* ===== TITLE BLOCK ===== */
.title-block { margin-top: 2px; }

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a2e25;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.page-sub {
  font-size: 13.5px;
  color: #999;
  margin-top: 4px;
}

/* ===== TABLE CARD ===== */
.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
  overflow: hidden;
}

/* ===== FILTER BAR ===== */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 9px 14px;
  cursor: pointer;
  min-width: 160px;
}

.filter-select select {
  border: none;
  background: none;
  outline: none;
  font-size: 13.5px;
  color: #333;
  font-family: inherit;
  cursor: pointer;
  flex: 1;
  appearance: none;
  font-weight: 500;
}

.filter-select.sortir {
  min-width: 190px;
}

.sortir-label {
  font-size: 13px;
  color: #888;
  white-space: nowrap;
  font-weight: 500;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 9px 14px;
  flex: 1;
}

.search-input input {
  border: none;
  background: none;
  outline: none;
  font-size: 13.5px;
  color: #444;
  font-family: inherit;
  width: 100%;
}
.search-input input::placeholder { color: #bbb; }

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
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #888;
  text-align: left;
}

.data-table tbody tr {
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.1s;
}
.data-table tbody tr:last-child { border-bottom: none; }
.data-table tbody tr:hover      { background: #fafffe; }

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #2a2a2a;
  vertical-align: middle;
}

.col-no    { width: 50px; }
.col-nama  { min-width: 220px; }
.col-email { min-width: 200px; }
.col-dept  { min-width: 120px; }
.col-aksi1 { width: 100px; }
.col-aksi2 { width: 90px; }

.td-no    { color: #bbb; font-size: 13px; }
.td-email { color: #888; font-size: 13.5px; }

/* ===== KARYAWAN CELL ===== */
.karyawan-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nama-info { display: flex; flex-direction: column; gap: 1px; }

.nama-text  { font-size: 14px; font-weight: 700; color: #1a1a1a; }
.email-sub  { font-size: 12px; color: #aaa; }

/* ===== DEPT BADGE ===== */
.dept-badge {
  display: inline-block;
  background: #f0f2f5;
  color: #555;
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

/* ===== AKSI ===== */
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

.aksi2-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-delete {
  width: 34px;
  height: 34px;
  background: #fff;
  border: 1.5px solid #e8d0d0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d05050;
  transition: all 0.15s;
}
.btn-delete:hover { background: #fff0f0; border-color: #d05050; }

.btn-more {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  border-radius: 6px;
  transition: all 0.15s;
}
.btn-more:hover { background: #f0f0f0; color: #666; }

.empty-row {
  text-align: center;
  color: #aaa;
  font-size: 13.5px;
  padding: 32px !important;
}

/* ===== PAGINATION ===== */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  position: relative;
}

.pg-btn {
  width: 34px;
  height: 34px;
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
.pg-btn:hover:not(:disabled) { background: #f5f5f5; border-color: #ccc; }
.pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.pg-num {
  min-width: 34px;
  height: 34px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.15s;
}
.pg-num:hover  { background: #f5f5f5; }
.pg-num.active { background: #2e7d5e; border-color: #2e7d5e; color: #fff; font-weight: 700; }

.pg-ellipsis {
  font-size: 13px;
  color: #aaa;
  padding: 0 4px;
  line-height: 34px;
}

.pg-per-page {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f7f7f9;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 7px 12px;
}

.pg-per-page select {
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  color: #555;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
}

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
  width: 460px;
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

.modal-header h3 { font-size: 16px; font-weight: 700; color: #1a2e25; }

.modal-close {
  width: 32px; height: 32px;
  border: none; background: #f5f5f5;
  border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #666; transition: all 0.15s;
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

.form-group label { font-size: 13px; font-weight: 600; color: #444; }

.form-group input,
.form-group select {
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;
}
.form-group input:focus,
.form-group select:focus      { border-color: #2e7d5e; }
.form-group input::placeholder { color: #bbb; }

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

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
.btn-save:hover { background: #256b50; }

.btn-danger {
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
.btn-danger:hover { background: #b83e3e; }

.delete-confirm-text { font-size: 14px; color: #555; line-height: 1.6; }
.delete-confirm-text strong { color: #1a2e25; }

/* ===== TOAST ===== */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
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
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.13);
  font-size: 13.5px;
  font-weight: 500;
  min-width: 260px;
  max-width: 360px;
  pointer-events: auto;
  border-left: 4px solid transparent;
}

.toast--success { border-left-color: #2e7d5e; color: #1a2e25; }
.toast--success .toast-icon { color: #2e7d5e; }

.toast--error { border-left-color: #d05050; color: #5c1a1a; }
.toast--error .toast-icon { color: #d05050; }

.toast-icon { display: flex; align-items: center; flex-shrink: 0; }
.toast-msg  { flex: 1; }

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s;
}
.toast-close:hover { color: #666; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.7s linear infinite; }

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

.toast-enter-from  { opacity: 0; transform: translateX(30px); }
.toast-enter-active { transition: opacity 0.25s, transform 0.25s; }
.toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-leave-to    { opacity: 0; transform: translateX(30px); }
</style>