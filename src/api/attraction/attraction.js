import service from "@/utils/service";

const url = `/attraction`

export function listAttraction(params) {
    return service({
        method: 'get',
        url: url + '/list',
        params
    })
}

export function listAttractionByCollection() {
    return service({
        method: 'get',
        url: url + '/ByCollection',
    })
}

export function getAttraction(id) {
    return service({
        method: 'get',
        url: url + '/' + id,
    })
}

export function addAttraction(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateAttraction(data) {
    return service({
        method: 'put',
        url,
        data
    })
}

export function delAttraction(id) {
    return service({
        method: 'delete',
        url: url + '/' + id
    })
}
