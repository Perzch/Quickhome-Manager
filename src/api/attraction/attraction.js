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
    localStorage.setItem('execute', '新增景点')
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateAttraction(data) {
    localStorage.setItem('execute', '修改景点')
    return service({
        method: 'put',
        url,
        data
    })
}

export function deleteAttraction(id) {
    localStorage.setItem('execute', '删除景点')
    return service({
        method: 'delete',
        url: url + '/' + id
    })
}
