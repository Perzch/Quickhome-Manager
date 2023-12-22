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
    <span>{{ text }}</span>
  </router-link>
</template>

<style scoped lang="scss">
@mixin active {
  @apply shadow-md text-black bg-white;
  .item-icon {
    @apply bg-primary text-white;
  }
}
.side-bar-item {
  @apply p-2 flex items-center gap-2 text-text rounded-md pl-8;
  .item-icon {
    @apply flex justify-center items-center text-sm p-2 shadow-md rounded-md bg-white;
  }
  &:hover {
    @include active;
  }
  &.router-link-active {
    @include active;
  }
}
</style>
