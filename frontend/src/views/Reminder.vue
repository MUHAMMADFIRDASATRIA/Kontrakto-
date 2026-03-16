<template>
  <div class="dashboard-root">

    <!-- ───── SIDEBAR ───── -->
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <!-- ───── MAIN WRAP ───── -->
    <div class="main-wrap">

      <!-- TOPBAR -->
       <AppTopbar username="Admin (HRD)" />
      <!-- SCROLLABLE CONTENT -->
      <div class="content-area">

        <div class="page-header">
          <h1 class="page-title">Reminder</h1>
        </div>

        <!-- ─── SUMMARY CARDS ─── -->
        <div class="summary-grid">

          <div class="summary-card" :class="{ 'summary-card--active': activeFilter === 'akan_berakhir' }" @click="setFilter('akan_berakhir')">
            <div class="s-icon s-icon--orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span class="s-label">PKWT Akan Berakhir</span>
          </div>

          <div class="summary-card" :class="{ 'summary-card--active': activeFilter === 'expired' }" @click="setFilter('expired')">
            <div class="s-icon s-icon--red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span class="s-label">PKWT Expired</span>
            <span class="s-badge s-badge--red">{{ expiredCount }}</span>
          </div>

          <div class="summary-card" :class="{ 'summary-card--active': activeFilter === 'jatuh_tempo' }" @click="setFilter('jatuh_tempo')">
            <div class="s-icon s-icon--teal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span class="s-label">PKWT Jatuh Tempo</span>
            <span class="s-badge s-badge--teal">{{ jatuhTempoCount }}</span>
          </div>

        </div>

        <!-- ─── NOTIFICATION CARD ─── -->
        <div class="card notif-card">

          <!-- Header row: tabs + actions -->
          <div class="notif-header">
            <div class="tabs">
              <button class="tab" :class="{ 'tab--active': activeTab === 'semua' }" @click="switchTab('semua')">Semua</button>
              <button class="tab" :class="{ 'tab--active': activeTab === 'pkwt' }"  @click="switchTab('pkwt')">PKWT</button>
            </div>
            <div class="header-actions">
              <button class="btn-mark-all" @click="markAllRead">Tandai Semua Dibaca</button>
              <button class="btn-more">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Table head -->
          <div class="t-head">
            <span class="th c-notif">Notifikasi</span>
            <span class="th c-jabatan">Jabatan</span>
            <span class="th c-dept">Departemen</span>
            <span class="th c-tempo">Jatuh Tempo</span>
            <span class="th c-act"></span>
          </div>

          <!-- Table rows -->
          <div class="t-body">
            <div
              v-for="(item, i) in paginatedItems"
              :key="i"
              class="t-row"
              :class="{ 't-row--unread': !item.read }"
            >
              <div class="td c-notif">
                <div class="n-icon" :class="iconCls(item.type)">
                  <svg v-if="item.type === 'warning'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <svg v-else-if="item.type === 'expired'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <svg v-else-if="item.type === 'success'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                </div>
                <div class="n-text">
                  <p class="n-msg" v-html="item.message"></p>
                  <p class="n-time">{{ item.time }}</p>
                </div>
              </div>

              <div class="td c-jabatan"><span class="cell">{{ item.jabatan || '—' }}</span></div>
              <div class="td c-dept"><span class="cell">{{ item.departemen || '—' }}</span></div>

              <div class="td c-tempo">
                <span v-if="item.jatuhTempo != null" class="pill" :class="pillCls(item.jatuhTempo)">
                  {{ item.jatuhTempo }} Hari lagi
                </span>
                <span v-else class="cell">—</span>
              </div>

              <div class="td c-act">
                <button class="btn-delete" @click="deleteItem(i)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="paginatedItems.length === 0" class="t-empty">
              <div class="empty-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p>Tidak ada notifikasi</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button class="pg-btn" @click="goPage(1)" :disabled="page === 1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
            <button class="pg-btn" @click="goPage(page - 1)" :disabled="page === 1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span class="pg-label">Page {{ page }} of {{ totalPages }}</span>
            <button class="pg-btn" @click="goPage(page + 1)" :disabled="page === totalPages">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <button class="pg-btn" @click="goPage(totalPages)" :disabled="page === totalPages">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/Appsidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import App from '@/App.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// ─── Types ─────────────────────────────────────
type NotifType   = 'warning' | 'expired' | 'success' | 'deleted'
type FilterType  = 'semua' | 'akan_berakhir' | 'expired' | 'jatuh_tempo'
type TabType     = 'semua' | 'pkwt'

interface Notif {
  type: NotifType
  message: string
  time: string
  jabatan?: string
  departemen?: string
  jatuhTempo?: number
  read: boolean
  category: 'pkwt' | 'general'
}

// ─── State ─────────────────────────────────────
const activeNav    = ref<string>('reminder')
const activeTab    = ref<TabType>('semua')
const activeFilter = ref<FilterType>('semua')
const page         = ref<number>(1)
const PER_PAGE     = 6

