<script setup>
import {ref, computed, watch} from 'vue'
import {useRouter} from "vue-router";
import {addNotification, deleteNotification, listNotification, updateNotification} from "@/api/manager/notification.js";
import {DeleteFilled, Edit, InfoFilled, UserFilled} from "@element-plus/icons-vue";
import RichInput from "@/components/RichInput.vue";
import {getManager} from "@/api/manager/manager.js";
import {getUserInfo} from "@/api/user/info.js";
import {useClipboard} from "@vueuse/core";

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
  after: true
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
  if(localStorage.getItem('role') === '0') {
    form.value.notifyPostManager = localStorage.getItem('userId')
  }
  const fn = form.value.userNotificationId ? updateNotification : addNotification;
  fn(form.value).then(() => {
    ElMessage.success(form.value.userNotificationId ? '修改成功!' : '添加成功!')
    dialogClose()
    getList()
  })
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

const managerInfo = ref({})
const popoverBefore =async (row) => {
    const {data} = await getManager(row.notifyPostManager)
    managerInfo.value = data
}
</script>

<template>
  <div class="wrap" v-loading.fullscreen="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '添加通知')">添加</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改通知')">修改</el-button>
      <el-button v-debounce icon="delete" type="danger" :disabled="delDisabled" @click="deleteRow()">删除</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" @selectionChange="selectionChange" >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="notificationContent" label="通知内容" show-overflow-tooltip>
          <template #default="{row}">
            <div v-html="row.notificationContent" />
          </template>
        </el-table-column>
        <el-table-column prop="notificationReleaseTime" label="发布时间" show-overflow-tooltip/>
<!--        <el-table-column prop="notifyPostManager" label="发布人" width="60" />-->
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <el-popover
                placement="bottom-end"
                trigger="click"
                width="fit-content"
                @before-enter="popoverBefore(row)"
                v-if="row.notifyPostManager"
            >
              <template #default>
                  <el-descriptions
                      title="管理员信息"
                      :column="1"
                      border
                  >
                    <el-descriptions-item label="账号:">{{managerInfo.managerAccount}}</el-descriptions-item>
                    <el-descriptions-item label="名称:">{{managerInfo.managerName}}</el-descriptions-item>
                    <el-descriptions-item label="电话:">
                      <span @click="copyText(managerInfo.managerPhone)" title="点击复制" class="copy__able">{{managerInfo.managerPhone}}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="状态:">
                      <el-tag size="large" :type="managerInfo.onlineStatus === '离线' ? 'danger' : 'success'">{{managerInfo.onlineStatus}}</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </template>
                <template #reference>
                  <el-button circle icon="User" title="查看操作人"></el-button>
                </template>
            </el-popover>
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
            <el-date-picker v-model="form.notificationReleaseTime" type="datetime" placeholder="请选择发布时间" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
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
