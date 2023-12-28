<script setup>
import logo from '@/assets/logo/logo-text.png'
import SidebarItem from "@/components/layout/SidebarItem.vue";
import {useRouter} from "vue-router";
import {getAsyncRouterChildren} from "@/router/index.js";
const router = useRouter()
const asyncRouterChildren = getAsyncRouterChildren()
</script>
<template>
    <div class="side-bar-items">
        <router-link class="logo-box" to="/">
          <img :src="logo" alt="logo" />
        </router-link>
        <SidebarItem v-for="item in asyncRouterChildren" :key="item.name" :to="item.path" :icon="item.meta.icon" :text="item.meta.title"/>
<!--        <SidebarItem to="/statistical" icon="Histogram" text="流水统计" />-->
<!--        <SidebarItem to="/house" icon="HomeFilled" text="房屋" />-->
<!--        <SidebarItem to="/manager" icon="UserFilled" text="管理人员" />-->
<!--        <SidebarItem to="/user" icon="UserFilled" text="用户" />-->
<!--        <SidebarItem to="/servicePerson" icon="Avatar" text="服务人员" />-->
<!--        <SidebarItem to="/order" icon="List" text="订单" />-->
<!--        <SidebarItem to="/attraction" icon="Flag" text="景点" />-->
<!--        <SidebarItem to="/coupon" icon="Ticket" text="优惠券" />-->
<!--        <SidebarItem to="/coupon/category" icon="Ticket" text="优惠券种类" />-->
<!--        <SidebarItem to="/notification" icon="BellFilled" text="通知" />-->
<!--        <SidebarItem to="/log" icon="Checked" text="日志" />-->
<!--        <router-link class="login-item" to="/loginAdmin">-->
<!--          <span>登录</span>-->
<!--          <span class="detail-icon">-->
<!--                <el-icon>-->
<!--                  <Right />-->
<!--                </el-icon>-->
<!--              </span>-->
<!--        </router-link>-->
    </div>
</template>
<style lang='scss' scoped>
.side-bar-items {
    @apply max-w-64 rounded-md fixed top-2 z-10;
    .logo-box {
        @apply p-2 rounded-md border-b flex items-center justify-center w-52 mb-4;
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
