import service from "@/utils/service";

const url = `/review/attraction`

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

export function likeReview(attractionReviewId) {
    return service({
        method: 'put',
        url: url + '/like',
        params: { attractionReviewId }
    })
}

export function deleteReview(attractionReviewId) {
    return service({
        method: 'delete',
        url: `${url}/${attractionReviewId}`
    })
}
