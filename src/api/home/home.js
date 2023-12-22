import service from '@/utils/service'

const url = `/home`
export function listHome(params) {
    return service({
        url: `${url}/list`,
        method: 'get',
        params
    })
}

export function listHomeOrderByCollection() {
    return service({
        url: `${url}/byCollection`,
        method: 'get'
    })
}

export function checkHome(params) {
    return service({
        url: `${url}/check`,
        method: 'get',
        params
    })
}

export function getHome(id){
    return service({
        url: `${url}/${id}`,
        method: 'get'
    })
}

export function addHome(data) {
    return service({
        url,
        method: 'post',
        data
    })
}

export function updateHome(data) {
    return service({
        url,
        method: 'put',
        data
    })
}

export function delHome(id) {
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}
