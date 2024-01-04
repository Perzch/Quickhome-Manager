<script setup>
import {ref, computed, watch} from 'vue'
import {listUser, setPassword} from "@/api/user/user.js";
import {useRoute, useRouter} from "vue-router";
import {encrypt} from "@/utils/encryption.js";
import {Checked, Key} from "@element-plus/icons-vue";
import {useClipboard} from "@vueuse/core";
import {releaseCoupon} from "@/api/coupon/coupon.js";

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
watch([
  () => queryParams.value.page,
  () => queryParams.value.size,
], () => {
  getList()
}, {
  immediate: true
})

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

const copyPhone = (row) => {
  if(isSupported) {
    copy && copy(row.managerPhone)
    ElMessage.success('复制成功!')
  } else {
    ELMessage.error('浏览器不支持复制功能!')
  }
}

/**
 * 优惠券发放
 */
const couponId = ref(route.query.couponId)

const selections = ref([])
const selectionChange = (list) => {
  selections.value = list
}
const cancelRelease = () => {
  window.close()
}
const release = () => {
  const str = selections.value.length > 0 ? `是否发放给用户${selections.value.map(u => u.user?.userName)}?` : '是否发放给所有用户?'
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const userIds = selections.value.map(item => item.user.userId).join(',') || undefined
    await releaseCoupon({
      couponId: couponId.value,
      userIds
    })
    window.opener.postMessage({
      couponId: couponId.value,
      userIds
    }, '*')
    ElMessage.success('发放成功!')
  })
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="coupon-release" v-if="couponId">
      <el-button v-debounce size="large" type="primary" @click="release">发放</el-button>
      <el-button v-debounce size="large" @click="cancelRelease">取消</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
        <el-table-column type="selection" v-if="couponId"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column label="账号" width="250">
          <template #default="{row}">
            <div class="user-multiple">
              <el-avatar shape="square" :size="50" :src="row.userHeadImage?.imagePath">
                <img :src="'/image/默认头像.png'" alt="error" />
              </el-avatar>
              <div class="account-email-box">
                <span class="user-account">{{row.user.userAccount}}</span>
                <span class="user-email">{{row.user.userEmail}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user.userName" label="用户名" show-overflow-tooltip/>
        <el-table-column prop="user.userPhone" label="手机号" show-overflow-tooltip>
          <template #default="{row}">
            <span class="manager-phone" @click="copyPhone(row)" title="点击复制">{{row.user.userPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userInformation.userBirthday" label="生日" show-overflow-tooltip/>
        <el-table-column prop="userInformation.userGender" label="性别" width="60"/>
        <el-table-column label="操作" fixed="right" v-if="!couponId">
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
.coupon-release {
  @apply sticky top-12 z-30 flex justify-end;
}
</style>
