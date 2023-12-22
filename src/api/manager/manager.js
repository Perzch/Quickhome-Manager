import service from "@/utils/service";

const url = `/manager`

export function listManager(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function getManager(id) {
    return service({
        method: 'get',
        url: `${url}/${id}`
    })
}

export function addManager(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateManager(data) {
    return service({
        method: 'put',
        url,
        data
    })
}

export function online(managerId) {
    return service({
        method: 'put',
        url: `${url}/online`,
        params: { managerId }
    })
}

export function offline(managerId) {
    return service({
        method: 'put',
        url: `${url}/offline`,
        params: { managerId }
    })
}

export function deleteManager(managerId) {
    return service({
        method: 'delete',
        url: `${url}/${managerId}`
    })
}

export function login(data) {
    return service({
        method: 'post',
        url: `${url}/login`,
        data
    })
}

export function superLogin(data) {
    return service({
        method: 'post',
        url: `${url}/super/login`,
        data
    })
}
