<script setup>
</script>

<template>
  <div class="title-box">
    <h1 class="title">Welcome!</h1>
    <p class="title-placeholder">QuickHome欢迎您.</p>
  </div>
</template>

<style lang="scss" scoped>
.title-box {
  @apply flex justify-start flex-col gap-2;
  &.super-admin {
    @apply justify-center;
    .title {
      @apply text-5xl font-bold bg-gradient-to-tl from-primary to-success bg-clip-text text-transparent;
    }
    .title-placeholder {
      @apply text-2xl text-text;
    }
  }
  &.admin {
    @apply justify-center;
    .title {
      @apply text-5xl font-bold text-white;
    }
    .title-placeholder {
      @apply text-2xl text-white;
    }
  }
}
</style>
