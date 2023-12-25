<script setup>
import {ref} from "vue";
import {useLoginStore} from "@/stores/login.js";
import {login, superLogin} from "@/api/manager/manager.js";
import {encrypt} from "@/utils/encryption.js";
import {useRouter} from "vue-router";
import {useGlobalStore} from "@/stores/index.js";
import {asyncAddRouter} from "@/router/index.js";
const router = useRouter()
const props = defineProps({
  isSuper: Boolean
})
const {getUserInfo} = useGlobalStore()
const {form,rules} = useLoginStore()
const formRef = ref()
const to = () => {
  const str = props.isSuper ? '/login/admin': '/login/super'
  router.push({
    path: str,
    query: router.currentRoute.value.query
  })
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
  const obj = {
    true: {
      token: data.token,
      userId: data.superManagerId,
      role: '1',
      username: data.superManagerAccount,
      path: '/statistics'
    },
    false:{
      token: data.token,
      userId: data.managerId,
      role: '0',
      username: data.managerName,
      path: '/order'
    }
  }
  localStorage.setItem('token', obj[props.isSuper].token)
  localStorage.setItem('userId', obj[props.isSuper].userId)
  localStorage.setItem('role', obj[props.isSuper].role)
  localStorage.setItem('username', obj[props.isSuper].username)
  asyncAddRouter()
  if(router.currentRoute.value.query.redirect) {
    router.push(router.currentRoute.value.query.redirect)
  } else {
    router.push(obj[props.isSuper].path)
  }
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
        <el-button class="w-full" type="primary" @click="submit">登录</el-button>
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
