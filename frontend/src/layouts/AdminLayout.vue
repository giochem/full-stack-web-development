<template>
  <NavbarAdmin />
  <router-view></router-view>
</template>
<script>
import NavbarAdmin from "@/components/layouts/NavbarAdmin.vue";
export default {
  components: { NavbarAdmin },
};
</script>
