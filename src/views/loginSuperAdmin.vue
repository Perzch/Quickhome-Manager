<template>
  <div class="wrap">
    <div class="bg"></div>
    <starport port="welcomeTitle" class="duration-1000 w-72 h-28">
      <WelComeTitle class="super-admin"/>
    </starport>
    <div>
      <starport port="loginCard" class="duration-1000 h-80 w-80">
        <LoginCard :is-super="true"/>
      </starport>
    </div>
  </div>
</template>

<script setup>
import LoginCard from "@/components/login/LoginCard.vue";
import {Starport} from "vue-starport";
import WelComeTitle from "@/components/layout/WelComeTitle.vue";
</script>

<style lang="scss" scoped>
.wrap {
  @apply pl-40 max-h-screen h-screen w-screen relative overflow-hidden flex flex-col justify-center items-start;
  .bg {
    @apply absolute top-0 right-0 w-2/3 h-2/3;
    background: url("../assets/img/curved9.jpg") right/cover no-repeat;
    transform: skewX(-30deg) translateX(30%);
    border-bottom-left-radius: 1rem;
  }
}

</style>
