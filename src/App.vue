<template>
  <Suspense>
    <starport-carrier>
      <router-view />
    </starport-carrier>
  </Suspense>
</template>
<script setup>
import {StarportCarrier} from "vue-starport";
</script>
