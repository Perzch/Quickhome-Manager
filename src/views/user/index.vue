<script setup>
import {ref, computed} from 'vue'
import {listUser, setPassword} from "@/api/user/user.js";
import {useRoute, useRouter} from "vue-router";
import {encrypt} from "@/utils/encryption.js";
import {Checked, Key} from "@element-plus/icons-vue";
import {useClipboard} from "@vueuse/core";

const loading = ref(true)
const list = ref([])
const total = ref(0)
const route = useRoute()
const router = useRouter()
const {copy, isSupported} = useClipboard()
const queryParams = ref({
  page: 1,
  size: 10,
  userId: route.query.userId || undefined
})
const curIndex = computed(() => {
  return (queryParams.value.page - 1) * queryParams.value.size + 1
})
const getList = async () => {
  loading.value = true
  const  { data } =  await listUser(queryParams.value)
  list.value = data.records
  total.value = data.total
  loading.value = false
}

const toLog = (row) => {
  router.push({
    path: '/log',
    query: {
      userId: row.user.userId
    }
  })
}

const resetPassword = async (row) => {
  await ElMessageBox.confirm(`是否将${row.user.userAccount}的密码重置为quickhome123?`,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  loading.value = true
  await setPassword({
    ...row.user,
    userPwd: encrypt('quickhome123')
  })
  loading.value = false
  ElMessage.success('重置成功!')
}
getList()

const copyPhone = (row) => {
  if(isSupported) {
    copy && copy(row.managerPhone)
    ElMessage.success('复制成功!')
  } else {
    ELMessage.error('浏览器不支持复制功能!')
  }
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part part-table">
      <el-table :data="list" size="default">
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column label="账号" width="250">
          <template #default="{row}">
            <div class="user-multiple">
              <el-avatar shape="square" :size="50" :src="row.userHeadImage?.imagePath" />
              <div class="account-email-box">
                <span class="user-account">{{row.user.userAccount}}</span>
                <span class="user-email">{{row.user.userEmail}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user.userName" label="用户名" />
        <el-table-column prop="user.userPhone" label="手机号" >
          <template #default="{row}">
            <span class="manager-phone" @click="copyPhone(row)" title="点击复制">{{row.user.userPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userInformation.userBirthday" label="生日" />
        <el-table-column prop="userInformation.userGender" label="性别" width="60"/>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button v-debounce :icon="Checked" circle title="查看日志" @click="toLog(row)" />
            <el-button v-debounce :icon="Key" circle title="重置密码"  @click="resetPassword(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 50, 100, 200]"
          background
          layout="total, pager, sizes, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-multiple {
  @apply flex items-center gap-2;
  :deep(.el-avatar) {
    @apply bg-transparent;
  }
  .account-email-box {
    @apply grid grid-rows-2;
    .user-account {
      @apply font-semibold text-title;
    }
  }
}
.manager-phone {
  @apply text-text cursor-pointer;
  &:hover {
    @apply text-primary underline;
  }
}
</style>
