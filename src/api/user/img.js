import service from "@/utils/service";

const url = `/user/img`

export function checkImg(params) {
    return service({
        method: 'post',
        url: url + '/check',
        params
    })
}

export function getImg(id) {
    return service({
        method: 'get',
        url: url + '/' + id,
    })
}

