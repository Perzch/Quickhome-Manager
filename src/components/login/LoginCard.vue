<script setup>
import {ref} from "vue";
import {login, online, superLogin} from "@/api/manager/manager.js";
import {encrypt} from "@/utils/encryption.js";
import {useRouter} from "vue-router";
import {useGlobalStore} from "@/stores/index.js";
import {asyncAddRouter} from "@/router/index.js";
const router = useRouter()
const props = defineProps({
  isSuper: Boolean
})
// const {getUserInfo} = useGlobalStore()
const form = ref({
  username: '',
  password: ''
})
const loading =ref(false)
const rules = {
  username: [
    { required: true, message: '请输入用户名/电话', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ]
}
const formRef = ref()
/**
 * @description 跳转到超管/管理员登录
 */
const to = () => {
  const str = props.isSuper ? '/login/admin': '/login/super'
  router.push({
    path: str,
    query: router.currentRoute.value.query
  })
  formRef.value.resetFields()
}
/**
 * @description 提交登录
 * @returns {Promise<void>}
 */
const submit = async () => {
  loading.value = true
  const flag = await formRef.value.validate()
  if(!flag) return
  const fn = props.isSuper ? superLogin : login
  const {data} = await fn({
    username: form.value.username,
    password: encrypt(form.value.password)
  })
  const obj = {
    true: {
      token: data.token,
      userId: data.superManagerId,
      role: '1',
      username: data.superManagerAccount,
      path: '/manager'
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
  await asyncAddRouter()
  // 如果不是超级管理员登录,则设置管理员上线
  if(!props.isSuper) {
    await online(obj[props.isSuper].userId)
  }
  // await getUserInfo()
  ElMessage.success('登录成功!')
  setTimeout( async() => {
    if(router.currentRoute.value.query.redirect) {
      await router.push(router.currentRoute.value.query.redirect)
    } else {
      await router.push(obj[props.isSuper].path)
    }
    loading.value = false
  }, 1000)
}
</script>

<template>
  <div class="card" :class="isSuper ? 'bg-transparent' : 'bg-white'" v-loading.fullscreen="loading">
    <div class="card-header">
      <span>登录</span>
    </div>
    <el-form size="large" :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机号" @keydown.enter.native="submit"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="form.password" @keydown.enter.native="submit"></el-input>
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
  @apply transition-all duration-1000 shadow-xl bg-opacity-95 backdrop-blur-2xl rounded-lg p-6 w-80;
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
