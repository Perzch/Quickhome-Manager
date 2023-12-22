<template>
  <div class="wrap">
    <div class="bg">
    </div>
    <starport port="loginTitle" class="w-72 h-28">
      <WelComeTitle class="admin"/>
    </starport>
    <starport port="loginCard" class="h-80 w-80">
      <LoginCard :is-super="false"/>
    </starport>
  </div>
</template>

<script setup>
import LoginCard from "@/components/login/LoginCard.vue";
import {Starport} from "vue-starport";
import WelComeTitle from "@/components/layout/WelcomeTitle.vue";
</script>

<style lang="scss" scoped>
.wrap {
  @apply p-10 max-h-screen h-screen w-screen relative rounded-md overflow-hidden flex justify-around items-center;
  .bg {
    @apply flex items-center justify-center flex-col gap-4 absolute top-4 left-4 min-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] rounded-lg bg-text -z-3;
    background: url("../assets/img/curved6.jpg") center/cover no-repeat;
    &::after {
      content: '';
     @apply absolute top-0 left-0 min-h-[calc(100vh-2rem)] rounded-lg -z-2 w-full opacity-60;
     background: linear-gradient(310deg, #141727 0%, #3A416F 100%);
    }
  }
}
</style>
