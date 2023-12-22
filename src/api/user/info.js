import service from '@/utils/service'

const url = `/user/info`

export function addUserInfo(data) {
    return service({
        method: 'post',
        url,
        data
    })
}
export function getUserInfo(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function updateUserInfo(data) {
    return service({
        method: 'put',
        url,
        data
    })
}
