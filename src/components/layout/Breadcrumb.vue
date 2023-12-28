<script setup>
import {useRoute} from "vue-router";
const route = useRoute()
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
    <el-breadcrumb-item class="slide-in">{{route.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
:deep(.el-breadcrumb) {
  @apply text-base;
}
</style>
