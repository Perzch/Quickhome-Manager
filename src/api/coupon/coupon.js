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
    localStorage.setItem('execute', '新增优惠券')
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateCoupon(data){
    localStorage.setItem('execute', '修改优惠券')
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
    localStorage.setItem('execute', '发放优惠券')
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
    localStorage.setItem('execute', '删除优惠券')
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
