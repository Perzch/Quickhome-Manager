import service from "@/utils/service";

const url = `/attraction/collection`

export function listCollection(params) {
    return service({
        method: 'get',
        url: `${url}/list`,
        params
    })
}

export function addCollection(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function delCollection(data) {
    return service({
        method: 'delete',
        url,
        data
    })
}

export function checkCollection(params) {
    return service({
        method: 'get',
        url: `${url}/check`,
        params
    })
}
