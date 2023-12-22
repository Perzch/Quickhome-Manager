import {useStorage} from "@vueuse/core";
import {getUserInfo as getUInfo} from "@/api/user/info";
import { defineStore } from 'pinia'

export const useGlobalStore =defineStore('global', () => {
    const userId = useStorage('userId', '')
    const token = useStorage('token', '')
    const getUserInfo = async () => {
        if(userId.value && token.value) {
            const res = await getUInfo({userId:userId.value,token:token.value})
            return res.data
        }
    }

    const logout = () => {
        userId.value = ''
        token.value = ''
        location.href='/login'
    }
    return {
        getUserInfo,
        userId,
        token,
        logout
    }
})
