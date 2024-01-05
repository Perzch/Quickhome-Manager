<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import {useGlobalStore} from "@/stores/index.js";
import {useDark, useIntersectionObserver, useStorage, useToggle} from "@vueuse/core";
import {Moon, MoonNight, Sunny} from "@element-plus/icons-vue";
import {getManager, updateManager} from "@/api/manager/manager.js";
import {encrypt} from "@/utils/encryption.js";
const { logout } = useGlobalStore()
const username = useStorage('username', '')
const tracker = ref( null)
const headerNav = ref(null)
const headerNavObserver = useIntersectionObserver(tracker, (entries, observer) => {
  if (entries[0].intersectionRatio === 0) {
    headerNav.value.classList.add('not-top')
  } else {
    headerNav.value.classList.remove('not-top')
  }
})
const emits = defineEmits(['expandSide'])

const isDark = useDark()
const toggleTheme = useToggle(isDark)

const open = ref(false)
const form = ref({})
const formRef = ref(null)
const rules = {
  managerPwd: [
    { required: true, message: '旧密码不能为空' },
    { type: 'string', min: 6, message: '密码长度不能小于6位'}
  ],
  newPassword: [
    { required: true, message: '新密码不能为空' },
    { type: 'string', min: 6, message: '密码长度不能小于6位'}
  ],
  newPasswordAgain: [
    { required: true, message: '新密码不能为空' },
    { type: 'string', min: 6, message: '密码长度不能小于6位'},
    { validator: (rule, value, callback) => {
        if (value !== form.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
}
const dialogOpen =async () => {
  open.value = true
}
const dialogClose = () => {
  open.value = false
  formRef.value.resetFields()
}
const submit =async () => {
   await formRef.value.validate()
  await updateManager({
    managerId: localStorage.getItem('userId'),
    managerPwd: encrypt(form.value.managerPwd),
    newPassword: encrypt(form.value.newPassword)
  })
  ElMessage.success('修改成功!即将回退到登录页')
  logout()
}
</script>

<template>
  <div class="header-nav-tracker" ref="tracker"></div>
  <div class="header-nav" ref="headerNav">
    <div class="flex gap-2 items-center">
      <el-icon @click="emits('expandSide')" class="expand-button"><Menu /></el-icon>
      <Breadcrumb/>
    </div>
    <div class="user-box">
      <el-icon class="theme-button theme-button__light" v-if="isDark" @click="toggleTheme()"><Sunny/></el-icon>
      <el-icon class="theme-button theme-button__dark" v-else @click="toggleTheme()"><Moon/></el-icon>
      <el-dropdown>
        <span class="el-dropdown-link">
          <span class="user-name">{{username}}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogOpen">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="open" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="7.225rem">
        <el-form-item label="旧密码" prop="managerPwd">
          <el-input type="password" show-password v-model="form.managerPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" show-password v-model="form.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="newPasswordAgain">
          <el-input type="password" show-password v-model="form.newPasswordAgain" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.header-nav {
  @apply sticky top-0 z-10 mb-4 flex items-center justify-between rounded-md px-2 duration-300 transition-all;
  .user-box {
    @apply flex items-center gap-2;
    .el-dropdown-link {
      @apply duration-300 p-2 flex items-center gap-1 rounded-md;
      &:hover {
        @apply shadow-inner bg-white dark:bg-primary;
      }
    }
    :deep(.el-dropdown) {
      @apply text-sm;
    }
  }
}
.not-top {
  @apply top-1 bg-white dark:bg-primary shadow-md bg-opacity-50 backdrop-blur-md;
}
:deep(.el-dropdown-menu__item) {
  @apply text-sm;
}
.expand-button {
  @apply text-2xl p-2 box-content md:hidden cursor-pointer;
  &:hover,&:focus {
    @apply text-primary;
  }
}

.theme-button {
  @apply p-1 cursor-pointer text-xl box-content rounded-md shadow-inner ;
}
.theme-button__dark {
  @apply transition-all duration-300;
  &:hover {
    @apply bg-primary text-white;
  }
}
.theme-button__light {
  @apply bg-success text-black backdrop-blur-md transition-all duration-300;
  &:hover {
    @apply bg-primary text-white;
  }
}
</style>
