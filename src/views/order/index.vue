<script setup>
import {ref, computed, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {encrypt} from "@/utils/encryption.js";
import {addManager, deleteManager, listManager} from "@/api/manager/manager.js";
import {useClipboard} from "@vueuse/core";
import {
  Check,
  CircleCheckFilled,
  DeleteFilled,
  Edit,
  House, InfoFilled,
  Key,
  Location,
  More,
  MoreFilled, Pointer, SuccessFilled
} from "@element-plus/icons-vue";
import {deleteOrder, endOrder, listOrder} from "@/api/order/order.js";
import {getHome, updateHome} from "@/api/home/home.js";
import {getIdentityByOrder} from "@/api/identity/identity.js";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const cardList = ref([])
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
  const  { data } =  await listOrder(queryParams.value)
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


const deleteRow = (row = selections.value) => {
  if(!row && row.length > 0) {
    ElMessage.warning('请先选择需要删除的订单!')
  }
  const str = row.orderId ? `是否删除该订单?` : `是否删除${row.length}条?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteOrder(row.orderId || row.map(item => item.orderId).join(','))
    loading.value = false
    ElMessage.success('删除成功!')
    getList()
  })
}
const dialogOpen = async (row, str = '') => {
  form.value = JSON.parse(JSON.stringify(row))
  const {data} = await getIdentityByOrder(form.value.orderId)
  cardList.value = data
  console.log(form.value,cardList.value)
  open.value = true
  title.value = str
}

const dialogClose = () => {
  open.value = false
  cardList.value = []
  title.value = ''
}

const submit = async () => {
  dialogClose()
}

const endRow =async (row) => {
  await ElMessageBox.confirm('是否结束该订单?','提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const {value} = await ElMessageBox.prompt('请输入扣除的押金', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValidator: (value) => {
      if (value === '') {
        return true
      }
      if (value < 0) {
        return '扣除的押金不能小于0'
      }
      if (value > row.orderPayment) {
        return '扣除的押金不能大于订单金额'
      }
      return true
    }
  })
  row.orderPayment -= value
  await updateHome({
    home: {
      ...row.home,
      homeState: '可入住'
    }
  })
  await endOrder(row)
  loading.value = false
  ElMessage.success('结束成功!')
  await getList()
}

const home = ref({})
const popoverLoading = ref(false)
const showHomeDetail = async (row) => {
  popoverLoading.value = true
  const {data} = await getHome(row.homeId)
  home.value = data
  popoverLoading.value = false
}

const isSelect = ref(Boolean(route.query.select))
const selectOrder = (row) => {
  window.opener.postMessage(JSON.parse(JSON.stringify(row)), '*')
  window.close()
}
</script>

<template>
  <div class="wrap" v-loading.fullscreen="loading">
    <div class="part part-table">
      <el-table :data="list" size="default" @selectionChange="selectionChange">
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column label="房屋信息" width="auto" show-overflow-tooltip>
          <template #default="{row}">
            <div class="flex items-center gap-1">
              <div class="home-info">
                <span class="home-name">{{row.home.homeName}}</span>
                <span class="home-type">{{row.home.homeType}}</span>
              </div>
              <el-popover trigger="hover" width="fit-content" @before-enter="showHomeDetail(row)">
                <template #reference>
                  <el-icon><WarningFilled /></el-icon>
                </template>
                <template #default>
                  <div class="home-detail">
                    <div class="home-detail__image">
                      <el-image shape="square" :src="home.home?.homeImageList[0]" fit="cover">
                        <template #error>
                          <span class="w-full h-full flex items-center justify-center">暂无照片</span>
                        </template>
                      </el-image>
                    </div>
                    <div class="home-detail__info">
                      <div class="home-detail__name">{{home.home?.homeName}}</div>
                      <div class="home-detail__type">{{home.home?.homeType}}</div>
                      <div class="home-detail__address"><el-icon><Location/></el-icon>{{home.home?.homeAddress}}</div>
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入住时间" prop="checkInTime" show-overflow-tooltip/>
        <el-table-column label="退房时间" prop="checkOutTime" show-overflow-tooltip/>
        <el-table-column label="付款金额" prop="orderPayment" show-overflow-tooltip>
          <template #default="{row}">
            <span>￥{{row.orderPayment.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderState" />
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <template v-if="isSelect">
              <el-button v-debounce :icon="Pointer" circle title="选择" @click="selectOrder(row)"></el-button>
              <el-button v-debounce :icon="MoreFilled" circle title="详情" @click="dialogOpen(row, '订单详情')"/>
            </template>
            <template v-else>
              <el-button v-debounce :icon="CircleCheckFilled" circle title="结束订单" @click="endRow(row)" :disabled="row.orderState !== '已退房'"/>
              <el-button v-debounce :icon="MoreFilled" circle title="详情" @click="dialogOpen(row, '订单详情')"/>
              <el-button v-debounce :icon="DeleteFilled" circle title="删除" @click="deleteRow(row)" :disabled="!['已结束','已取消','已退款'].includes(row.orderState)"/>
            </template>
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
.home-info {
  @apply grid grid-rows-2;
  .home-name {
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
