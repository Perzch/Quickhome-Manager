<script setup>
defineProps({
  to: String || Object,
  icon: String || Object,
  text: String,
})
</script>

<template>
  <router-link class="side-bar-item" :to="to">
    <span class="item-icon">
      <el-icon><component :is="icon"/></el-icon>
    </span>
    <span class="item-text">{{ text }}</span>
  </router-link>
</template>

<style scoped lang="scss">
@mixin active {
  @apply font-semibold shadow-md text-black bg-white;
  .item-icon {
    @apply bg-primary text-white;
  }
}
.side-bar-item {
  @apply transition-all duration-300 p-2 flex items-center my-4 gap-2 text-text rounded-md md:text-base md:my-0 text-4xl pl-8;
  .item-icon {
    @apply transition duration-300 flex justify-center items-center p-2 shadow-md rounded-md bg-white;
    @apply dark:bg-primary dark:text-white;
  }
  &:hover {
    @apply shadow-inner text-black bg-white;
    .item-icon {
      @apply bg-primary text-white shadow-inner;
    }
  }
  &.router-link-active {
    @include active;
  }
}
</style>
