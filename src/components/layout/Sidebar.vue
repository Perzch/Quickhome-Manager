<script setup>
import logo from '@/assets/logo/logo-text.png'
import SidebarItem from "@/components/layout/SidebarItem.vue";
import {useRouter} from "vue-router";
import {getAsyncRouterChildren} from "@/router/index.js";
defineProps({
  expand: Boolean
})
const router = useRouter()
const asyncRouterChildren = getAsyncRouterChildren()
</script>
<template>
    <div class="side-bar-items">
        <router-link class="logo-box" to="/">
          <img :src="logo" alt="logo" />
        </router-link>
        <SidebarItem v-for="item in asyncRouterChildren" :key="item.name" :to="item.path" :icon="item.meta.icon" :text="item.meta.title"/>
      <el-drawer
          :model-value="expand" @update:model-value="$emit('update:expand', $event)"
          append-to-body
          direction="ltr"
          size="100dvw"
      >
        <router-link class="logo-box" to="/">
          <img :src="logo" alt="logo" />
        </router-link>
        <SidebarItem v-for="item in asyncRouterChildren" :key="item.name" :to="item.path" :icon="item.meta.icon" :text="item.meta.title"/>
      </el-drawer>
    </div>
</template>
<style lang='scss' scoped>
.side-bar-items {
    @apply max-w-64 rounded-md transition-all duration-300 top-2 z-20 fixed opacity-0 -left-full md:opacity-100 md:left-0;
    .logo-box {
        @apply p-2 rounded-md flex items-center justify-center w-52 mb-4;
        img {
            @apply w-full object-contain;
        }
    }

  //.login-item {
  //  @apply flex items-center gap-8 p-2 pl-8 rounded-md;
  //  .detail-icon {
  //    @apply text-text overflow-hidden flex justify-center items-center text-sm p-2 shadow-md rounded-md bg-white;
  //  }
  //  &:hover {
  //    @apply border-gray-300 shadow-inner;
  //    .detail-icon {
  //      @apply bg-primary text-white;
  //      i {
  //        animation: -right-leave-left-enter 0.5s ease;
  //      }
  //    }
  //  }
  //}
}
</style>
