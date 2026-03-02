<template>
  <header class="topbar">
    <div class="topbar-user">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span class="user-label">{{ username }}</span>
      <div class="avatar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  username: {
    type: String,
    default: 'Admin (HRD)',
  },
})

</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 28px;
  flex-shrink: 0;
}

/* search bar removed — profile remains aligned right */

.topbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-label {
  font-size: 13.5px;
  color: #444;
  font-weight: 500;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4db89e, #2e7d5e);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>