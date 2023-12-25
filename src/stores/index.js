import {useStorage} from "@vueuse/core";
import {getUserInfo as getUInfo} from "@/api/user/info";
import { defineStore } from 'pinia'
import {ref, watch} from "vue";
import {useRouter} from "vue-router";

export const useGlobalStore =defineStore('global', () => {
    const userId = useStorage('userId', '')
    const token = useStorage('token', '')
    const role = useStorage('role', '')
    const username = useStorage('username', '')
    const userInfo = ref(null)
    const router = useRouter()
    const getUserInfo = async () => {
        if(userId.value && token.value) {
            const res = await getUInfo({userId:userId.value,token:token.value})
            userInfo.value = res.data
            if(role.value === '1') {
                username.value = res.data.superManagerAccount
            } else {
                username.value = res.data.managerAccount
            }
        }
    }
    watch(() => [userId.value,token.value], () => {
        console.log('watch')
        console.log(userId.value, token.value)
        getUserInfo()
    })
    const logout = () => {
        userId.value = ''
        token.value = ''
        router.push('/login/admin')
    }
    return {
        username,
        userInfo,
        userId,
        token,
        logout,
        getUserInfo
    }
})
