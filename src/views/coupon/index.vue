<script setup>
import {ref, computed, watch, onUnmounted, onMounted} from 'vue'
import {useRouter} from "vue-router";
import {addNotification, deleteNotification, listNotification, updateNotification} from "@/api/manager/notification.js";
import {DeleteFilled, Edit, InfoFilled, Pointer, UserFilled} from "@element-plus/icons-vue";
import RichInput from "@/components/RichInput.vue";
import {addCoupon, deleteCoupon, listCoupon, releaseCoupon, updateCoupon} from "@/api/coupon/coupon.js";

const loading = ref(true)
const editDisabled = ref(true)
const delDisabled = ref(true)
const form = ref({})
const formRef = ref(null)
const useDateRange = ref([])
watch(() => useDateRange.value, (val) => {
  if(val.length > 0) {
    form.value.earliestUseTime = val[0]
    form.value.latestUseTime = val[1]
  }
},{
  deep: true
})
const rules = {
  couponName: [
    { required: true, message: '优惠券名称不能为空' }
  ],
  discountInformation: [
    { required: true, message: '详细内容不能为空' }
  ],
  discountMethod: [
    { required: true, message: '打折方式不能为空' }
  ],
  earliestUseTime: [
    { required: true, message: '使用时间段不能为空' }
  ],
  discountIntensity: [
    { validator: (field, value, callback) => {
        if(form.value.discountMethod === '满减') {
          if(!value) {
            callback(new Error('满减金额不能为空'))
          } else if(value < 0) {
            callback(new Error('满减金额不能小于0'))
          } else if(value > form.value.useThreshold) {
            callback(new Error('满减金额不能大于需满足金额'))
          } else {
            callback()
          }
        } else {
          if(!value) {
            callback(new Error('折扣力度不能为空'))
          } else if(value < 0.1) {
            callback(new Error('折扣力度不能小于0.1'))
          } else {
            callback()
          }
        }
      }
    }
  ],
  useThreshold: [
    { required: true, message: '需满足金额不能为空' },
    { type: 'number', message: '需满足金额为数字类型' }
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
  const  { data } =  await listCoupon(queryParams.value)
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
    ElMessage.warning('请先选择要删除的优惠券!')
  }
  const str = row.couponId ? `是否删除优惠券${row.couponId}?` : `是否删除${row.length}条优惠券?`
  ElMessageBox.confirm(str,'提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    loading.value = true
    await deleteCoupon(row.couponId || row.map(item => item.couponId).join(','))
    loading.value = false
    ElMessage.success('删除成功!')
    getList()
  })
}

const dialogOpen = (row = {}, str = '') => {
  open.value = true
  title.value = str
  form.value = JSON.parse(JSON.stringify(row))
  if(form.value.discountIntensity) {
    form.value.discountIntensity = form.value.discountIntensity * 10
  }
  if(form.value.earliestUseTime && form.value.latestUseTime) {
    useDateRange.value = [form.value.earliestUseTime, form.value.latestUseTime]
  }
}


const dialogClose = () => {
  open.value = false
  formRef.value.resetFields()
  useDateRange.value = []
  title.value = ''
}

const submit = async () => {
  await formRef.value.validate()
  const fn = form.value.couponId ? updateCoupon : addCoupon;
  if(form.value.discountIntensity && form.value.discountMethod === '折扣') {
    form.value.discountIntensity = form.value.discountIntensity / 10
  }
  fn(form.value).then(() => {
    ElMessage.success(form.value.couponId ? '修改成功!' : '添加成功!')
    dialogClose()
    getList()
  })
}

const discountMethodChange = () => {
  formRef.value.resetFields(['discountIntensity'])
  form.value.discountIntensity = null
}

const release = (row, flag) => {
  // flag代表是否全体发放
  if(!flag) {
    window.open(`/user?couponId=${row.couponId}`,'_blank')
  } else {
    ElMessageBox.confirm('是否向全部用户发放此优惠券?','提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      loading.value = true
      await releaseCoupon({
        couponId:row.couponId,
      })
      loading.value = false
      ElMessage.success('发放成功!')
    })
  }
}

