<script setup>

import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import {Starport} from "vue-starport";
import WelcomeTitle from "@/components/layout/WelcomeTitle.vue";
</script>

<template>
  <div class="header-nav">
    <Breadcrumb/>
    <starport port="welcomeTitle" class="w-fit h-4">
      <WelcomeTitle class="welcome"/>
    </starport>
  </div>
</template>

<style scoped lang="scss">
.header-nav {
  @apply flex justify-between;
}
</style>
