<script setup>
import {ref, computed, watch} from 'vue'
import {useRouter} from "vue-router";
import {DeleteFilled, Edit, Location, Plus} from "@element-plus/icons-vue";
import {addHome, deleteHome, listHome, updateHome} from "@/api/home/home.js";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
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
  'home.homeName': [
    { required: true, message: '房屋名称不能为空' }
  ],
  'home.homeType': [
    { required: true, message: '房屋类型不能为空' }
  ],
  'home.homeDayRent': [
    { required: true, message: '房屋日租金不能为空' },
    { type: 'number', message: '房屋日租金必须为数字' }
  ],
  'home.homeAddress': [
    { required: true, message: '房屋地址不能为空' }
  ],
  'homeImages': [
    { validator:(field, value, callback) => {
        if(fileList.value.length < 1) {
          callback(new Error('房屋图片至少上传一张'))
        } else {
          callback()
        }
      } }
  ],
  'homeInformation.homeArea': [
    { required: true, message: '房屋占地面积不能为空' },
    { type: 'number', message: '房屋占地面积必须为数字' }
  ],
  'homeInformation.homeDeposit': [
    { required: true, message: '房屋押金不能为空' },
    { type: 'number', message: '房屋押金必须为数字' }
  ],
  'homeInformation.houseStructure': [
    { required: true, message: '房屋结构描述不能为空' }
  ],
  'homeInformation.maxPerson': [
    { required: true, message: '房屋最大入住人数不能为空' },
    { type: 'number', message: '房屋最大入住人数必须为数字' }
  ],
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
  const  { data } =  await listHome(queryParams.value)
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
    ElMessage.warning('请先选择要删除的房屋!')
  }
  const str = row.homeId ? `是否删除房屋${row.home.homeName}?` : `是否删除${row.length}条数据?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteHome(row.homeId || row.map(item => item.homeId).join(','))
    loading.value = false
    ElMessage.success('删除成功!')
    getList()
  })
}

const dialogOpen = (row = {}, str = '') => {
  form.value = JSON.parse(JSON.stringify(row))
  console.log(form.value)
  form.value.home ??= {}
  form.value.homeInformation ??= {}
  if(form.value.homeDeviceList) {
    form.value.homeDeviceList.push({
      homeId: form.value.homeId
    })
  } else {
    form.value.homeDeviceList = [{
      homeId: form.value.homeId
    }]
  }
  fileList.value = JSON.parse(JSON.stringify(form.value.home.homeImages?.split(',').map((item,index) => {
    return {
      uid: index,
      url: item
    }
  }) || []))
  open.value = true
  title.value = str
}

const dialogClose = () => {
  open.value = false
  step.value = 1
  formRef.value.resetFields()
  title.value = ''
}

const submit = async () => {
  if(step.value === 3) {
    await formRef.value.validate()
    const fn = form.value.homeId ? updateHome : addHome;
    form.value.home.homeImages = fileList.value.map(item => item.url).join(',')
    const tmp = {
      ...form.value,
      homeDeviceList: form.value.homeDeviceList.filter(item => item.done)
    }
    fn(tmp).then(() => {
      ElMessage.success(form.value.homeId ? '修改成功!' : '添加成功!')
      dialogClose()
      getList()
    })
  } else {
    step.value ++
  }
}

const fileListChange = (res) => {
  fileList.value.push({
    uid: Date.now(),
    url: res.data
  })
}
const step = ref(1)
const stepTo = (n) => {
  step.value = n
}

const handleDoneDevice = (item) => {
  if(!item.deviceName || !item.deviceType || !item.brand || !item.price) {
    return ElMessage.warning('请先填写完整信息')
  }
  item.done = true
  form.value.homeDeviceList.push({
    homeId: form.value?.homeId
  })
}

const handleRemoveDevice = (index) => {
  form.value.homeDeviceList.splice(index, 1)
}
</script>

<template>
  <div class="wrap" v-loading.fullscreen="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '添加房屋')">添加</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改房屋')">修改</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="home.homeName" label="房屋名">
          <template #default="{row}">
            <div class="home-detail">
              <div class="home-detail__image">
                <el-image shape="square" :src="row.home?.homeImages?.split(',')[0]">
                  <template #error>
                    <span class="w-full h-full flex items-center justify-center">暂无照片</span>
                  </template>
                </el-image>
              </div>
              <div class="home-detail__info">
                <div class="home-detail__name">{{row.home?.homeName}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房屋类型" prop="home.homeType"/>
        <el-table-column label="房屋地址" prop="home.homeAddress" show-overflow-tooltip/>
        <el-table-column label="房屋状态" prop="home.homeState"/>
        <el-table-column prop="collectionCount" label="收藏人数" width="60" />
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <el-button v-debounce :icon="Edit" circle title="修改" @click="dialogOpen(row, '修改房屋')"/>
            <el-button v-debounce :icon="DeleteFilled" circle title="删除" @click="deleteRow(row)" :disabled="row.home.homeState !== '可入住'"/>
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
        <el-steps finish-status="success" :active="step" align-center>
          <el-step title="添加基本信息" class="cursor-pointer" @click="stepTo(1)"/>
          <el-step title="添加完整信息" class="cursor-pointer" @click="stepTo(2)" />
          <el-step title="添加设备信息" class="cursor-pointer" @click="stepTo(3)" />
        </el-steps>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="6.25rem">
          <el-collapse-transition>
              <div class="device-list" v-if="step === 3">
                <el-table :data="form.homeDeviceList">
                  <el-table-column label="名称">
                    <template #default="{row}">
                      <span v-if="row.done">{{row.deviceName}}</span>
                      <el-input v-model="row.deviceName" placeholder="请输入设备名称" v-else></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template #default="{row}">
                      <span v-if="row.done">{{row.deviceType}}</span>
                      <el-select v-model="row.deviceType" placeholder="请选择设备类型" v-else>
                        <el-option
                            v-for="item in ['电视','空调','冰箱','洗衣机','热水器','冷暖器','其他']"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="品牌">
                    <template #default="{row}">
                      <span v-if="row.done">{{row.brand}}</span>
                      <el-input v-model="row.brand" placeholder="请输入设备品牌" v-else></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格">
                    <template #default="{row}">
                      <span v-if="row.done">{{row.price}}</span>
                      <el-input-number :min="1" v-model="row.price" placeholder="请输入设备品牌" v-else></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template #default="{row, $index}">
                      <el-button circle icon="SuccessFilled" @click="handleDoneDevice(row)" v-if="!row.done"></el-button>
                      <el-button circle icon="CircleCloseFilled" @click="handleRemoveDevice($index)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </el-collapse-transition>
          <el-collapse-transition>
              <div v-if="step=== 2">
                <el-form-item label="占地面积" prop="homeInformation.homeArea">
                  <el-input type="number" :min="1" :max="999" v-model.number="form.homeInformation.homeArea" placeholder="请输入房屋占地面积"></el-input>
                </el-form-item>
                <el-form-item label="押金" prop="homeInformation.homeDeposit">
                  <el-input type="number" :min="1" v-model.number="form.homeInformation.homeDeposit" placeholder="请输入房屋押金"></el-input>
                </el-form-item>
                <el-form-item label="结构" prop="homeInformation.houseStructure">
                  <el-input type="textarea" :rows="2" v-model="form.homeInformation.houseStructure" placeholder="请输入房屋结构描述"></el-input>
                </el-form-item>
                <el-form-item label="人数" prop="homeInformation.maxPerson">
                  <el-input-number v-model="form.homeInformation.maxPerson" placeholder="请输入房屋最大入住人数"></el-input-number>
                </el-form-item>
              </div>
          </el-collapse-transition>
          <el-collapse-transition>
            <div v-if="step === 1">
              <el-form-item label="房屋名称" prop="home.homeName">
                <el-input v-model="form.home.homeName" placeholder="请输入房屋名称"></el-input>
              </el-form-item>
              <el-form-item label="房屋类型" prop="home.homeType">
                <el-input v-model="form.home.homeType" placeholder="请输入房屋类型"></el-input>
              </el-form-item>
              <el-form-item label="房屋日租" prop="home.homeDayRent">
                <el-input :min="1" v-model.number="form.home.homeDayRent" placeholder="请输入房屋日租金"></el-input>
              </el-form-item>
              <el-form-item label="房屋地址" prop="home.homeAddress">
                <el-input type="textarea" :rows="2" v-model="form.home.homeAddress" placeholder="请输入房屋地址"></el-input>
              </el-form-item>
              <el-form-item label="房屋图片" prop="homeImages">
                <el-upload v-bind="uploadOptions" :file-list="fileList" :on-success="fileListChange">
                  <el-icon><Plus/></el-icon>
                </el-upload>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="dialogClose" size="large" v-debounce>取消</el-button>
          <el-button type="primary" @click="submit" size="large" v-debounce :disabled="form.home?.homeState === '已入住'">{{step === 3 ? '确定' : '下一步'}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

.home-detail {
  @apply grid grid-cols-1 gap-4 max-w-96 md:grid-cols-2;
  .home-detail__image {
    @apply aspect-video w-full overflow-hidden lg:block hidden;
  }
  .home-detail__info {
    @apply flex flex-col justify-around;
    .home-detail__name {
      @apply font-semibold text-title;
    }
    .home-detail__address {
      @apply text-text text-opacity-70;
    }
    .home-detail__price {
      @apply self-end justify-self-end;
    }
  }
}
.device-list {
  .device-list__item {
    @apply grid grid-cols-5 place-content-center items-center gap-x-2 gap-y-4 divide-x divide-y;
    .device-list__name {
      @apply p-2;
    }
    .device-list__type {
      @apply p-2;
    }
    .device-list__brand {
      @apply p-2;
    }
    .device-list__price {
      @apply p-2;
    }
    .device-list__done {
      @apply p-2;
    }
  }
}
</style>
