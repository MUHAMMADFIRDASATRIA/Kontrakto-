<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 2z" fill="#2e7d5e" opacity="0.15"/>
          <path d="M14 2L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 2z" stroke="#2e7d5e" stroke-width="1.5" fill="none"/>
          <rect x="10" y="11" width="8" height="6" rx="1" fill="#2e7d5e"/>
          <rect x="12" y="9" width="4" height="3" rx="1" fill="#2e7d5e"/>
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-sub">SISTEM HRD</span>
        <span class="logo-main">HRD<span class="logo-dot">:=</span></span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <RouterLink to="/Dashboard"
        class="nav-item"
        :class="{ active: modelValue === 'Dashboard' }"
        @click="$emit('update:modelValue', 'Dashboard')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </RouterLink>

      <RouterLink to="/Karyawan"
        class="nav-item"
        :class="{ active: modelValue === 'karyawan' }"
        @click="$emit('update:modelValue', 'karyawan')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Data Karyawan
      </RouterLink>

      <RouterLink to="/PKWT"
        class="nav-item"
        :class="{ active: modelValue === 'pkwt' }"
        @click="$emit('update:modelValue', 'pkwt')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        Data PKWT
      </RouterLink>

      <RouterLink to="/Reminder"
        class="nav-item"
        :class="{ active: modelValue === 'reminder' }"
        @click="$emit('update:modelValue', 'reminder')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Reminder
      </RouterLink>

      <div class="nav-section-label">Master Data</div>

      <RouterLink to="/Departments"
        class="nav-item"
        :class="{ active: modelValue === 'departemen' }"
        @click="$emit('update:modelValue', 'departemen')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        Kelola Departemen
      </RouterLink>

      <RouterLink to="/Jabatan"
        class="nav-item"
        :class="{ active: modelValue === 'jabatan' }"
        @click="$emit('update:modelValue', 'jabatan')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>
        Kelola Jabatan
      </RouterLink>
    </nav>

    <!-- Logout -->
    <button class="sidebar-logout nav-item logout-item" @click="$emit('logout')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Logout
    </button>
  </aside>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue', 'logout'])
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-thumb { background: #eee; }

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 18px;
  border-bottom: 1px solid #f0f0f0;
}

.logo-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-sub {
  font-size: 9px;
  color: #aaa;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.logo-main {
  font-size: 18px;
  font-weight: 800;
  color: #1a2e25;
  letter-spacing: -0.5px;
}

.logo-dot { color: #3d8b66; }

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-section-label {
  font-size: 10.5px;
  font-weight: 600;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: 14px 8px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-item.active {
  color: #1a2e25;
  font-weight: 600;
  background: transparent;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background: #3d8b66;
  border-radius: 0 3px 3px 0;
}

.sidebar-logout {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
}

.logout-item { color: #888; }
</style>