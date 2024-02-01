<script setup>
import {ref} from 'vue'
import {getDayCount, getDayStatistics, getTotalCount, getTotalStatistics} from "@/api/order/order.js";
import {listRCAMI} from "@/api/RCAMI/RCAMI.js";
import {useRoute, useRouter} from "vue-router";
import {Location} from "@element-plus/icons-vue";
import {listHomeOrderByCollection} from "@/api/home/home.js";
import {listNotification} from "@/api/manager/notification.js";
import {listLog} from "@/api/log/log.js";
const loading = ref(true)
const role = localStorage.getItem('role')
const router = useRouter()
const dayCount = ref(0)
const totalCount = ref(0)
const dayStatistics = ref(0)
const totalStatistics = ref(0)
const houseServiceList = ref([])
const home = ref({})
const notificationList = ref([])
const logList = ref([])
const houseServiceQueryParam = ref({
  page: 1,
  size: 10,
  incomplete: true
})
const getList = async () => {
  loading.value = true
  console.log(role)
  if(role === '1') {
    const [ dayCountData,dayStatisticsData,totalCountData,totalStatisticsData ] = await Promise.all([
      getDayCount(),getDayStatistics(),getTotalCount(),getTotalStatistics(),
    ])
    dayCount.value = dayCountData.data || 0
    dayStatistics.value = dayStatisticsData.data || 0
    totalCount.value = totalCountData.data || 0
    totalStatistics.value = totalStatisticsData.data || 0
  }
  const [houseServiceData,homeData,notificationData, logData] = await Promise.all([
    listRCAMI(houseServiceQueryParam.value),listHomeOrderByCollection(),listNotification(),listLog()
  ])
  houseServiceList.value = houseServiceData?.data?.records || []
  home.value = homeData.data[0] || {}
  notificationList.value = notificationData.data?.records || []
  logList.value = logData.data?.records || []
  loading.value = false
}
getList()

const toHouseService = () => {
  router.push('/houseService')
}
</script>

<template>
  <div class="wrap">
    <div class="card-box" v-if="role === '1'">
      <div class="card">
        <div class="card__left">
          <h4>今日订单数</h4>
          <b>{{dayCount}}</b>
        </div>
        <div class="card__right">
          <el-icon><Tickets /></el-icon>
        </div>
      </div>
      <div class="card">
        <div class="card__left">
          <h4>今日销售额</h4>
          <b>￥{{dayStatistics.toFixed(2)}}</b>
        </div>
        <div class="card__right">
          <el-icon><Coin /></el-icon>
        </div>
      </div>
      <div class="card">
        <div class="card__left">
          <h4>总订单数</h4>
          <b>{{totalCount}}</b>
        </div>
        <div class="card__right">
          <el-icon><Tickets /></el-icon>
        </div>
      </div>
      <div class="card">
        <div class="card__left">
          <h4>总销售额</h4>
          <b>￥{{totalStatistics.toFixed(2)}}</b>
        </div>
        <div class="card__right">
          <el-icon><Coin /></el-icon>
        </div>
      </div>
    </div>
    <div class="part-box">
      <div class="part">
        <div class="part__operation">
          <p>需处理维修</p>
          <el-button type="primary" icon="More" circle title="前往处理" @click="toHouseService"></el-button>
        </div>
        <el-table :data="houseServiceList" size="default">
          <el-table-column label="维修地址" prop="home.homeAddress" show-overflow-tooltip/>
          <el-table-column label="维修需求" prop="rcami.RCAMIInformation" show-overflow-tooltip/>
        </el-table>
      </div>
      <div class="part self-stretch">
        <div class="part__operation">
          <p>热门房屋</p>
        </div>
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
      </div>
      <div class="part">
        <div class="part__operation">
          <p>日志</p>
        </div>
        <el-table :data="logList" size="default">
          <el-table-column prop="executionContent" label="操作描述" show-overflow-tooltip/>
          <el-table-column prop="executionTime" label="执行时间" show-overflow-tooltip/>
        </el-table>
      </div>
      <div class="part">
        <div class="part__operation">
          <p>最新通知</p>
        </div>
        <div class="divide-y flex flex-col gap-4">
          <div v-for="item in notificationList" :key="item.userNotificationId" v-html="item.notificationContent" class="notification__content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-box {
  @apply grid gap-6 grid-cols-2 md:grid-cols-4;
  .card {
    @apply text-text shadow-lg flex p-4 bg-white rounded-lg dark:bg-primary dark:text-white;
    &__left {
      @apply flex-3;
      b {
        @apply text-xl text-title dark:text-success;
      }
    }
    &__right {
      @apply flex-1 flex justify-center items-center bg-primary aspect-square rounded-lg dark:bg-white;
      .el-icon {
        @apply text-white dark:text-primary;
      }
    }
  }
}
.part-box {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 items-start;
  .part {
    @apply shadow-lg flex flex-col gap-2 text-text dark:bg-primary;
    &__operation {
      @apply flex items-center justify-between pr-4;
      p {
        @apply text-title dark:text-white;
      }
    }
  }
  .home-detail {
    @apply grid grid-cols-2 gap-4;
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
  .notification__content {
    @apply hover:bg-gray-100 dark:hover:bg-dark rounded-lg p-4;
  }
}
</style>
