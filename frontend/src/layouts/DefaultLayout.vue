<template>
  <v-layout>
    <HeaderDefault />
    <router-view></router-view>
    <FooterDefault />
  </v-layout>
</template>
<script setup>
import FooterDefault from "@/components/layouts/FooterDefault.vue";
import HeaderDefault from "@/components/layouts/HeaderDefault.vue";
</script>
