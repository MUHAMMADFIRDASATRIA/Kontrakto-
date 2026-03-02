<template>
  <div class="dashboard-root">

    <!-- SIDEBAR -->
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <!-- MAIN CONTENT -->
    <div class="main-wrap">

      <!-- TOPBAR -->
      <AppTopbar username="Admin (HRD)" />

      <!-- SCROLLABLE CONTENT -->
      <div class="content-area">

        <!-- Page Title -->
        <h1 class="page-title">Rekap Karyawan PKWT</h1>

        <!-- STAT CARDS -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon teal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Karyawan</p>
              <h3 class="stat-value">232</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">PKWT Aktif</p>
              <h3 class="stat-value green-text">120</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Near Expiry</p>
              <h3 class="stat-value yellow-text">8</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Sudah Berakhir</p>
              <h3 class="stat-value red-text">5</h3>
            </div>
          </div>
        </div>

        <!-- ROW 2: Chart + Departemen -->
        <div class="row-two">

          <!-- Bar Chart -->
          <div class="card chart-card">
            <div class="card-header">
              <h3 class="card-title">Grafik PKWT Berakhir Periode</h3>
              <div class="year-select">
                2024
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="chart-wrap" ref="chartWrap">
              <svg
                :width="chartW"
                :height="chartH"
                :viewBox="`0 0 ${chartW} ${chartH}`"
                style="display:block;width:100%;"
              >
                <template v-for="(tick, ti) in yTicks" :key="'tick'+ti">
                  <line
                    :x1="yAxisW" :y1="chartTopPad + (chartInnerH / (yTicks.length-1)) * ti"
                    :x2="chartW - 8" :y2="chartTopPad + (chartInnerH / (yTicks.length-1)) * ti"
                    stroke="#f0f0f0" stroke-width="1"
                  />
                  <text
                    :x="yAxisW - 6"
                    :y="chartTopPad + (chartInnerH / (yTicks.length-1)) * ti + 4"
                    fill="#c0c0c0" font-size="11" text-anchor="end"
                  >{{ tick }}</text>
                </template>

                <template v-for="(m, mi) in chartData" :key="'bar'+mi">
                  <rect :x="barX(mi)" :y="barY(m.active)" :width="barW" :height="barPx(m.active)" rx="3" fill="#4db89e"/>
                  <rect v-if="m.near > 0" :x="barX(mi)" :y="barY(m.active + m.near)" :width="barW" :height="barPx(m.near)" rx="3" fill="#f0c04a"/>
                  <rect v-if="m.exp > 0" :x="barX(mi)" :y="barY(m.active + m.near + m.exp)" :width="barW" :height="barPx(m.exp)" rx="3" fill="#e07070"/>
                  <text
                    :x="barX(mi) + barW / 2"
                    :y="chartTopPad + chartInnerH + 18"
                    fill="#b0b0b0" font-size="11" text-anchor="middle"
                  >{{ m.label }}</text>
                </template>
              </svg>

              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot" style="background:#4db89e"></span> Active</span>
                <span class="legend-item"><span class="legend-dot" style="background:#f0c04a"></span> Near Expiry</span>
                <span class="legend-item"><span class="legend-dot" style="background:#e07070"></span> Expired</span>
              </div>
            </div>
          </div>

          <!-- Departemen PKWT Aktif -->
          <div class="card dept-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                Departemen PKWT Aktif
              </h3>
            </div>

            <div class="dept-list">
              <div class="dept-item" v-for="dept in departments" :key="dept.name">
                <div class="dept-circle" :style="{ background: dept.color }"></div>
                <div class="dept-texts">
                  <p class="dept-name">{{ dept.name }}</p>
                  <p class="dept-sub">{{ dept.sub }}</p>
                </div>
                <span class="dept-count">{{ dept.count }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 3: Pie chart + Segera Berakhir + Aktivitas -->
        <div class="row-three">

          <!-- Pie Chart -->
          <div class="card pie-card">
            <h3 class="card-title" style="margin-bottom:16px">Statistik Singkat Pekerja</h3>
            <div class="pie-wrap">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="50" fill="none" stroke="#4db89e" stroke-width="28" stroke-dasharray="100.5 214.1" stroke-dashoffset="0" transform="rotate(-90 65 65)"/>
                <circle cx="65" cy="65" r="50" fill="none" stroke="#f0c04a" stroke-width="28" stroke-dasharray="78.5 235.6" stroke-dashoffset="-100.5" transform="rotate(-90 65 65)"/>
                <circle cx="65" cy="65" r="50" fill="none" stroke="#f07070" stroke-width="28" stroke-dasharray="56.5 257.6" stroke-dashoffset="-179" transform="rotate(-90 65 65)"/>
                <circle cx="65" cy="65" r="50" fill="none" stroke="#6bb8d4" stroke-width="28" stroke-dasharray="47.1 267" stroke-dashoffset="-235.5" transform="rotate(-90 65 65)"/>
                <circle cx="65" cy="65" r="50" fill="none" stroke="#a0c878" stroke-width="28" stroke-dasharray="31.4 282.7" stroke-dashoffset="-282.6" transform="rotate(-90 65 65)"/>
                <circle cx="65" cy="65" r="34" fill="white"/>
                <text x="65" y="61" text-anchor="middle" fill="#333" font-size="13" font-weight="700">32%</text>
                <text x="65" y="75" text-anchor="middle" fill="#999" font-size="9">HRD & GA</text>
              </svg>

              <div class="pie-legend">
                <div class="pie-legend-item" v-for="pl in pieLegend" :key="pl.label">
                  <span class="legend-dot" :style="{ background: pl.color }"></span>
                  <span class="pie-legend-label">{{ pl.label }}</span>
                  <span class="pie-legend-pct">{{ pl.pct }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Segera Berakhir -->
          <div class="card expiring-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Segera Berakhir
              </h3>
              <span class="badge-red">2</span>
            </div>

            <div class="expiring-list">
              <div class="expiring-item" v-for="emp in expiringEmployees" :key="emp.name">
                <div class="emp-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#888"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
                <div class="emp-info">
                  <p class="emp-name">{{ emp.name }}</p>
                  <p class="emp-dept">{{ emp.dept }}</p>
                </div>
                <div class="emp-days" :class="emp.days <= 7 ? 'urgent' : 'warning'">
                  {{ emp.days }} hari
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Aktivitas Terbaru -->
          <div class="card activity-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Aktivitas Terbaru
              </h3>
            </div>

            <div class="activity-list">
              <div class="activity-item" v-for="act in activities" :key="act.name">
                <div class="act-avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#777"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
                <div class="act-info">
                  <p class="act-name">{{ act.name }}</p>
                  <p class="act-desc">{{ act.desc }}</p>
                </div>
                <span class="act-time">{{ act.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 4: Departemen Table -->
        <div class="card dept-table-card">
          <div class="card-header">
            <h3 class="card-title">Departemen PKWT Aktif</h3>
            <div class="table-actions">
              <button class="tbl-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button class="tbl-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <button class="tbl-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              </button>
            </div>
          </div>

          <div class="dept-table-grid">
            <div class="dept-table-item" v-for="dtd in deptTableData" :key="dtd.name">
              <div class="dept-left">
                <div class="dept-dot" :style="{ background: dtd.color }"></div>
                <span class="dept-table-name">{{ dtd.name }}</span>
              </div>
              <div class="dept-right">
                <span class="dept-count">{{ dtd.count }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import router from '@/router'

const activeNav = ref('Dashboard')

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// ===== CHART =====
const chartWrap = ref(null)
const chartW = ref(600)

const chartH = 260
const chartTopPad = 16
const chartInnerH = 190
const yAxisW = 28
const barW = 22
const yMax = 18
const yTicks = [15, 10, 5, 0]

const chartData = ref([
  { label: 'Jan', active: 4,  near: 0, exp: 0 },
  { label: 'Feb', active: 5,  near: 2, exp: 0 },
  { label: 'Mar', active: 6,  near: 3, exp: 0 },
  { label: 'Apr', active: 10, near: 3, exp: 2 },
  { label: 'May', active: 9,  near: 2, exp: 2 },
  { label: 'Jun', active: 8,  near: 1, exp: 2 },
  { label: 'Jul', active: 2,  near: 0, exp: 1 },
  { label: 'Aug', active: 3,  near: 1, exp: 0 },
  { label: 'Sep', active: 5,  near: 2, exp: 1 },
  { label: 'Oct', active: 7,  near: 2, exp: 0 },
  { label: 'Nov', active: 6,  near: 3, exp: 1 },
  { label: 'Dec', active: 4,  near: 1, exp: 0 },
])

const colW = computed(() => (chartW.value - yAxisW - 16) / chartData.value.length)
const barX = (i) => yAxisW + colW.value * i + (colW.value - barW) / 2
const barPx = (val) => (val / yMax) * chartInnerH
const barY = (totalAbove) => chartTopPad + chartInnerH - barPx(totalAbove)

const updateChartW = () => {
  if (chartWrap.value) chartW.value = chartWrap.value.clientWidth || 600
}

onMounted(() => {
  updateChartW()
  window.addEventListener('resize', updateChartW)
})
onBeforeUnmount(() => window.removeEventListener('resize', updateChartW))

// ===== DATA =====
const departments = ref([
  { name: 'HRD & GA', sub: 'HRD & GA', count: 38, color: '#4db89e' },
  { name: 'Produksi',  sub: 'Sales',    count: 34, color: '#f0c04a' },
  { name: 'Sales',     sub: 'HRD',      count: 25, color: '#f07878' },
  { name: 'IT',        sub: 'Finance',  count: 20, color: '#5bb8d4' },
])

const pieLegend = ref([
  { label: 'HRD & GA', pct: '32%', color: '#4db89e' },
  { label: 'Produksi',  pct: '25%', color: '#f0c04a' },
  { label: 'Sales',     pct: '18%', color: '#f07070' },
  { label: 'IT',        pct: '15%', color: '#6bb8d4' },
  { label: 'Finance',   pct: '3%',  color: '#a0c878' },
])

const expiringEmployees = ref([
  { name: 'Andi Saputra', dept: 'Sales',    days: 5  },
  { name: 'Yogi Pratama', dept: 'Sales',    days: 9  },
  { name: 'Andini',       dept: 'HRD & GA', days: 16 },
])

const activities = ref([
  { name: 'Budi Santoso',    desc: 'Created PKWT', time: '2 minutes ago' },
  { name: 'Siti Aminah',     desc: 'Deleted PKWT', time: '1 hour ago'    },
  { name: 'Andika Settawan', desc: 'Added a new PKWT', time: '3 hours ago' },
])

const deptTableData = ref([
  { name: 'HRD & GA', count: 38, color: '#4db89e' },
  { name: 'Produksi', count: 38, color: '#f0c04a' },
  { name: 'Sales',    count: 25, color: '#f07878' },
  { name: 'IT',       count: 20, color: '#5bb8d4' },
])
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard-root {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f0f2f8;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

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

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2e25;
  letter-spacing: -0.3px;
}

/* STAT CARDS */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
}

.stat-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon.teal   { background: #4db89e; }
.stat-icon.green  { background: #3d8b66; }
.stat-icon.yellow { background: #f0c04a; }
.stat-icon.red    { background: #e07070; }

.stat-label { font-size: 12px; color: #999; margin-bottom: 4px; }
.stat-value { font-size: 28px; font-weight: 700; color: #1a2e25; line-height: 1; }
.stat-value.green-text  { color: #3d8b66; }
.stat-value.yellow-text { color: #d4a017; }
.stat-value.red-text    { color: #d05050; }

/* CARD */
.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #2a2a2a;
  display: flex;
  align-items: center;
  gap: 7px;
}

/* ROW 2 */
.row-two {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
}

.year-select {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: #555;
  background: #f7f7f9; border: 1px solid #ebebeb;
  border-radius: 8px; padding: 5px 10px; cursor: pointer;
}

.chart-card { display: flex; flex-direction: column; }
.chart-wrap { flex: 1; position: relative; min-height: 0; }

.chart-legend { display: flex; gap: 20px; margin-top: 8px; padding-left: 4px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #888; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }

.dept-list { display: flex; flex-direction: column; }
.dept-item {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 0; border-bottom: 1px solid #f4f4f4; cursor: pointer;
}
.dept-item:last-child { border-bottom: none; }
.dept-circle { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; opacity: 0.85; }
.dept-texts { flex: 1; min-width: 0; }
.dept-name { font-size: 13.5px; font-weight: 600; color: #222; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dept-sub { font-size: 11px; color: #aaa; margin-top: 1px; }
.dept-count { font-size: 15px; font-weight: 700; color: #333; flex-shrink: 0; }

/* ROW 3 */
.row-three {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 16px;
}

.pie-wrap { display: flex; align-items: center; gap: 20px; }
.pie-legend { display: flex; flex-direction: column; gap: 8px; }
.pie-legend-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
.pie-legend-label { color: #555; flex: 1; }
.pie-legend-pct { color: #333; font-weight: 600; min-width: 36px; text-align: right; }

.badge-red { background: #ffe0e0; color: #d05050; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

.expiring-list { display: flex; flex-direction: column; gap: 12px; }
.expiring-item { display: flex; align-items: center; gap: 12px; }
.emp-avatar { width: 38px; height: 38px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.emp-name { font-size: 13.5px; font-weight: 600; color: #222; }
.emp-dept { font-size: 11.5px; color: #aaa; }
.emp-days { margin-left: auto; display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.emp-days.urgent { color: #d05050; }
.emp-days.warning { color: #d4a017; }

.activity-list { display: flex; flex-direction: column; gap: 14px; }
.activity-item { display: flex; align-items: flex-start; gap: 10px; }
.act-avatar { width: 34px; height: 34px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-name { font-size: 13px; font-weight: 600; color: #222; }
.act-desc { font-size: 11.5px; color: #aaa; margin-top: 1px; }
.act-time { margin-left: auto; font-size: 11px; color: #bbb; white-space: nowrap; padding-top: 2px; }

/* DEPT TABLE */
.table-actions { display: flex; gap: 6px; }
.tbl-btn {
  width: 30px; height: 30px;
  border: 1px solid #ebebeb; border-radius: 7px;
  background: #fafafa; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #888; transition: all 0.15s;
}
.tbl-btn:hover { background: #f0f0f0; color: #444; }

.dept-table-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.dept-table-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 10px; border-bottom: 1px solid #f4f4f4; }
.dept-left { display: flex; align-items: center; gap: 8px; }
.dept-dot { width: 10px; height: 10px; border-radius: 50%; }
.dept-right { display: flex; align-items: center; gap: 6px; }
.dept-table-name { font-size: 13.5px; color: #333; font-weight: 500; }
</style>