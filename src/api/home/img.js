import service from "@/utils/service";

const url = `/home/img`

export function getImg(id) {
    return service({
        method: 'get',
        url: `${url}/${id}`
    })
}

export function delImg(id) {
    return service({
        method: 'delete',
        url: `${url}/${id}`
    })
}
