import {createRouter, createWebHistory} from 'vue-router'
import {useTitle} from "@vueuse/core";


const getAsyncRouter = (role = localStorage.getItem('role')) => {
    const obj = {
        path: '/',
        name: 'Root',
        // redirect: redirect[localStorage.getItem('role')] || '/login/admin',
        component: () => import('@/components/layout/index.vue'),
        children: [
            // {
            //     path: '/statistical',
            //     name: 'Statistical',
            //     component: () => import('@/views/statistical/index.vue'),
            //     meta: {
            //         role: '1',
            //         title: '流水统计',
            //         icon: 'Histogram'
            //     }
            // },
            {
                path: '/house',
                name: 'House',
                component: () => import('@/views/house/index.vue'),
                meta: {
                    role: '1',
                    title: '房屋',
                    icon: 'HomeFilled'
                }
            },
            {
                path: '/manager',
                name: 'Manager',
                component: () => import('@/views/manager/index.vue'),
                meta: {
                    role: '1',
                    title: '管理员',
                    icon: 'Avatar'
                }
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('@/views/user/index.vue'),
                meta: {
                    role: '0',
                    title: '用户',
                    icon: 'UserFilled'
                }
            },
            // {
            //     path: '/servicePerson',
            //     name: 'ServicePerson',
            //     component: () => import('@/views/servicePerson/index.vue'),
            //     meta: {
            //         role: '0',
            //         title: '服务人员',
            //         icon: 'Avatar'
            //     }
            // },
            {
                path: '/order',
                name: 'Order',
                component: () => import('@/views/order/index.vue'),
                meta: {
                    role: '0',
                    title: '订单',
                    icon: 'List'
                }
            },
            {
                path: '/attraction',
                name: 'Attraction',
                component: () => import('@/views/attraction/index.vue'),
                meta: {
                    role: '0',
                    title: '景点',
                    icon: 'Flag'
                }
            },
            {
                path: '/houseService',
                name: 'HomeService',
                component: () => import('@/views/houseService/index.vue'),
                meta: {
                    role: '0',
                    title: '房屋维修',
                    icon: 'BrushFilled'
                }
            },
            {
                path: '/coupon',
                name: 'Coupon',
                component: () => import('@/views/coupon/index.vue'),
                meta: {
                    role: '0',
                    title: '优惠券',
                    icon: 'Ticket'
                }
            },
            // {
            //     path: '/coupon/category',
            //     name: 'CouponCategory',
            //     component: () => import('@/views/coupon/category.vue'),
            //     meta: {
            //         role: '0',
            //         title: '优惠券分类',
            //         icon: 'Ticket'
            //     }
            // },
            {
                path: '/notification',
                name: 'Notification',
                component: () => import('@/views/notification/index.vue'),
                meta: {
                    role: '0',
                    title: '通知',
                    icon: 'BellFilled'
                }
            },
            {
                path: '/log',
                name: 'Log',
                component: () => import('@/views/log/index.vue'),
                meta: {
                    role: '0',
                    title: '日志',
                    icon: 'Checked'
                }
            },
        ]
    }
    obj.children = obj.children.filter(item => role >= item.meta.role)
    return obj
}

const getAsyncRouterChildren = (role = localStorage.getItem('role')) => getAsyncRouter(role).children

const asyncAddRouter = () => {
    router.addRoute(getAsyncRouter())
    return Promise.resolve()
}
// 每次页面刷新时重新添加一次
// window.addEventListener('load', () => {
//     asyncAddRouter()
// })

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login/admin',
            name: 'LoginAdmin',
            component: () => import('@/views/loginAdmin.vue'),
            meta: {
                title: '管理员登录'
            }
        },
        {
            path: '/login/super',
            name: 'LoginSuperAdmin',
            component: () => import('@/views/loginSuperAdmin.vue'),
            meta: {
                title: '超管登录'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFound.vue'),
            meta: {
                title: '404 Not Found'
            }
        },
    ].concat(['',null,undefined].includes(localStorage.getItem('role')) ? [] : [getAsyncRouter()])
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title ? `${to.meta.title} / QuickHome` : `QuickHome`
    useTitle(title)
    // 如果是根路由，根据角色跳转到相应的页面
    if(to.path === '/') {
        const obj = {
            0: '/order',
            1: '/manager'
        }
        const role = localStorage.getItem('role')
        if(role) {
            return next(obj[role])
        } else {
            return next('/login/admin')
        }
    }
    const tmp = router.getRoutes().find(r => r.path === to.path)
    // 如果tmp不存在，说明该路由不存在，加上一个query参数redirect，用于在登录后跳转到该路由
    if(!tmp && !to.query.redirect) {
        return next({path: to.path,query: Object.assign({},to.query,{redirect: to.fullPath})})
    }
    next()
})

export {
    asyncAddRouter,
    getAsyncRouterChildren
}

export default router