// ─── Data ──────────────────────────────────────
const notifications = ref<Notif[]>([
  { type:'warning',  message:'Kontrak PKWT <strong>Dewi Lestari</strong> akan berakhir dalam <strong>5 hari lagi</strong>',                                          time:'14 menit yang lalu', jabatan:'Staff Admin',    departemen:'Administrasi',     jatuhTempo:12, read:false, category:'pkwt' },
  { type:'expired',  message:'Kontrak PKWT <strong>Budi Santoso</strong> telah berakhir',                                                                              time:'30 menit yang lalu', jabatan:'Operator',       departemen:'Produksi',         jatuhTempo:18, read:false, category:'pkwt' },
  { type:'success',  message:'PKWT <strong>Ahmad Fauzi</strong> berhasil diperbarui, kontrak diperpanjang hingga <strong>09 Sep 2025</strong>.',                        time:'2 jam yang lalu',    jabatan:'Senior Dev',     departemen:'IT',               jatuhTempo:25, read:true,  category:'pkwt' },
  { type:'expired',  message:'Kontrak PKWT <strong>Agus Pratama</strong> telah berakhir',                                                                              time:'5 jam yang lalu',    jabatan:'Sales Executive',departemen:'Sales',            jatuhTempo:5,  read:false, category:'pkwt' },
  { type:'success',  message:'PKWT <strong>Rizky Ananda</strong> berhasil dibuat, kontrak dimulai pada <strong>20 Apr 2025</strong> hingga <strong>19 Apr 2026</strong>.',time:'6 jam yang lalu',  jabatan:'Marketing',      departemen:'Marketing',                       read:true,  category:'pkwt' },
  { type:'deleted',  message:'PKWT <strong>Agus Pratama</strong> telah dihapus',                                                                                       time:'7 jam yang lalu',    jabatan:'Sales Executive',departemen:'Sales',                           read:true,  category:'pkwt' },
  { type:'warning',  message:'Kontrak PKWT <strong>Siti Aminah</strong> akan berakhir dalam <strong>10 hari lagi</strong>',                                            time:'1 hari yang lalu',   jabatan:'HRD Staff',      departemen:'HRD & GA',         jatuhTempo:10, read:true,  category:'pkwt' },
  { type:'warning',  message:'Kontrak PKWT <strong>Dian Pratiwi</strong> akan berakhir dalam <strong>3 hari lagi</strong>',                                            time:'1 hari yang lalu',   jabatan:'Finance',        departemen:'Finance',          jatuhTempo:3,  read:false, category:'pkwt' },
  { type:'success',  message:'PKWT <strong>Hendra Kusuma</strong> berhasil diperbarui hingga <strong>15 Des 2025</strong>.',                                           time:'2 hari yang lalu',   jabatan:'IT Support',     departemen:'IT',               jatuhTempo:30, read:true,  category:'pkwt' },
  { type:'expired',  message:'Kontrak PKWT <strong>Rini Wulandari</strong> telah berakhir',                                                                            time:'3 hari yang lalu',   jabatan:'QC Inspector',   departemen:'Quality Control',  jatuhTempo:0,  read:true,  category:'pkwt' },
  { type:'warning',  message:'Kontrak PKWT <strong>Fajar Nugroho</strong> akan berakhir dalam <strong>7 hari lagi</strong>',                                           time:'4 hari yang lalu',   jabatan:'Supervisor',     departemen:'Operasional',      jatuhTempo:7,  read:true,  category:'pkwt' },
  { type:'success',  message:'PKWT <strong>Maya Sari</strong> berhasil dibuat, kontrak dimulai pada <strong>01 Mar 2025</strong> hingga <strong>28 Feb 2026</strong>.', time:'5 hari yang lalu',   jabatan:'Desainer',       departemen:'Kreatif',          jatuhTempo:20, read:true,  category:'pkwt' },
])

// ─── Computed ──────────────────────────────────
const expiredCount    = computed(() => notifications.value.filter(n => n.type === 'expired').length)
const jatuhTempoCount = computed(() => notifications.value.filter(n => n.jatuhTempo != null && n.jatuhTempo <= 7).length)

const filtered = computed<Notif[]>(() => {
  let list = activeTab.value === 'pkwt'
    ? notifications.value.filter(n => n.category === 'pkwt')
    : notifications.value

  if (activeFilter.value === 'akan_berakhir') return list.filter(n => n.type === 'warning')
  if (activeFilter.value === 'expired')       return list.filter(n => n.type === 'expired')
  if (activeFilter.value === 'jatuh_tempo')   return list.filter(n => n.jatuhTempo != null && n.jatuhTempo <= 7)
  return list
})

const totalPages     = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)))
const paginatedItems = computed<Notif[]>(() => {
  const s = (page.value - 1) * PER_PAGE
  return filtered.value.slice(s, s + PER_PAGE)
})

const router = useRouter()

const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
}

