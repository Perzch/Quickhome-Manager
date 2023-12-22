import service from "@/utils/service";

const url = `/log`

export function listLog(params) {
    return service({
        method: 'get',
        url,
        params
    })
}

export function addLog(data) {
    return service({
        method: 'post',
        url,
        data
    })
}
