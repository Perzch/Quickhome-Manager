import service from "@/utils/service";

const url = `/order`

export function addOrder(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function payOrder(data) {
    return service({
        method: 'post',
        url: `${url}/pay`,
        data
    })
}

export function checkOut(orderId) {
    return service({
        method: 'post',
        url: `${url}/checkOut`,
        params: { orderId }
    })
}

export function endOrder(data) {
    return service({
        method: 'post',
        url: `${url}/end`,
        data
    })
}

export function listOrder(params) {
    return service({
        method: 'post',
        url: `${url}/list`,
        params
    })
}

export function listOrderByHome(params) {
    return service({
        method: 'post',
        url: `${url}/home/list`,
        params
    })
}

export function updateOrder(data) {
    return service({
        method: 'post',
        url: `${url}/update`,
        data
    })
}

export function deleteOrder(id) {
    return service({
        method: 'post',
        url: `${url}/${id}`
    })
}

export function endOrderRefund(orderId) {
    return service({
        method: 'post',
        url: `${url}/endOrderRefund`,
        params: { orderId }
    })
}

export function scheduleCancellation(orderId) {
    return service({
        method: 'post',
        url: `${url}/scheduleCancellation`,
        params: { orderId }
    })
}
