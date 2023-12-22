<script setup>
import {ref} from "vue";
import {useLoginStore} from "@/stores/login.js";
import {login, superLogin} from "@/api/manager/manager.js";
import {encrypt} from "@/utils/encryption.js";
import {useRouter} from "vue-router";
const router = useRouter()
const props = defineProps({
  isSuper: Boolean
})
const {form,rules} = useLoginStore()
const formRef = ref()
const to = () => {
  const str = props.isSuper ? '/login/admin': '/login/super'
  router.push(str)
  formRef.value.resetFields()
}
const submit = async () => {
  const flag = await formRef.value.validate()
  if(!flag) return
  const fn = props.isSuper ? superLogin : login
  const {data} = await fn({
    username: form.username,
    password: encrypt(form.password)
  })
  if(props.isSuper) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.superManagerId)
    localStorage.setItem('role', '1')
    localStorage.setItem('username',data.superManagerAccount)
  } else {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.managerId)
    localStorage.setItem('role', '0')
  }
  await router.push('/')
}
</script>

<template>
  <div class="card" :class="isSuper ? 'bg-transparent' : 'bg-white'">
    <div class="card-header">
      <span>登录</span>
    </div>
    <el-form size="large" :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="w-full duration-500 hover:scale-105" type="primary" @click="submit">登录</el-button>
      </el-form-item>
    </el-form>
    <button class="to-super" @click="to" v-debounce>{{isSuper ? '管理员' : '超管'}}登录</button>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply shadow-xl duration-1000 bg-opacity-95 backdrop-blur-2xl rounded-lg p-6 w-80;
  .card-header {
    @apply text-center my-4 text-2xl font-bold text-title;
  }
  :deep(.el-form-item) {
    @apply py-4;
    .el-input__wrapper {
      //@apply p-2;
    }
  }
}
.to-super {
  @apply text-right p-2 text-sm w-fit text-gray-500;
  &:hover {
    @apply text-primary shadow-inner;
  }
}
</style>
