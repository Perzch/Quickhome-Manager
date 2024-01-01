<script setup>
import {ref, computed, watch} from 'vue'
import {useRouter} from "vue-router";
import {addNotification, deleteNotification, listNotification, updateNotification} from "@/api/manager/notification.js";
import {DeleteFilled, Edit, InfoFilled, UserFilled} from "@element-plus/icons-vue";
import RichInput from "@/components/RichInput.vue";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const formRef = ref(null)
const rules = {
  notificationContent: [
    { required: true, message: '通知内容不能为空' }
  ]
}
const list = ref([])
const total = ref(0)
const router = useRouter()
const queryParams = ref({
  page: 1,
  size: 10,
})
const open = ref(false)
const title = ref('')
let notificationDetail;
const curIndex = computed(() => {
  return (queryParams.value.page - 1) * queryParams.value.size + 1
})
const getList = async () => {
  loading.value = true
  const  { data } =  await listNotification(queryParams.value)
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
const toDetail = (row) => {
  notificationDetail && notificationDetail.close()
  notificationDetail = ElNotification({
    icon: InfoFilled,
    title: '通知详情',
    message: row.notificationContent,
    dangerouslyUseHTMLString: true,
    duration: 0,
    customClass: 'left-[50vw!important] top-[50vh!important] -translate-x-1/2 -translate-y-1/2',
  })
}

const selections = ref([])
const selectionChange = (list) => {
  editDisabled.value = list.length !== 1
  delDisabled.value = list.length < 1
  selections.value = list
}

const deleteRow = (row = selections.value) => {
  if(!row && row.length > 0) {
    ElMessage.warning('请先选择要删除的通知!')
  }
  const str = row.userNotificationId ? `是否删除通知${row.userNotificationId}?` : `是否删除${row.length}条通知?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteNotification(row.userNotificationId || row.map(item => item.userNotificationId).join(','))
    loading.value = false
    ElMessage.success('删除成功!')
    getList()
  })
}

const dialogOpen = (row = {}, str = '') => {
  form.value = JSON.parse(JSON.stringify(row))
  open.value = true
  title.value = str
}

const dialogClose = () => {
  open.value = false
  formRef.value.resetFields()
  title.value = ''
}

const submit = async () => {
  await formRef.value.validate()
  const fn = form.value.userNotificationId ? updateNotification : addNotification;
  fn(form.value).then(() => {
    ElMessage.success(form.value.userNotificationId ? '修改成功!' : '添加成功!')
    dialogClose()
    getList()
  })
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '发布通知')">发布通知</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改通知')">修改通知</el-button>
      <el-button v-debounce icon="delete" type="danger" :disabled="delDisabled" @click="deleteRow()">删除通知</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" @selectionChange="selectionChange" >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="notificationContent" label="通知内容">
          <template #default="{row}">
            <div v-html="row.notificationContent" />
          </template>
        </el-table-column>
        <el-table-column prop="notificationReleaseTime" label="发布时间" />
<!--        <el-table-column prop="notifyPostManager" label="发布人" width="60" />-->
        <el-table-column label="操作">
          <template #default="{row}">
                <el-button v-debounce :icon="UserFilled" circle title="查看发布人"/>
                <el-button v-debounce :icon="InfoFilled" circle title="查看详情" @click="toDetail(row)"/>
                <el-button v-debounce :icon="Edit" circle title="修改" @click="dialogOpen(row, '修改通知')"/>
                <el-button v-debounce :icon="DeleteFilled" circle title="删除" @click="deleteRow(row)"/>
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
    <el-dialog v-model="open" :title="title" @close="dialogClose">
      <div class="flex flex-col gap-4">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="6.25rem">
          <el-form-item label="发布时间">
            <el-date-picker v-model="form.notificationReleaseTime" type="datetime" placeholder="请选择发布时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="通知内容" prop="notificationContent">
            <RichInput v-model="form.notificationContent" placeholder="请输入通知内容"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="dialogClose" size="large" v-debounce>取消</el-button>
          <el-button type="primary" @click="submit" size="large" v-debounce>确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
</style>
