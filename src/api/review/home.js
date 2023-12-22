import service from "@/utils/service";

const url = `/review/home`

export function listReview(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function getReview(id) {
    return service({
        method: 'get',
        url: `${url}/${id}`
    })
}

export function addReview(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function likeReview(housingReviewId) {
    return service({
        method: 'put',
        url: url + '/like',
        params: { housingReviewId }
    })
}

export function deleteReview(housingReviewId) {
    return service({
        method: 'delete',
        url: `${url}/${housingReviewId}`
    })
}
