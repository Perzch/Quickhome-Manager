<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import {useGlobalStore} from "@/stores/index.js";
import {useStorage} from "@vueuse/core";
const { logout } = useGlobalStore()
const username = useStorage('username', '')
const tracker = ref( null)
const headerNav = ref(null)
let observer;
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio === 0) {
      headerNav.value.classList.add('not-top')
    } else {
      headerNav.value.classList.remove('not-top')
    }
  })
  observer.observe(tracker.value)
})
onBeforeUnmount(() => {
  observer.disconnect()
})
</script>

<template>
  <div class="header-nav-tracker" ref="tracker"></div>
  <div class="header-nav" ref="headerNav">
    <Breadcrumb/>
    <div class="user-box">
      <el-dropdown>
        <span class="el-dropdown-link">
          <span class="user-name">{{username}}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-nav {
  @apply sticky top-0 z-10 mb-4 flex items-center justify-between rounded-md px-2 duration-300 transition-all;
  .user-box {
    .el-dropdown-link {
      @apply duration-300 p-2 flex items-center gap-1;
      &:hover {
        @apply shadow-inner bg-white;
      }
    }
    :deep(.el-dropdown) {
      @apply text-sm;
    }
  }
}
.not-top {
  @apply top-1 bg-white shadow-md bg-opacity-50 backdrop-blur-md;
}
:deep(.el-dropdown-menu__item) {
  @apply text-sm;
}
</style>