const listenUpdate = (e) => {
  console.log(e)
  ElMessage.success('优惠券发放成功!')
}
onMounted(() => {
  window.addEventListener('message', listenUpdate)
})
onUnmounted(() => {
  window.removeEventListener('message', listenUpdate)
})
</script>

<template>
  <div class="wrap" v-loading="loading">
    <div class="part-button-group">
      <el-button v-debounce icon="plus" type="success" @click="dialogOpen({}, '添加优惠券')">添加</el-button>
      <el-button v-debounce icon="edit" type="primary" :disabled="editDisabled" @click="dialogOpen(selections[0], '修改优惠券')">修改</el-button>
      <el-button v-debounce icon="delete" type="danger" :disabled="delDisabled" @click="deleteRow()">删除</el-button>
    </div>
    <div class="part part-table">
      <el-table :data="list" @selectionChange="selectionChange" table-layout="auto">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" width="80" type="index" :index="curIndex"></el-table-column>
        <el-table-column prop="couponName" label="名称"  />
        <el-table-column prop="discountInformation" label="详细信息" show-overflow-tooltip>
          <template #default="{row}">
            <div v-html="row.discountInformation"></div>
          </template>
        </el-table-column>
        <el-table-column prop="discountMethod" label="打折方式" />
        <el-table-column prop="discountIntensity" label="打折力度">
          <template #default="{row}">
            <template v-if="row.discountMethod === '满减'">
              ￥{{row.discountIntensity}}
            </template>
            <template v-else>
              {{row.discountIntensity * 10}}折
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="useThreshold" label="需满足" >
          <template #default="{row}">
            ￥{{row.useThreshold}}
          </template>
        </el-table-column>
        <el-table-column prop="earliestUseTime" label="使用时间段" show-overflow-tooltip>
          <template #default="{row}">
            <div>
              <span class="open-time">{{row?.earliestUseTime}}</span>至
              <span class="close-time">{{row?.latestUseTime}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="{row}">
            <div class="execute">
              <el-button v-debounce :icon="Pointer" circle title="选择用户发放" @click="release(row)"/>
              <el-button v-debounce :icon="Pointer" circle title="全体发放" @click="release(row, true)"/>
              <el-button v-debounce :icon="Edit" circle title="修改" @click="dialogOpen(row, '修改优惠券')"/>
              <el-button v-debounce :icon="DeleteFilled" circle title="删除" @click="deleteRow(row)"/>
            </div>
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
        <el-form :model="form" :rules="rules" ref="formRef" label-width="8.25rem">
          <el-form-item label="名称" prop="couponName">
            <el-input v-model="form.couponName" placeholder="请输入优惠券名称"></el-input>
          </el-form-item>
          <el-form-item label="详细内容" prop="discountInformation">
            <el-input type="textarea" :rows="2" v-model="form.discountInformation" placeholder="请输入详细内容"></el-input>
<!--            <RichInput v-model="form.discountInformation" placeholder="请输入详细内容"/>-->
          </el-form-item>
          <el-form-item label="使用时间段" prop="earliestUseTime">
            <el-date-picker
                v-model="useDateRange"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="打折方式" prop="discountMethod">
            <el-radio-group v-model="form.discountMethod" @change="discountMethodChange">
              <el-radio label="满减">满减</el-radio>
              <el-radio label="折扣">折扣</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="折扣力度" prop="discountIntensity">
            <template #label>{{form.discountMethod === '满减' ? '满减金额' : '折扣力度'}}</template>
            <template #default>
              <template v-if="form.discountMethod === '满减'">
                <el-input v-model.number="form.discountIntensity" placeholder="请输入满减金额">
                  <template #append>元</template>
                </el-input>
              </template>
              <template v-else>
                <el-input-number :min="0.1" :max="9.9" v-model="form.discountIntensity" placeholder="请输入折扣力度">
                  <template #append>折</template>
                </el-input-number>
              </template>
            </template>
          </el-form-item>
          <el-form-item label="需满足金额" prop="useThreshold">
            <el-input v-model.number="form.useThreshold">
              <template #append>元</template>
            </el-input>
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
.execute {
  @apply whitespace-nowrap;
}
</style>
