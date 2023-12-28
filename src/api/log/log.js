import service from "@/utils/service";

const url = `/log`

export function listLog(params) {
    return service({
        method: 'get',
        url: url + '/list',
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
