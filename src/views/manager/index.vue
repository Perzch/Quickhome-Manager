<script setup>
import {ref, computed} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {encrypt} from "@/utils/encryption.js";
import {addManager, deleteManager, listManager, updateManager} from "@/api/manager/manager.js";
import {useClipboard} from "@vueuse/core";
import {DeleteFilled, Edit, Key} from "@element-plus/icons-vue";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const formRef = ref(null)
const rules = {
  managerName: [
    { required: true, message: '姓名不能为空' }
  ],
  managerPhone: [
    { required: true, message: '手机号不能为空' },
    { regexp: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式不正确' }
  ]
}
const list = ref([])
const total = ref(0)
const route = useRoute()
const router = useRouter()
const queryParams = ref({
  page: 1,
  size: 10,
  userId: route.query.userId || undefined
})
const open = ref(false)
const title = ref('')

const curIndex = computed(() => {
  return (queryParams.value.page - 1) * queryParams.value.size + 1
})
const {copy, isSupported} = useClipboard()

const getList = async () => {
  loading.value = true
  const  { data } =  await listManager(queryParams.value)
  list.value = data.records
  total.value = data.total
  loading.value = false
}
getList()

const selections = ref([])
const selectionChange = (list) => {
  editDisabled.value = list.length !== 1
  delDisabled.value = list.length < 1
  selections.value = list
}

const copyPhone = (row) => {
  if(isSupported) {
    copy && copy(row.managerPhone)
    ElMessage.success('复制成功!')
  } else {
    ELMessage.error('浏览器不支持复制功能!')
  }
}


const deleteRow = (row = selections.value) => {
  if(!row && row.length > 0) {
    ElMessage.warning('请先选择要删除的管理员!')
  }
  const str = row.managerName ? `是否删除管理员${row.managerName}?` : `是否删除${row.length}条?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteManager(row.managerId || row.map(item => item.managerId).join(','))
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
  const fn = form.value.managerId ? updateManager : addManager
  const tmp = {
    ...form.value,
    managerPwd: form.value.managerId ? null : encrypt('quickhome888')
  }
  loading.value = true
  await fn(tmp)
  ElMessage.success(form.value.managerId ? '修改成功!' : '添加成功!')
  dialogClose()
  getList()
}


const resetPassword = async (row) => {
  await ElMessageBox.confirm(`是否将${row.managerName}的密码重置为quickhome888?`,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  loading.value = true
  await updateManager({
    ...row,
    managerPwd: encrypt('quickhome888')
  })
  loading.value = false
  ElMessage.success('重置成功!')
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '新增管理员')">新增管理员</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改管理员')">修改管理员</el-button>
      <el-button v-debounce icon="delete" type="danger" :disabled="delDisabled" @click="deleteRow()">删除管理员</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column label="账号" width="auto">
          <template #default="{row}">
            <div class="account-email-box">
              <span class="user-account">{{row.managerName}}</span>
              <span class="user-email">{{row.managerAccount}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template #default="{row}">
            <span class="manager-phone" @click="copyPhone(row)" title="点击复制">{{row.managerPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="managerGender" label="性别" width="60"/>
        <el-table-column label="状态">
          <template #default="{row}">
            <el-tag size="large" :type="row.onlineStatus === '离线' ? 'info' : 'primary'">{{row.onlineStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button v-debounce :icon="Key" circle title="重置密码"  @click="resetPassword(row)" />
            <el-button v-debounce :icon="Edit" circle title="修改" @click="dialogOpen(row, '修改管理员')"/>
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
          @size-change="getList"
          @current-change="getList"
      />
    </div>
    <el-dialog v-model="open" :title="title" @close="dialogClose">
      <div class="flex flex-col gap-4">
        <el-form :model="form" :rules="rules" size="large" ref="formRef" label-width="6.25rem">
          <el-form-item label="姓名" prop="managerName">
            <el-input v-model="form.managerName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-show="title === '添加管理员'">
            <el-input model-value="quickhome123" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="managerGender">
            <el-radio-group v-model="form.managerGender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号" prop="managerPhone">
            <el-input v-model="form.managerPhone" placeholder="请输入手机号"></el-input>
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
.account-email-box {
  @apply grid grid-rows-2;
  .user-account {
    @apply font-semibold text-title;
  }
}
.manager-phone {
  @apply text-text cursor-pointer;
  &:hover {
    @apply text-primary underline;
  }
}
</style>
