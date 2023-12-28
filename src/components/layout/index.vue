<script setup>
import Sidebar from "@/components/layout/sidebar.vue";
import HeaderNav from "@/components/layout/HeaderNav.vue";
</script>
<template>
  <div class="app-container">
    <Sidebar />
    <main class="index-main">
      <HeaderNav/>
      <router-view />
    </main>
  </div>
</template>
<style lang='scss' scoped>
.app-container {
  @apply h-screen max-h-screen w-screen max-w-[100vw] p-4 pr-0 pt-0 flex gap-4 items-center;
  .index-main {
    @apply relative pl-60 pt-2 pr-2 flex-1 h-full overflow-y-auto;
  }
}
</style>
