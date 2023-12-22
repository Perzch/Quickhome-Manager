<script setup>
import Sidebar from "@/components/layout/sidebar.vue";
</script>
<template>
  <div class="wrap">
    <Sidebar />
    <main>
      <router-view />
    </main>
  </div>
</template>
<style lang='scss' scoped>
.wrap {
  @apply p-4 flex gap-4 items-center;
}
</style>
