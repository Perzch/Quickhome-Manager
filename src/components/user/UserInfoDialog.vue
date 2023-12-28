<script setup>
import {getUserInfo} from "@/api/user/info.js";
import {ref} from "vue";

const props = defineProps({
  userId: {
    type: Number
  },
  modelValue: {
    type: Boolean,
    required: true
  }
})
const loading = ref(true)
const userInfo = ref({})
const getData = async () => {
  loading.value = true
  const { data } = await getUserInfo({
    token: localStorage.getItem('token'),
    userId: props.userId
  })
  console.log(data)
  userInfo.value = data
  loading.value = false
}
</script>

<template>
  <el-dialog title="用户详情" @open="getData" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="user-card" v-loading="loading">
        <el-image :src="userInfo.userAvatar" fit="cover" style="width: 100px; height: 100px; border-radius: 50%;"></el-image>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
