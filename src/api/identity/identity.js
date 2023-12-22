import service from "@/utils/service";

const url = `/identity`

export function listIdentity(params){
    return service({
        method: 'get',
        url,
        params
    })
}

export function addIdentity(data){
    return service({
        method: 'post',
        url,
        data
    })
}

export function updateIdentity(data){
    return service({
        method: 'put',
        url,
        data
    })
}

export function deleteIdentity(data){
    return service({
        method: 'delete',
        url,
        data
    })
}

export function getIdentityByOrder(id) {
    return service({
        method: 'get',
        url: `${url}/order/${id}`
    })
}
