import service from "@/utils/service";

const url = `/method`

export function getPhone(userPhone) {
    return service({
        method: 'get',
        url:`${url}/phone`,
        params: {
            userPhone
        }
    })
}

export function getMail(email) {
    return service({
        method: 'get',
        url:`${url}/mail`,
        params: {
            email
        }
    })
}
