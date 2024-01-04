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
    localStorage.setItem('execute', '新增设备')
    return service({
        url,
        method: 'post',
        data
    })
}

export function updateDevice(data) {
    localStorage.setItem('execute', '修改设备信息')
    return service({
        url,
        method: 'put',
        data
    })
}

export function delDevice(id) {
    localStorage.setItem('execute', '删除设备')
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}

