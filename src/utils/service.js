import axios from "axios";
import {useGlobalStore} from "@/stores/index.js";

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

service.interceptors.request.use(config => {
  if(localStorage.getItem('token')) {
    config.headers['authorization'] = 'Bearer ' + localStorage.getItem('token')
  }
  return config
})

// @ts-ignore
service.interceptors.response.use((response) => {
  if(response.status === 200) {
    if(response.data.code === 200) return response.data
    if(response.data.code === 403) {
      ElMessageBox.confirm('登录已过期，请重新登录？', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        useGlobalStore().logout()
      })
    }
    return ElMessage.error(response.data?.msg)
  }
  ElMessage.error(response.data?.msg)
})

export default service
