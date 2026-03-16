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
        <div class="page-header">
          <div>
            <h1 class="page-title">Rekap Karyawan</h1>
            <p class="page-subtitle">Ringkasan status kontrak, departemen aktif, dan masa berakhir PKWT.</p>
          </div>

          <div class="page-actions">
            <button class="export-btn" type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>

        <!-- STAT CARDS -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon teal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Karyawan</p>
              <h3 class="stat-value">{{ totalEmployees }}</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">PKWT Aktif</p>
              <h3 class="stat-value green-text">{{ activeCount }}</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Near Expiry</p>
              <h3 class="stat-value yellow-text">{{ nearExpiryCount }}</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Sudah Berakhir</p>
              <h3 class="stat-value red-text">{{ expiredCount }}</h3>
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
              <div class="dept-item" v-for="dept in activeDepartments" :key="dept.id">
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
                <circle cx="65" cy="65" r="50" fill="none" stroke="#eef0f4" stroke-width="28"/>
                <circle
                  v-for="segment in workerPieSegments"
                  :key="segment.id"
                  cx="65"
                  cy="65"
                  r="50"
                  fill="none"
                  :stroke="segment.color"
                  stroke-width="28"
                  :stroke-dasharray="segment.strokeDasharray"
                  :stroke-dashoffset="segment.strokeDashoffset"
                  transform="rotate(-90 65 65)"
                />
                <circle cx="65" cy="65" r="34" fill="white"/>
                <text x="65" y="61" text-anchor="middle" fill="#333" font-size="13" font-weight="700">{{ workerPieHighlight.pct }}</text>
                <text x="65" y="75" text-anchor="middle" fill="#999" font-size="9">{{ workerPieHighlight.label }}</text>
              </svg>

              <div class="pie-legend">
                <div class="pie-legend-item" v-for="pl in workerPieLegend" :key="pl.id">
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
              <div class="expiring-title-wrap">
                <div class="expiring-icon-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 class="card-title">Segera Berakhir</h3>
              </div>
              <span class="badge-count" :class="expiringEmployees.length > 0 ? 'badge-count--warn' : 'badge-count--ok'">
                {{ expiringEmployees.length }} kontrak
              </span>
            </div>

            <div class="expiring-list">
              <div class="expiring-item" v-for="emp in expiringEmployees" :key="emp.name">
                <div class="emp-avatar" :class="emp.days <= 7 ? 'avatar-urgent' : 'avatar-warning'">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
                <div class="emp-info">
                  <p class="emp-name">{{ emp.name }}</p>
                  <p class="emp-dept">{{ emp.dept }}</p>
                </div>
                <div class="emp-expiry">
                  <span class="emp-pill" :class="emp.days <= 7 ? 'pill-urgent' : 'pill-warning'">
                    {{ emp.days }} hari lagi
                  </span>
                    <span class="emp-enddate">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ emp.endDate }}
                    </span>
                </div>
              </div>
                <div v-if="expiringEmployees.length === 0" class="expiring-empty">
                  <div class="expiring-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <p class="expiring-empty-text">Semua kontrak masih aman</p>
                </div>
            </div>
          </div>

          <!-- Aktivitas Terbaru -->
          <div class="card activity-card">
            <div class="card-header">
              <div class="expiring-title-wrap">
                <div class="expired-icon-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <h3 class="card-title">Kontrak Berakhir</h3>
              </div>
              <span class="badge-count badge-count--expired">{{ expiredEmployees.length }} kontrak</span>
            </div>

            <div class="expired-list">
              <div class="expired-item" v-for="end in expiredEmployees" :key="end.name">
                <div class="expired-avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
                <div class="expired-info">
                  <p class="expired-name">{{ end.name }}</p>
                  <p class="expired-position">{{ end.position }}</p>
                </div>
                <div class="expired-date-wrap">
                  <span class="expired-label">Berakhir</span>
                  <span class="expired-date">{{ end.endDate }}</span>
                </div>
              </div>
              <div v-if="expiredEmployees.length === 0" class="expiring-empty">
                <div class="expiring-empty-icon expiring-empty-icon--ok">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <p class="expiring-empty-text">Tidak ada kontrak yang berakhir</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 4: Departemen Diagram -->
        <div class="card dept-chart-card">
          <div class="card-header">
            <h3 class="card-title">Diagram Departemen PKWT Aktif</h3>
            <span class="dept-chart-meta" v-if="departmentLineData.length">{{ departmentLineData.length }} departemen</span>
          </div>

          <div class="dept-line-wrap" v-if="departmentLineData.length">
            <svg :viewBox="`0 0 ${DEPT_CHART_W} ${DEPT_CHART_H}`" class="dept-line-svg" preserveAspectRatio="none">
              <line
                v-for="tick in deptYAxisTicks"
                :key="`grid-${tick.value}`"
                :x1="DEPT_PAD_LEFT"
                :x2="DEPT_CHART_W - DEPT_PAD_RIGHT"
                :y1="tick.y"
                :y2="tick.y"
                class="dept-grid-line"
              />

              <text
                v-for="tick in deptYAxisTicks"
                :key="`label-${tick.value}`"
                :x="DEPT_PAD_LEFT - 8"
                :y="tick.y + 4"
                text-anchor="end"
                class="dept-y-tick"
              >{{ tick.value }}</text>

              <path :d="deptLinePath" class="dept-line" />

              <g v-for="point in departmentLinePoints" :key="point.id">
                <circle :cx="point.x" :cy="point.y" r="4.5" :fill="point.color" class="dept-point" />
                <circle :cx="point.x" :cy="point.y" r="2" fill="#fff" />
                <text :x="point.x" :y="point.y - 10" text-anchor="middle" class="dept-point-value">{{ point.count }}</text>
                <text :x="point.x" :y="DEPT_CHART_H - 10" text-anchor="middle" class="dept-x-label">{{ point.shortLabel }}</text>
              </g>

              <line
                :x1="DEPT_PAD_LEFT"
                :x2="DEPT_CHART_W - DEPT_PAD_RIGHT"
                :y1="DEPT_CHART_H - DEPT_PAD_BOTTOM"
                :y2="DEPT_CHART_H - DEPT_PAD_BOTTOM"
                class="dept-axis-line"
              />
            </svg>
          </div>

          <div v-else class="dept-chart-empty">Belum ada data departemen PKWT aktif.</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import { useDashboard } from '@/composables/useDashboard'

