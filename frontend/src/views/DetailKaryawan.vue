<template>
  <div class="dashboard-root">

    <!-- ───── SIDEBAR ───── -->
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <!-- ───── MAIN WRAP ───── -->
    <div class="main-wrap">

      <!-- TOPBAR -->
      <AppTopbar username="Admin (HRD)" />

      <!-- CONTENT -->
      <div class="content-area">

        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <span class="bc-link" @click="activeNav = 'karyawan'">Data Karyawan</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="bc-current">Profil Karyawan</span>
        </div>

        <!-- Profile Header -->
        <div class="profile-header-card">
          <div class="profile-left">
            <div class="profile-avatar">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#4db89e">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="profile-meta">
              <h2 class="profile-name">{{ employee.name }}</h2>
              <p class="profile-position">{{ employee.jabatan }}</p>
              <p class="profile-dept">{{ employee.departemen }}</p>
              <p class="profile-id">ID: {{ employee.id }}</p>
            </div>
          </div>
          <button class="btn-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profil
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs-bar">
          <button class="tab" :class="{ 'tab--active': activeTab === 'profil' }" @click="activeTab = 'profil'">Profil</button>
          <button class="tab" :class="{ 'tab--active': activeTab === 'pkwt' }"   @click="activeTab = 'pkwt'">PKWT</button>
        </div>

        <!-- TAB: PROFIL -->
        <div v-if="activeTab === 'profil'" class="info-grid">

          <!-- Informasi Pribadi -->
          <div class="info-card">
            <h3 class="info-title">Informasi Pribadi</h3>
            <div class="info-list">

              <div class="info-item">
                <div class="info-icon info-icon--yellow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Email:</strong> {{ employee.email }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.45 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.65a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Telp:</strong> {{ employee.telp }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span class="info-text">{{ employee.tanggalLahir }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--red">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <span class="info-text">{{ employee.alamat }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--purple">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                  </svg>
                </div>
                <span class="info-text">{{ employee.jenisKelamin }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--pink">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span class="info-text">{{ employee.statusPernikahan }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--teal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <span class="info-text">{{ employee.agama }}</span>
              </div>

            </div>
          </div>

          <!-- Informasi Pekerjaan -->
          <div class="info-card">
            <h3 class="info-title">Informasi Pekerjaan</h3>
            <div class="info-list">

              <div class="info-item">
                <div class="info-icon info-icon--yellow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Status:</strong> {{ employee.statusKontrak }}</span>
                <button class="btn-delete-small" title="Hapus">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                </button>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Termasuk:</strong> {{ employee.tanggalMasuk }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--gray">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Tempo. latar akhi:</strong> {{ employee.tanggalAkhirKontrak }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--blue2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Departemen:</strong> {{ employee.departemen }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--gray2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <span class="info-text"><strong>Jabatan:</strong> {{ employee.jabatan }}</span>
              </div>

              <div class="info-item">
                <div class="info-icon info-icon--green2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <span class="info-text">
                  <strong>Status:</strong>
                  <span class="status-badge" :class="employee.statusAktif === 'Aktif' ? 'badge--aktif' : 'badge--nonaktif'">
                    {{ employee.statusAktif }}
                  </span>
                </span>
              </div>

            </div>

            <!-- Pagination inside pekerjaan card -->
            <div class="card-pagination">
              <button class="pg-btn" @click="goPage(1)" :disabled="pkwtPage === 1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
                </svg>
              </button>
              <button class="pg-btn" @click="goPage(pkwtPage - 1)" :disabled="pkwtPage === 1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <span class="pg-label">Page {{ pkwtPage }} of {{ pkwtTotalPages }}</span>
              <button class="pg-btn" @click="goPage(pkwtPage + 1)" :disabled="pkwtPage === pkwtTotalPages">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="pg-btn" @click="goPage(pkwtTotalPages)" :disabled="pkwtPage === pkwtTotalPages">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
                </svg>
              </button>
            </div>
          </div>

        </div>

        <!-- TAB: PKWT -->
        <div v-else-if="activeTab === 'pkwt'" class="pkwt-section">
          <div class="info-card" style="max-width:100%">
            <h3 class="info-title">Riwayat PKWT</h3>
            <div class="pkwt-table">
              <div class="pkwt-head">
                <span class="pkwt-th">No</span>
                <span class="pkwt-th">Status</span>
                <span class="pkwt-th">Tanggal Mulai</span>
                <span class="pkwt-th">Tanggal Akhir</span>
                <span class="pkwt-th">Departemen</span>
                <span class="pkwt-th">Jabatan</span>
                <span class="pkwt-th">Aksi</span>
              </div>
              <div class="pkwt-row" v-for="(p, i) in pkwtList" :key="i">
                <span class="pkwt-td">{{ i + 1 }}</span>
                <span class="pkwt-td">
                  <span class="status-badge" :class="p.status === 'Aktif' ? 'badge--aktif' : 'badge--expired'">{{ p.status }}</span>
                </span>
                <span class="pkwt-td">{{ p.mulai }}</span>
                <span class="pkwt-td">{{ p.akhir }}</span>
                <span class="pkwt-td">{{ p.departemen }}</span>
                <span class="pkwt-td">{{ p.jabatan }}</span>
                <span class="pkwt-td">
                  <button class="btn-delete-small">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/Appsidebar.vue'
import AppTopbar from '@/components/Apptopbar.vue'

// ─── Types ─────────────────────────────────────────────
interface Employee {
  id: string
  name: string
  jabatan: string
  departemen: string
  email: string
  telp: string
  tanggalLahir: string
  alamat: string
  jenisKelamin: string
  statusPernikahan: string
  agama: string
  statusKontrak: string
  tanggalMasuk: string
  tanggalAkhirKontrak: string
  statusAktif: string
}

interface PkwtRecord {
  status: string
  mulai: string
  akhir: string
  departemen: string
  jabatan: string
}

// ─── State ─────────────────────────────────────────────
const activeNav = ref<string>('karyawan')
const activeTab = ref<'profil' | 'pkwt'>('profil')
const pkwtPage  = ref<number>(1)
const PKWT_PER_PAGE = 5
const router = useRouter()

// ─── Employee Data ──────────────────────────────────────
const employee = ref<Employee>({
  id:                  '1001',
  name:                'Budi Santoso',
  jabatan:             'Staff HRD',
  departemen:          'HRD & GA',
  email:               'tadabbrormail@ymar.com',
  telp:                '+6281234567890',
  tanggalLahir:        '15 Agustus 1990',
  alamat:              'Jl. Merdeka No. 123, Jakarta, Indonesia',
  jenisKelamin:        'Laki-laki',
  statusPernikahan:    'Menikah',
  agama:               'Islam',
  statusKontrak:       'PKWT',
  tanggalMasuk:        '01 Januari 2023',
  tanggalAkhirKontrak: '31 Desember 2025',
  statusAktif:         'Aktif',
})

// ─── PKWT History ──────────────────────────────────────
const allPkwtList = ref<PkwtRecord[]>([
  { status:'Aktif',    mulai:'01 Jan 2023', akhir:'31 Des 2025', departemen:'HRD & GA',   jabatan:'Staff HRD'   },
  { status:'Expired',  mulai:'01 Jan 2021', akhir:'31 Des 2022', departemen:'HRD & GA',   jabatan:'Admin HRD'   },
  { status:'Expired',  mulai:'01 Mar 2019', akhir:'28 Feb 2021', departemen:'Operasional', jabatan:'Staff Admin' },
  { status:'Expired',  mulai:'01 Jun 2017', akhir:'31 Mei 2019', departemen:'Finance',     jabatan:'Staf Finance'},
  { status:'Expired',  mulai:'01 Jan 2016', akhir:'31 Des 2016', departemen:'IT',          jabatan:'IT Support'  },
])

const pkwtTotalPages = computed(() => Math.max(1, Math.ceil(allPkwtList.value.length / PKWT_PER_PAGE)))

const pkwtList = computed<PkwtRecord[]>(() => {
  const s = (pkwtPage.value - 1) * PKWT_PER_PAGE
  return allPkwtList.value.slice(s, s + PKWT_PER_PAGE)
})

// ─── Methods ───────────────────────────────────────────
function goPage(p: number): void {
  pkwtPage.value = Math.min(Math.max(1, p), pkwtTotalPages.value)
}

function handleLogout(): void {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ══════════ LAYOUT ══════════ */
.dashboard-root {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f0f2f8;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* ══════════ MAIN ══════════ */
.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ══════════ CONTENT ══════════ */
.content-area {
  flex: 1; overflow-y: auto;
  padding: 24px 28px 40px;
  display: flex; flex-direction: column; gap: 18px;
}

.content-area::-webkit-scrollbar { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

/* Breadcrumb */
.breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px;
}

.bc-link { color: #888; cursor: pointer; transition: color 0.15s; }
.bc-link:hover { color: #2e7d55; }
.bc-current { color: #1a2e25; font-weight: 600; }

/* Profile Header Card */
.profile-header-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 28px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
}

.profile-left { display: flex; align-items: center; gap: 22px; }

.profile-avatar {
  width: 88px; height: 88px; border-radius: 50%;
  background: #eef8f3;
  border: 3px solid #d0ede3;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.profile-meta { display: flex; flex-direction: column; gap: 3px; }

.profile-name { font-size: 22px; font-weight: 800; color: #1a2e25; letter-spacing: -0.3px; }

.profile-position { font-size: 14px; font-weight: 600; color: #4db89e; margin-top: 2px; }

.profile-dept { font-size: 13.5px; color: #777; }

.profile-id { font-size: 13px; color: #aaa; margin-top: 1px; }

.btn-edit {
  display: flex; align-items: center; gap: 8px;
  height: 42px; padding: 0 20px;
  background: #2e7d55; color: #fff;
  border: none; border-radius: 11px;
  font-size: 13.5px; font-weight: 700;
  font-family: inherit; cursor: pointer;
  box-shadow: 0 4px 14px rgba(46,125,85,0.22);
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  flex-shrink: 0;
}

.btn-edit:hover {
  background: #256647;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(46,125,85,0.28);
}

/* ══════════ TABS ══════════ */
.tabs-bar {
  display: flex; gap: 0;
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 0 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  border-bottom: 1px solid #f0f0f0;
}

.tab {
  padding: 14px 22px;
  font-size: 14px; font-weight: 600; color: #aaa;
  background: none; border: none; border-bottom: 2.5px solid transparent;
  cursor: pointer; font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}

.tab:hover { color: #555; }

.tab--active { color: #1a2e25; border-bottom-color: #2e7d55; }

/* ══════════ INFO GRID ══════════ */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-card {
  background: #fff;
  border-radius: 0 0 14px 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.info-title {
  font-size: 15px; font-weight: 700; color: #1a2e25;
  margin-bottom: 16px;
}

.info-list { display: flex; flex-direction: column; gap: 4px; }

.info-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid #f0f2f5;
  background: #fafbfd;
  transition: background 0.12s;
}

.info-item:hover { background: #f4f6fa; }

.info-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.info-icon--yellow  { background: #fff8e1; color: #e0a010; }
.info-icon--green   { background: #e6f9f0; color: #2e7d55; }
.info-icon--blue    { background: #e8f2ff; color: #2563eb; }
.info-icon--red     { background: #fdecea; color: #d05050; }
.info-icon--purple  { background: #f3eeff; color: #7c3aed; }
.info-icon--pink    { background: #fdeef5; color: #c2185b; }
.info-icon--teal    { background: #e6f9f4; color: #0d8f70; }
.info-icon--gray    { background: #f0f0f3; color: #888;    }
.info-icon--blue2   { background: #e0f0ff; color: #1a6ab0; }
.info-icon--gray2   { background: #f2f2f5; color: #777;    }
.info-icon--green2  { background: #e6f9f0; color: #2e7d55; }

.info-text {
  flex: 1; font-size: 13.5px; color: #333; line-height: 1.4;
}

.info-text strong { color: #1a2e25; }

/* Delete small btn inside info row */
.btn-delete-small {
  width: 28px; height: 28px;
  border: 1px solid #f0d0d0;
  border-radius: 7px;
  background: #fff5f5;
  color: #e07070;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.btn-delete-small:hover { background: #fdecea; color: #d05050; }

/* Status badge */
.status-badge {
  display: inline-flex; align-items: center;
  padding: 3px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
  margin-left: 4px;
}

.badge--aktif   { background: #e6f9f0; color: #2e7d55; }
.badge--nonaktif { background: #f0f0f3; color: #888; }
.badge--expired { background: #fdecea; color: #d05050; }

/* Pagination inside card */
.card-pagination {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  margin-top: 16px; padding-top: 14px;
  border-top: 1px solid #f0f0f0;
}

.pg-btn {
  width: 30px; height: 30px;
  border: 1px solid #e8e8ee; border-radius: 8px;
  background: #fff; color: #888;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.pg-btn:hover:not(:disabled) {
  background: #f0f8f4; border-color: #c0ddd0; color: #2e7d55;
}

.pg-btn:disabled { opacity: 0.35; cursor: default; }

.pg-label {
  font-size: 12.5px; font-weight: 600; color: #777;
  padding: 0 8px; min-width: 96px; text-align: center;
}

/* ══════════ PKWT TAB ══════════ */
.pkwt-section { display: flex; flex-direction: column; gap: 16px; }

.pkwt-table { display: flex; flex-direction: column; gap: 0; }

.pkwt-head {
  display: grid;
  grid-template-columns: 40px 80px 1fr 1fr 1fr 1fr 60px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 4px;
}

.pkwt-th {
  font-size: 11.5px; font-weight: 700; color: #b0b8c4;
  text-transform: uppercase; letter-spacing: 0.3px;
}

.pkwt-row {
  display: grid;
  grid-template-columns: 40px 80px 1fr 1fr 1fr 1fr 60px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f2f5;
  margin-bottom: 6px;
  align-items: center;
  background: #fafbfd;
  transition: background 0.12s;
}

.pkwt-row:hover { background: #f4f6fa; }

.pkwt-td { font-size: 13px; color: #444; }
</style>