import service from "@/utils/service";

const url = `/manager/binding`

export function listBinding(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function bind(data) {
    localStorage.setItem('execute', '为管理员绑定房屋')
    return service({
        method: 'post',
        url: url + '/bind',
        data
    })
}

export function unbind(data) {
    localStorage.setItem('execute', '为管理员解绑房屋')
    return service({
        method: 'post',
        url: url + '/unbind',
        data
    })
}
