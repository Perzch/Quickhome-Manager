<template>
  <div class="title-box">
    <h1 class="title">Welcome!</h1>
    <p class="title-placeholder">QuickHome欢迎您的到来</p>
  </div>
</template>

<style lang="scss" scoped>
.title-box {
  @apply flex flex-col justify-center gap-2;
  .title {
    @apply text-5xl font-bold
  }
  .title-placeholder {
    @apply text-2xl;
  }
  &.super-admin {
    .title {
      @apply bg-gradient-to-tl from-primary to-success bg-clip-text text-transparent;
    }
    .title-placeholder {
      @apply text-text;
    }
  }
  &.admin {
    .title {
      @apply  text-white;
    }
    .title-placeholder {
      @apply text-white;
    }
  }
}
</style>
