<script setup>
import {onUnmounted, ref} from 'vue'
import Sidebar from "@/components/layout/sidebar.vue";
import HeaderNav from "@/components/layout/HeaderNav.vue";
import {useGlobalStore} from "@/stores/index.js";
import {offline, online} from "@/api/manager/manager.js";
const expand = ref(false)

const expandSide = () => {
  expand.value = !expand.value
}

const visibilitychange = () => {
  if(localStorage.getItem('role') === '0') {
    const userId = localStorage.getItem('userId')
    if(document.visibilityState === 'hidden') {
      offline(userId)
    } else {
      online(userId)
    }
  }
}
const beforeunload = () => {
  if(localStorage.getItem('role') === '0') {
    const userId = localStorage.getItem('userId')
    offline(userId)
  }
}

window.addEventListener('visibilitychange',visibilitychange)
window.addEventListener('beforeunload', beforeunload)

onUnmounted(() => {
  window.removeEventListener('visibilitychange',visibilitychange)
  window.removeEventListener('beforeunload', beforeunload)
})
</script>
<template>
  <div class="app-container">
    <Sidebar v-model:expand="expand"/>
    <main class="index-main">
      <HeaderNav @expandSide="expandSide"/>
      <router-view />
    </main>
  </div>
</template>
<style lang='scss' scoped>
.app-container {
  @apply bg-gray-100 dark:bg-dark transition-all duration-300;
  @apply h-[100dvh] max-h-[100dvh] w-[100dvw] max-w-[100dvw] pl-4 flex gap-4 items-center;
  .index-main {
    @apply relative p-2 flex-1 h-full overflow-y-auto md:pl-52 transition-all duration-300;
  }
}
</style>
