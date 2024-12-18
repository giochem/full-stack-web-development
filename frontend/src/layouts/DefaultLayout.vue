<template>
  <HeaderDefault />
  <router-view></router-view>
  <FooterDefault />
</template>
<script>
import FooterDefault from "@/components/layouts/FooterDefault.vue";
import HeaderDefault from "@/components/layouts/HeaderDefault.vue";
export default {
  components: { FooterDefault, HeaderDefault }
};
</script>
