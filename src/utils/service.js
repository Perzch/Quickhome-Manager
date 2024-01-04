import axios from "axios";
import {useGlobalStore} from "@/stores/index.js";
import {addLog} from "@/api/log/log.js";

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
    if(response.data.code === 200) {
      const execute = localStorage.getItem('execute')
      const str = localStorage.getItem('role') === '1' ? '超管' : '管理'
      if(execute) {
        navigator.geolocation.getCurrentPosition((position) => {
          addLog({
            userPerformingId: localStorage.getItem('userId'),
            executionContent: `${localStorage.getItem('username')} ${execute}`,
            device: window.innerWidth >= 768 ? 'pc' : 'phone',
            executionPlace: `${position.coords.longitude},${position.coords.latitude}`
          })
        }, (error) => {
          addLog({
            userPerformingId: localStorage.getItem('userId'),
            executionContent: `${str}-${localStorage.getItem('username')}:${execute}`,
            device: window.innerWidth >= 768 ? 'pc' : 'phone',
            executionPlace: '无法获取位置信息'
          })
        }, {
            enableHighAccuracy: true,
            timeout: 100,
            maximumAge: 0
        })
        localStorage.setItem('execute', '')
      }
      return response.data
    }
    if(response.data.code === 403) {
      ElMessageBox.confirm('登录已过期，请重新登录？', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        useGlobalStore().logout()
      })
    }
  }
  ElMessage.error(response.data?.msg)
    return Promise.reject(response.data)
})

export default service
