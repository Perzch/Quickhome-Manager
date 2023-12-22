import service from "@/utils/service";

const url = `/manager/notification`

export function listNotification(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function addNotification(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateNotification(data) {
    return service({
        method: 'put',
        url,
        data
    })
}

export function deleteNotification(id) {
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}
