import {useStorage} from "@vueuse/core";
import {getUserInfo as getUInfo} from "@/api/user/info";
import { defineStore } from 'pinia'
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {offline} from "@/api/manager/manager.js";

export const useGlobalStore =defineStore('global', () => {
    const userId = useStorage('userId', '')
    const token = useStorage('token', '')
    const role = useStorage('role', '')
    const username = useStorage('username', '')
    const userInfo = ref(null)
    const router = useRouter()
    // const getUserInfo = async () => {
    //     if(userId.value && token.value) {
    //         const res = await getUInfo({userId:userId.value,token:token.value})
    //         userInfo.value = res.data
    //         if(role.value === '1') {
    //             username.value = res.data.superManagerAccount
    //         } else {
    //             username.value = res.data.managerAccount
    //         }
    //     }
    //     return Promise.resolve()
    // }
    // watch(() => userId.value, () => {
    //     getUserInfo()
    // })
    const logout = () => {
        if(localStorage.getItem('role') === '0') {
            offline(localStorage.getItem('userId'))
        }
        localStorage.setItem('userId', '')
        localStorage.setItem('token', '')
        localStorage.setItem('role', '')
        localStorage.setItem('username', '')
        router.removeRoute('Root')
        router.push('/login/admin')
    }
    return {
        username,
        userInfo,
        userId,
        token,
        logout,
        // getUserInfo
    }
})
