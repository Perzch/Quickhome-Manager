<script setup>
import {onUnmounted, ref} from 'vue'
import Sidebar from "@/components/layout/sidebar.vue";
import HeaderNav from "@/components/layout/HeaderNav.vue";
import {useGlobalStore} from "@/stores/index.js";
import {offline, online} from "@/api/manager/manager.js";
const expand = ref(false)

const {logout} = useGlobalStore()
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
  @apply h-[100dvh] max-h-[100dvh] w-[100dvw] max-w-[100dvw] p-4 pr-0 pt-0 flex gap-4 items-center;
  .index-main {
    @apply relative pl-0 pt-2 pr-2 flex-1 h-full overflow-y-auto md:pl-52 transition-all duration-300;
  }
}
</style>
