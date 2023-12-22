import service from "@/utils/service";

const url = `/balance`

export function getBalance(id) {
    return service({
        method: 'get',
        url: `${url}/${id}`
    })
}

export function addBalance(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateBalance(data) {
    return service({
        method: 'put',
        url,
        data
    })
}
