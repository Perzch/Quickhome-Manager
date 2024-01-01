<script setup>
import {ref, computed, watch} from 'vue'
import { listLog } from "@/api/log/log.js";
import {useRoute, useRouter} from "vue-router";
import UserInfoDialog from "@/components/user/UserInfoDialog.vue";

const loading = ref(true)
const list = ref([])
const total = ref(0)
const route = useRoute()
const router = useRouter()
const userId = ref(null)
const open = ref(false)
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
const toExecuteUser = (row) => {
  userId.value = row.userPerformingId
  open.value = true
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part part-table">
      <el-table :data="list" size="default">
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="executionContent" label="操作描述" />
        <el-table-column prop="executionTime" label="执行时间" />
        <el-table-column prop="device" label="设备" width="60">
          <template #default="{row}">
            <el-icon>
              <Iphone v-if="row.device='phone'"/>
              <Monitor v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button text size="small" @click="toExecuteUser(row)">查看操作用户</el-button>
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
    <UserInfoDialog :user-id="userId" v-model="open"/>
  </div>
</template>

<style scoped lang="scss">
</style>
