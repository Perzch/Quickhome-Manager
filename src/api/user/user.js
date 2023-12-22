import service from '@/utils/service'
const url = `/user`

export function registerByPhone(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function login(data) {
    return service({
        method: 'post',
        url: url + '/login',
        data
    })
}

export function loginByPhone(data) {
    return service({
        method: 'get',
        url: url + '/login/phone',
        data
    })
}

export function setPassword(data) {
    return service({
        method: 'post',
        url: url + '/setPassword',
        data
    })
}

export function check(userAccount) {
    return service({
        method: 'get',
        url: url + '/check',
        params: {
            userAccount
        }
    })
}

export function checkByMailOrPhone(data) {
    return service({
        method: 'get',
        url: url + '/forget',
        data
    })
}

export function updateUser(data) {
    return service({
        method: 'put',
        url,
        data
    })
}

export function listUser(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function deleteUser(id) {
    return service({
        method: 'delete',
        url: url + '/' + id,
    })
}

export function refreshToken(token) {
    return service({
        method: 'post',
        url: url + '/refreshToken',
        params: {
            token
        }
    })
}
