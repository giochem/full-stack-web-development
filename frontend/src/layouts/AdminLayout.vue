<template>
  <div class="admin-layout">
    <NavbarAdmin />
    <main class="admin-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import NavbarAdmin from "@/components/layouts/NavbarAdmin.vue";
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  margin-left: 250px; /* Width of sidebar */
  padding: 2rem;
  background-color: var(--light-bg-color);
}
</style>