const {
  activeNav,
  chartWrap,
  chartW,
  chartH,
  chartTopPad,
  chartInnerH,
  yAxisW,
  barW,
  yTicks,
  chartData,
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
  expiringEmployees,
  expiredEmployees,
  handleLogout
} = useDashboard()

// ===== DATA =====
// const expiringEmployees = ref([
//   { name: 'Andi Saputra', dept: 'Sales',    days: 5  },
//   { name: 'Yogi Pratama', dept: 'Sales',    days: 9  },
//   { name: 'Andini',       dept: 'HRD & GA', days: 16 },
// ])

const activities = ref([
  { name: 'Budi Santoso',    desc: 'Created PKWT', time: '2 minutes ago' },
  { name: 'Siti Aminah',     desc: 'Deleted PKWT', time: '1 hour ago'    },
  { name: 'Andika Settawan', desc: 'Added a new PKWT', time: '3 hours ago' },
])

const DEPT_CHART_W = 980
const DEPT_CHART_H = 280
const DEPT_PAD_LEFT = 44
const DEPT_PAD_RIGHT = 18
const DEPT_PAD_TOP = 22
const DEPT_PAD_BOTTOM = 46

const departmentLineData = computed(() => activeDepartments.value.slice(0, 10))

const deptMaxCount = computed(() => {
  if (!departmentLineData.value.length) return 5
  const max = Math.max(...departmentLineData.value.map((item) => item.count), 0)
  if (max <= 5) return 5
  return Math.ceil(max / 5) * 5
})

const deptYAxisTicks = computed(() => {
  const max = deptMaxCount.value
  const values = [max, Math.round((max * 2) / 3), Math.round(max / 3), 0]
  const plotHeight = DEPT_CHART_H - DEPT_PAD_TOP - DEPT_PAD_BOTTOM
  return values.map((value) => ({
    value,
    y: DEPT_PAD_TOP + plotHeight - (value / max) * plotHeight
  }))
})

const departmentLinePoints = computed(() => {
  const items = departmentLineData.value
  const count = items.length
  if (!count) return []

  const plotWidth = DEPT_CHART_W - DEPT_PAD_LEFT - DEPT_PAD_RIGHT
  const plotHeight = DEPT_CHART_H - DEPT_PAD_TOP - DEPT_PAD_BOTTOM
  const step = count > 1 ? plotWidth / (count - 1) : 0

  return items.map((item, index) => {
    const x = DEPT_PAD_LEFT + step * index
    const y = DEPT_PAD_TOP + plotHeight - (item.count / deptMaxCount.value) * plotHeight
    return {
      ...item,
      x,
      y,
      shortLabel: item.name.length > 12 ? `${item.name.slice(0, 12)}…` : item.name
    }
  })
})

