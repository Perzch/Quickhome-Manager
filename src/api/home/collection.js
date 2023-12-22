import service from "@/utils/service";
const url = `/home/collection`

export function listCollection(params) {
    return service({
        url: `${url}/list`,
        method: 'get',
        params
    })
}

export function addCollection(data) {
    return service({
        url,
        method: 'post',
        data
    })
}

export function delCollection(data) {
    return service({
        url,
        method: 'delete',
        data
    })
}

export function checkCollection(params) {
    return service({
        url: `${url}/check`,
        method: 'get',
        params
    })
}
