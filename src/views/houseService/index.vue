<script setup>
import {ref, computed, watch, onUnmounted, onMounted} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {addManager, deleteManager, listManager, updateManager} from "@/api/manager/manager.js";
import {useClipboard} from "@vueuse/core";
import {
  CircleCheckFilled,
  DeleteFilled,
  Edit,
  InfoFilled,
  Key,
  Location,
  More, MoreFilled,
  SuccessFilled
} from "@element-plus/icons-vue";
import {addRCAMI, finishRCAMI, listRCAMI} from "@/api/RCAMI/RCAMI.js";
import {getIdentityByOrder} from "@/api/identity/identity.js";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const formRef = ref(null)
const rules = {
  selected: [
    { required: true, message: '请选择订单' }
  ],
  RCAMIInformation: [
    { required: true, message: '维修需求不能为空' }
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
  const  { data } =  await listRCAMI(queryParams.value)
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

const copyText = (str) => {
  if(isSupported) {
    copy && copy(str)
    ElMessage.success('复制成功!')
  } else {
    ELMessage.error('浏览器不支持复制功能!')
  }
}

const dialogOpen = async (row = {}, str = '') => {
  let tmp = JSON.parse(JSON.stringify(row))
  if(row?.order) {
    const {data} = await getIdentityByOrder(row.order.orderId)
    cardList.value = data
    tmp = {
      ...row.rcami,
      ...row.order,
      selected: true,
      home: row.home
    }
  }
  form.value = tmp
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
  if(title.value.includes('新增')) {
    await addRCAMI(form.value)
    ElMessage.success('添加成功!')
  }
  dialogClose()
  getList()
}

const finish = (row) => {
  ElMessageBox.confirm(`是否结束维修?`,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await finishRCAMI(row.rcami)
    loading.value = false
    ElMessage.success('结束成功!')
    await getList()
  })
}

const cardList = ref([])
const selectOrder = () =>{
  loading.value = true
  window.open('/order?select=1', '_blank')
}
const listenSelect = async e => {
  if(e.data?.orderId) {
    const {data} = await getIdentityByOrder(e.data.orderId)
    cardList.value = data
    form.value = {
      ...e.data,
      selected: true
    }
    loading.value = false
  }
}
onMounted(() => {
  window.addEventListener('message', listenSelect)
})

onUnmounted(() => {
  window.removeEventListener('message', listenSelect)
})
</script>

<template>
  <div class="wrap" v-loading.fullscreen="loading">
    <div>
      <el-button type="primary" icon="plus" @click="dialogOpen({},'新增报修')">报修</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
<!--        <el-table-column type="selection"></el-table-column>-->
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column label="维修地址" prop="home.homeAddress" show-overflow-tooltip/>
        <el-table-column label="维修需求" prop="rcami.RCAMIInformation" show-overflow-tooltip/>
        <el-table-column label="状态" prop="rcami.completion">
          <template #default="{row}">
            <el-tag :type="row.rcami.completion ? 'success' : 'danger'">
              {{row.rcami.completion || '未完成'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="rcami.completionProcessTime" show-overflow-tooltip/>
        <el-table-column label="发起人" prop="user.userName">
          <template #default="{row}">
            {{row?.user?.userName || '管理员'}}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="user.userPhone" show-overflow-tooltip>
          <template #default="{row}">
            <span class="copy__able" @click="copyText(row.user.userPhone)" v-if="row.user?.userPhone">{{row.user.userPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <el-button v-debounce :icon="CircleCheckFilled" circle title="结束维修"
                       @click="finish(row)" :disabled="Boolean(row.rcami.completion)"/>
            <el-button v-debounce :icon="MoreFilled" circle title="查看详情" @click="dialogOpen(row,'维修详情')"></el-button>
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
        <el-form :model="form" :rules="rules" size="large" ref="formRef" label-width="7.525rem">
          <el-form-item label="订单" prop="selected">
            <el-button type="primary" @click="selectOrder">选择</el-button>
          </el-form-item>
          <el-form-item label="维修需求" prop="RCAMIInformation">
            <el-input type="textarea" :rows="2" v-model="form.RCAMIInformation" placeholder="请输入维修需求"></el-input>
          </el-form-item>
          <div class="shadow-inner p-4 rounded-md" v-if="form.selected">
            <p class="font-semibold">订单信息:</p>
            <div class="flex flex-col gap-4 p-4">
              <p>住宿时间段:</p>
              <el-steps align-center>
                <el-step :title="form.checkInTime" :icon="InfoFilled" title="入住时间">
                  <template #title>
                    <span>{{form.checkInTime}}</span>
                  </template>
                  <template #description>
                    <span>入住时间</span>
                  </template>
                </el-step>
                <el-step :title="form.checkOutTime" :icon="SuccessFilled" title="结束时间">
                  <template #title>
                    <span>{{form.checkOutTime}}</span>
                  </template>
                  <template #description>
                    <span>结束时间</span>
                  </template>
                </el-step>
              </el-steps>
              <p>房间信息:</p>
              <div class="home-detail">
                <div class="home-detail__image">
                  <el-image shape="square" :src="form.home?.homeImages?.split(',')[0]" fit="cover">
                    <template #error>
                      <span class="w-full h-full flex items-center justify-center">暂无照片</span>
                    </template>
                  </el-image>
                </div>
                <div class="home-detail__info">
                  <div class="home-detail__name">{{form.home?.homeName}}</div>
                  <div class="home-detail__type">{{form.home?.homeType}}</div>
                  <div class="home-detail__address"><el-icon><Location/></el-icon>{{form.home?.homeAddress}}</div>
                  <div class="home-detail__day-rent">预计日租:￥{{form.home?.homeDayRent}}</div>
                </div>
              </div>
              <p>入住人信息</p>
              <div class="check-in-card__list">
                <div class="check-in-card__item" v-for="item in cardList" :key="item.IDCardRecordID">
                  <div class="check-in-card__item__name">
                    <el-icon><UserFilled /></el-icon>
                    <span>{{item.IDCardName}}</span>
                  </div>
                  <div class="check-in-card__item__phone">
                    <el-icon><Iphone /></el-icon>
                    <span class="copy__able" @click="copyText(item.IDCardPhoneNumber)">{{item.IDCardPhoneNumber}}</span>
                  </div>
                  <div class="check-in-card__item__id-card">
                    <el-icon><CreditCard /></el-icon>
                    <span>{{item.IDCardNumber}}</span>
                  </div>
                </div>
              </div>
              <p class="self-end">支付金额: <span class="detail__payment">￥{{form.orderPayment.toFixed(2)}}</span></p>
            </div>

          </div>
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
.home-detail {
  @apply grid grid-cols-2 gap-4 max-w-96;
  .home-detail__image {
    @apply object-cover;
  }
  .home-detail__info {
    @apply flex flex-col justify-around;
    .home-detail__name {
      @apply font-semibold text-2xl text-title;
    }
    .home-detail__address {
      @apply text-text text-opacity-70;
    }
    .home-detail__price {
      @apply self-end justify-self-end;
    }
  }
}
.check-in-card__list {
  @apply flex gap-4;
  .check-in-card__item {
    @apply flex-1 flex flex-col gap-2 p-2 shadow-md rounded-md;
    .check-in-card__item__name,.check-in-card__item__phone,.check-in-card__item__id-card {
      @apply flex items-center gap-4;
    }
    .check-in-card__item__name {
      @apply text-title font-semibold;
    }
    .check-in-card__item__id-card {
      @apply text-title font-semibold;
    }
  }
}
.detail__payment {
  @apply text-red-600 text-2xl font-bold;
}
</style>
