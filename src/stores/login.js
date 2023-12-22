import {defineStore} from "pinia";
import {ref} from "vue";

export const useLoginStore = defineStore('login',() => {
    const form = ref({
        username: '',
        password: ''
    })
    const rules = {
        username: [
            { required: true, message: '请输入用户名/电话', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
    }
    return {
        form,
        rules
    }
})
