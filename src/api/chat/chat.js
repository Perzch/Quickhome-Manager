import service from "@/utils/service";

const url = `/chat`

export function chat(data){
    return service({
        method: 'post',
        url,
        data
    })
}

export function listChat(params){
    return service({
        method: 'get',
        url: url + '/history',
        params
    })
}
