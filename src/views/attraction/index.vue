<script setup>
import {ref, computed, watch} from 'vue'
import {useRouter} from "vue-router";
import {DeleteFilled, Edit, Plus} from "@element-plus/icons-vue";
import RichInput from "@/components/RichInput.vue";
import {listAttraction, deleteAttraction, addAttraction, updateAttraction} from "@/api/attraction/attraction.js";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const timeRange = ref([])
const fileList = ref([])
const uploadOptions = computed(() => ({
  // action: '/attraction/img',
  action: import.meta.env.VITE_BASE_URL + '/upload',
  accept: '.png, .jpeg, .jpg, .git, .webp',
  limit: 10,
  listType: 'picture-card',
  multiple: true
}))
const formRef = ref(null)
const rules = {
  'attractionName': [
    { required: true, message: '景点名称不能为空' }
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
const curIndex = computed(() => {
  return (queryParams.value.page - 1) * queryParams.value.size + 1
})
const getList = async () => {
  loading.value = true
  const  { data } =  await listAttraction(queryParams.value)
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

const selections = ref([])
const selectionChange = (list) => {
  editDisabled.value = list.length !== 1
  delDisabled.value = list.length < 1
  selections.value = list
}

const deleteRow = (row = selections.value) => {
  if(!row && row.length > 0) {
    ElMessage.warning('请先选择要删除的景点!')
  }
  const str = row.attractionId ? `是否删除景点${row.attractionName}?` : `是否删除${row.length}条数据?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteAttraction(row.attractionId || row.map(item => item.attractionId).join(','))
    loading.value = false
    ElMessage.success('删除成功!')
    getList()
  })
}

const dialogOpen = (row = {}, str = '') => {
  form.value = JSON.parse(JSON.stringify(row))
  fileList.value = JSON.parse(JSON.stringify(row.attractionImageList?.map((item,index) => ({uid: index, url: item}) ) || []))
  timeRange.value = [row.openingTime, row.closingTime]
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
  const fn = form.value.attractionId ? updateAttraction : addAttraction;
  form.value.attractionImages = fileList.value.map(item => item.url).join(',')
  form.value.openingTime = timeRange.value[0]
  form.value.closingTime = timeRange.value[1]
  fn(form.value).then(() => {
    ElMessage.success(form.value.attractionId ? '修改成功!' : '添加成功!')
    dialogClose()
    getList()
  })
}

const fileListChange = (res) => {
  fileList.value.push({
    uid: Date.now(),
    url: res.data
  })
}
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '添加景点')">添加景点</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改景点')">修改景点</el-button>
      <el-button v-debounce icon="delete" type="danger" :disabled="delDisabled" @click="deleteRow()">删除景点</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="attractionName" label="景点名称" />
<!--        <el-table-column prop="attraction.attractionInformation" label="景点介绍" >-->
<!--          <template #default="{row}">-->
<!--            <div class="notification-content" v-html="row.attraction.attractionInformation" />-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="开放时间" >
          <template #default="{row}">
            <div>
              <span class="open-time">{{row?.openingTime}}</span>
              -
              <span class="close-time">{{row?.closingTime}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="collectionCount" label="收藏人数" width="60" />
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button v-debounce :icon="Edit" circle title="修改" @click="dialogOpen(row, '修改景点')"/>
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
          <el-form-item label="景点名称" prop="attractionName">
            <el-input v-model="form.attractionName" placeholder="请输入景点名称"></el-input>
          </el-form-item>
          <el-form-item label="开放时间" prop="closingTime" property="openingTime,closingTime">
            <el-time-picker
                v-model="timeRange"
                is-range
                value-format="HH:mm:ss"
                range-separator="-"
                start-placeholder="开放时间"
                end-placeholder="关闭时间"
            />
          </el-form-item>
          <el-form-item label="景点介绍" prop="attractionInformation">
            <RichInput v-model="form.attractionInformation" placeholder="请输入景点介绍"/>
          </el-form-item>
          <el-form-item label="景点图片" prop="attractionImages">
            <el-upload v-bind="uploadOptions" :file-list="fileList" :on-success="fileListChange">
              <el-icon><Plus/></el-icon>
            </el-upload>
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
.notification-content {
  @apply truncate w-fit h-4;
}
</style>
