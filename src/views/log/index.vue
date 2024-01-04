<script setup>
import {ref, computed, watch} from 'vue'
import { listLog } from "@/api/log/log.js";
import {useRoute, useRouter} from "vue-router";
import {getUserInfo} from "@/api/user/info.js";
import {getManager} from "@/api/manager/manager.js";
import {useClipboard} from "@vueuse/core";

const loading = ref(true)
const list = ref([])
const total = ref(0)
const route = useRoute()
const router = useRouter()
const userId = ref(null)
const form = ref({})
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
  const  { data } =  await listLog(queryParams.value)
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
const showAll = () => {
  router.push('/log')
  queryParams.value.userId = undefined
  getList()
}

const {copy, isSupported} = useClipboard()
const copyText = (str) => {
  if(isSupported) {
    copy && copy(str)
    ElMessage.success('复制成功!')
  } else {
    ELMessage.error('浏览器不支持复制功能!')
  }
}

const popoverBefore =async (row) => {
  if(row.executionContent.includes('管理')) {
    const {data} = await getManager(row.userPerformingId)
    form.value = {
      ...data,
      role: 1
    }
  } else {
    const {data} = await getUserInfo(row.userPerformingId)
    form.value = {
      ...data.user,
      role: 0
    }
  }
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div>
      <el-button type="primary" icon="refresh" @click="showAll">重置</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default">
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="executionContent" label="操作描述" />
        <el-table-column prop="executionTime" label="执行时间" />
        <el-table-column prop="device" label="设备" width="60">
          <template #default="{row}">
            <el-icon :title="row.device === 'phone' ? '手机' : '电脑'">
              <component :is="row.device==='phone' ? 'Iphone' : 'Monitor'"/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <el-popover
              placement="bottom-end"
              trigger="click"
              width="fit-content"
              @before-enter="popoverBefore(row)"
              v-if="!row.executionContent.includes('超管')"
          >
              <template #default>
                <template v-if="form.role">
                  <el-descriptions
                      title="管理员信息"
                      :column="1"
                      border
                  >
                    <el-descriptions-item label="账号:">{{form.managerAccount}}</el-descriptions-item>
                    <el-descriptions-item label="名称:">{{form.managerName}}</el-descriptions-item>
                    <el-descriptions-item label="电话:">
                      <span @click="copyText(row.managerPhone)" title="点击复制" class="copy__able">{{form.managerPhone}}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="状态:">
                      <el-tag size="large" :type="form.onlineStatus === '离线' ? 'danger' : 'success'">{{form.onlineStatus}}</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </template>
                <template v-else>
                  <el-descriptions
                      title="用户信息"
                      :column="1"
                      border
                  >
                    <el-descriptions-item label="账号:">{{form.userAccount}}</el-descriptions-item>
                    <el-descriptions-item label="名称:">{{form.userName}}</el-descriptions-item>
                    <el-descriptions-item label="邮箱:">
                      <span @click="copyText(row.userEmail)" title="点击复制" class="copy__able">{{form.userEmail}}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="电话:">
                      <span @click="copyText(row.userPhone)" title="点击复制" class="copy__able">{{form.userPhone}}</span></el-descriptions-item>
                  </el-descriptions>
                </template>
              </template>
              <template #reference>
                <el-button circle icon="User" title="查看操作人"></el-button>
              </template>
            </el-popover>
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
