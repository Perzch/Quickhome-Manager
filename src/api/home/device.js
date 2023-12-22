import service from '@/utils/service'

const url = `/home/device`

export function listDevice(params) {
    return service({
        url: `${url}/list`,
        method: 'get',
        params
    })
}

export function addDevice(data){
    return service({
        url,
        method: 'post',
        data
    })
}

export function updateDevice(data) {
    return service({
        url,
        method: 'put',
        data
    })
}

export function delDevice(id) {
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}

