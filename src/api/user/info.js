import service from '@/utils/service'

const url = `/user/info`

export function addUserInfo(data) {
    return service({
        method: 'post',
        url,
        data
    })
}
export function getUserInfo(userId) {
    return service({
        method: 'get',
        url,
        params: {
            userId
        }
    })
}

export function updateUserInfo(data) {
    return service({
        method: 'put',
        url,
        data
    })
}
