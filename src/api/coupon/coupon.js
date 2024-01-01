import service from "@/utils/service";

const url = `/coupon`

export function listCoupon(params) {
    return service({
        method: 'get',
        url: url + '/coupon/list',
        params
    })
}

export function addCoupon(data){
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateCoupon(data){
    return service({
        method: 'put',
        url,
        data
    })
}

export function getCoupon(id) {
    return service({
        method: 'get',
        url: `${url}/${id}`
    })
}

export function releaseCoupon(data){
    return service({
        method: 'post',
        url: url + '/release',
        data
    })
}

export function useCoupon(UACID) {
    return service({
        method: 'put',
        url,
        params: {UACID}
    })
}

export function deleteCoupon(id) {
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}

export function getLastUseTime(couponId) {
    return service({
        method: 'get',
        url: url + '/getLastUseTime',
        params: { couponId }
    })
}
