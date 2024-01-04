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
    localStorage.setItem('execute', '新增房屋')
    return service({
        url,
        method: 'post',
        data
    })
}

export function updateHome(data) {
    localStorage.setItem('execute', '修改房屋信息')
    return service({
        url,
        method: 'put',
        data
    })
}

export function delHome(id) {
    localStorage.setItem('execute', '删除房屋')
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}
