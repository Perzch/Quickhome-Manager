import service from "@/utils/service";
const url = `/home/info`

export function addHomeInfo(data){
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateHomeInfo(data) {
    return service({
        method: 'put',
        url,
        data
    })
}
