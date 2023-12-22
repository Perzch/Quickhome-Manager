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
    return service({
        method: 'post',
        url: url + '/bind',
        data
    })
}

export function unbind(data) {
    return service({
        method: 'post',
        url: url + '/unbind',
        data
    })
}
