import service from "@/utils/service";

const url = `/RCAMI`

export function addRCAMI(data) {
    return service({
        method: 'post',
        url,
        data
    })
}

export function finishRCAMI(data) {
    return service({
        method: 'put',
        url: `${url}/finish`,
        data
    })
}

export function listRCAMI(params) {
    return service({
        method: 'get',
        url,
        params
    })
}