// ─── Methods ───────────────────────────────────
function setFilter(f: FilterType): void {
  activeFilter.value = activeFilter.value === f ? 'semua' : f
  page.value = 1
}
function switchTab(t: TabType): void {
  activeTab.value = t
  page.value = 1
}
function markAllRead(): void {
  notifications.value.forEach(n => { n.read = true })
}
function deleteItem(localIdx: number): void {
  const item = filtered.value[(page.value - 1) * PER_PAGE + localIdx]
  if (!item) return
  const realIdx = notifications.value.indexOf(item)
  if (realIdx !== -1) notifications.value.splice(realIdx, 1)
  if (page.value > totalPages.value) page.value = totalPages.value
}
function goPage(p: number): void {
  page.value = Math.min(Math.max(1, p), totalPages.value)
}
function iconCls(t: NotifType): string {
  return ({ warning:'ico--orange', expired:'ico--red', success:'ico--green', deleted:'ico--gray' } as Record<NotifType,string>)[t]
}
function pillCls(days: number): string {
  if (days <= 5)  return 'pill--urgent'
  if (days <= 14) return 'pill--warn'
  return 'pill--ok'
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ═══════ LAYOUT ═══════ */
.dashboard-root {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f0f2f8;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* ═══════ MAIN WRAP ═══════ */
.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ═══════ CONTENT AREA ═══════ */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-area::-webkit-scrollbar { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

.page-header { padding-bottom: 2px; }

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2e25;
  letter-spacing: -0.3px;
}

/* ═══════ SUMMARY CARDS ═══════ */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.summary-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  user-select: none;
}

.summary-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
}

.summary-card--active {
  border-color: #4db89e;
  background: #f5fdf9;
}

.s-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.s-icon--orange { background: #fff3e0; color: #e07a10; }
.s-icon--red    { background: #fdecea; color: #d05050; }
.s-icon--teal   { background: #e6f9f4; color: #2e7d55; }

.s-label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #2a2a2a;
}

.s-badge {
  font-size: 18px;
  font-weight: 800;
}

.s-badge--red  { color: #d05050; }
.s-badge--teal { color: #2e7d55; }

/* ═══════ CARD ═══════ */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
}

.notif-card { overflow: hidden; }

/* ─ Notification header ─ */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tabs { display: flex; }

.tab {
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}

.tab:hover { color: #555; }

.tab--active {
  color: #1a2e25;
  border-bottom-color: #2e7d55;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
}

.btn-mark-all {
  height: 38px;
  padding: 0 18px;
  background: #2e7d55;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.btn-mark-all:hover { background: #256647; transform: translateY(-1px); }

.btn-more {
  width: 38px; height: 38px;
  border: 1px solid #e8e8ee;
  border-radius: 10px;
  background: #fff;
  color: #888;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-more:hover { background: #f5f5f7; }

/* ─ Table head ─ */
.t-head {
  display: grid;
  grid-template-columns: 1fr 140px 160px 130px 50px;
  padding: 10px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.th {
  font-size: 11.5px;
  font-weight: 700;
  color: #b0b8c4;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ─ Table body ─ */
.t-body { min-height: 160px; }

.t-row {
  display: grid;
  grid-template-columns: 1fr 140px 160px 130px 50px;
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f8;
  align-items: center;
  transition: background 0.12s;
}

.t-row:last-child { border-bottom: none; }
.t-row:hover { background: #fafbff; }
.t-row--unread { background: #fffffe; }

.td { display: flex; align-items: center; }
.c-notif { gap: 12px; }
.c-jabatan, .c-dept, .c-tempo { padding-left: 8px; }
.c-act { justify-content: center; }

/* Notif icon */
.n-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.ico--orange { background: #fff3e0; color: #e07a10; }
.ico--red    { background: #fdecea; color: #d05050; }
.ico--green  { background: #e6f9f0; color: #2e7d55; }
.ico--gray   { background: #f0f0f3; color: #9a9aaa; }

.n-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

.n-msg {
  font-size: 13.5px;
  color: #2a2a2a;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 440px;
}

.n-time { font-size: 11.5px; color: #c0c8d0; }

.cell { font-size: 13px; color: #666; }

/* Pill */
.pill {
  display: inline-block;
  padding: 4px 11px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.pill--urgent { background: #fdecea; color: #d05050; }
.pill--warn   { background: #fff3cd; color: #c8960d; }
.pill--ok     { background: #e6f9f0; color: #2e7d55; }

/* Delete btn */
.btn-delete {
  width: 32px; height: 32px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  color: #ccc;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-delete:hover { background: #fdecea; color: #d05050; border-color: #f5c6c6; }

/* Empty */
.t-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 0;
  color: #c0c8d0;
  font-size: 13px;
}

.empty-ico {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: #f5f6fa;
  display: flex; align-items: center; justify-content: center;
  color: #ccc;
}

/* ═══════ PAGINATION ═══════ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
}

.pg-btn {
  width: 34px; height: 34px;
  border: 1px solid #e8e8ee;
  border-radius: 9px;
  background: #fff;
  color: #888;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.pg-btn:hover:not(:disabled) {
  background: #f0f8f4;
  border-color: #c0ddd0;
  color: #2e7d55;
}

.pg-btn:disabled { opacity: 0.35; cursor: default; }

.pg-label {
  font-size: 13px;
  font-weight: 600;
  color: #777;
  padding: 0 8px;
  min-width: 110px;
  text-align: center;
}
</style>