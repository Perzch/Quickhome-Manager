import service from "@/utils/service";

const url = `/manager/notification`

export function listNotification(params) {
    return service({
        method: 'get',
        url: url + '/list',
        params
    })
}

export function addNotification(data) {
    localStorage.setItem('execute', '新增通知')
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateNotification(data) {
    localStorage.setItem('execute', '修改通知')
    return service({
        method: 'put',
        url,
        data
    })
}

export function deleteNotification(id) {
    localStorage.setItem('execute', '删除通知')
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}