const deptLinePath = computed(() => {
  if (!departmentLinePoints.value.length) return ''
  return departmentLinePoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
})
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

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2e25;
  letter-spacing: -0.3px;
}

.page-subtitle {
  margin-top: 6px;
  font-size: 12.5px;
  color: #8b948f;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #d8e6de;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #f5faf7 100%);
  color: #2e6d53;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s, background 0.15s;
}

.export-btn:hover {
  transform: translateY(-1px);
  border-color: #bfd8cb;
  box-shadow: 0 6px 18px rgba(46,109,83,0.08);
  background: linear-gradient(180deg, #ffffff 0%, #eef8f2 100%);
}

.export-btn:active {
  transform: translateY(0);
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

/* ===== EXPIRING / EXPIRED HEADER ===== */
.expiring-title-wrap { display: flex; align-items: center; gap: 8px; }
.expiring-icon-wrap {
  width: 26px; height: 26px; border-radius: 7px;
  background: #fff8e6; color: #c8960d;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.expired-icon-wrap {
  width: 26px; height: 26px; border-radius: 7px;
  background: #fdecea; color: #d05050;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.badge-count { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.badge-count--warn    { background: #fff3cd; color: #a07000; }
.badge-count--ok      { background: #e6f4ef; color: #2e7d5e; }
.badge-count--expired { background: #fdecea; color: #d05050; }

/* ===== SEGERA BERAKHIR ===== */
.expiring-list { display: flex; flex-direction: column; gap: 8px; }
.expiring-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid #f0f0f0; transition: background 0.15s, box-shadow 0.15s;
}
.expiring-item:hover { background: #fffdf5; box-shadow: 0 2px 8px rgba(200,150,13,0.07); }
.emp-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar-urgent  { background: #fdecea; color: #d05050; }
.avatar-warning { background: #fff3cd; color: #c8960d; }
.emp-info { flex: 1; min-width: 0; }
.emp-name { font-size: 13px; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.emp-dept { font-size: 11.5px; color: #bbb; margin-top: 1px; }
.emp-expiry { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.emp-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
.pill-urgent  { background: #fdecea; color: #d05050; }
.pill-warning { background: #fff3cd; color: #c8960d; }
.emp-enddate { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #bbb; white-space: nowrap; }

/* ===== KONTRAK BERAKHIR ===== */
.expired-list { display: flex; flex-direction: column; gap: 8px; }
.expired-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid #f0f0f0; transition: background 0.15s;
}
.expired-item:hover { background: #fff7f7; }
.expired-avatar { width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0; color: #ccc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.expired-info { flex: 1; min-width: 0; }
.expired-name { font-size: 13px; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.expired-position { font-size: 11.5px; color: #bbb; margin-top: 1px; }
.expired-date-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
.expired-label { font-size: 10.5px; color: #d05050; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.expired-date  { font-size: 12px; color: #999; white-space: nowrap; }

/* ===== EMPTY STATE ===== */
.expiring-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px 0; }
.expiring-empty-icon { width: 44px; height: 44px; border-radius: 50%; background: #e6f4ef; color: #2e7d5e; display: flex; align-items: center; justify-content: center; }
.expiring-empty-icon--ok { background: #e6f4ef; color: #2e7d5e; }
.expiring-empty-text { font-size: 12.5px; color: #bbb; }

/* DEPT CHART */
.dept-chart-card {
  border: 1px solid #ecedf1;
  box-shadow: 0 2px 10px rgba(26,35,61,0.04);
}

.dept-chart-meta {
  font-size: 11.5px;
  color: #97a2b0;
  font-weight: 600;
}

.dept-line-wrap {
  width: 100%;
  height: 280px;
}

.dept-line-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.dept-grid-line {
  stroke: #edf1f5;
  stroke-width: 1;
}

.dept-axis-line {
  stroke: #dbe2ea;
  stroke-width: 1.2;
}

.dept-y-tick {
  fill: #a2adbb;
  font-size: 11px;
  font-weight: 600;
}

.dept-line {
  fill: none;
  stroke: #2f5579;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dept-point {
  stroke: #fff;
  stroke-width: 1.6;
}

.dept-point-value {
  fill: #2f3e53;
  font-size: 11px;
  font-weight: 700;
}

.dept-x-label {
  fill: #8f9baa;
  font-size: 10.5px;
  font-weight: 600;
}

.dept-chart-empty {
  text-align: center;
  font-size: 12.5px;
  color: #a2acb8;
  padding: 22px 0;
}
</style>