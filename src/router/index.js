import {createRouter, createWebHistory} from 'vue-router'
import {useTitle} from "@vueuse/core";

const asyncRouter = {
    path: '/',
    name: 'Root',
    // redirect: redirect[localStorage.getItem('role')] || '/login/admin',
    component: () => import('@/components/layout/index.vue'),
    children: [
        {
            path: '/statistical',
            name: 'Statistical',
            component: () => import('@/views/statistical/index.vue'),
            meta: {
                role: '1',
                title: '流水统计'
            }
        },
        {
            path: '/house',
            name: 'House',
            component: () => import('@/views/house/index.vue'),
            meta: {
                role: '1',
                title: '房屋管理'
            }
        },
        {
            path: '/user',
            name: 'User',
            component: () => import('@/views/user/index.vue'),
            meta: {
                role: '1',
                title: '用户管理'
            }
        },
        {
            path: '/servicePerson',
            name: 'ServicePerson',
            component: () => import('@/views/servicePerson/index.vue'),
            meta: {
                role: '0',
                title: '服务人员管理'
            }
        },
        {
            path: '/order',
            name: 'Order',
            component: () => import('@/views/order/index.vue'),
            meta: {
                role: '0',
                title: '订单管理'
            }
        },
        {
            path: '/attraction',
            name: 'Attraction',
            component: () => import('@/views/attraction/index.vue'),
            meta: {
                role: '0',
                title: '景点管理'
            }
        },
        {
            path: '/coupon',
            name: 'Coupon',
            component: () => import('@/views/coupon/index.vue'),
            meta: {
                role: '0',
                title: '优惠券管理'
            }
        },
        {
            path: '/coupon/category',
            name: 'CouponCategory',
            component: () => import('@/views/coupon/category.vue'),
            meta: {
                role: '0',
                title: '优惠券分类管理'
            }
        },
        {
            path: '/notification',
            name: 'Notification',
            component: () => import('@/views/notification/index.vue'),
            meta: {
                role: '0',
                title: '通知管理'
            }
        },
        {
            path: '/log',
            name: 'Log',
            component: () => import('@/views/log/index.vue'),
            meta: {
                role: '0',
                title: '日志'
            }
        },
    ]
}


const asyncAddRouter = () => {
    removeRouter && removeRouter()
    const tmp = asyncRouter
    tmp.children = tmp.children.filter(item => localStorage.getItem('role') >= item.meta.role)
    removeRouter = router.addRoute(tmp)
}
let removeRouter = null;
// 每次页面刷新时重新添加一次
window.addEventListener('load', () => {
    asyncAddRouter()
})

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
    ]
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title ? `${to.meta.title} / QuickHome` : `QuickHome`
    useTitle(title)
    // 如果是根路由，根据角色跳转到相应的页面
    if(to.path === '/') {
        const obj = {
            0: '/order',
            1: '/statistical'
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
    if(!tmp && !to.query.redirect) return next({path: to.path,query: Object.assign({},to.query,{redirect: to.fullPath})})
    next()
})

export {
    removeRouter,
    asyncAddRouter
}

export default router
