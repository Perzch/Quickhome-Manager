import {createRouter, createWebHistory} from 'vue-router'


const routes = {
        path: '/',
        name: 'Root',
        component: () => import('@/components/layout/index.vue'),
        children: [

            {
                path: '/statistical',
                name: 'Statistical',
                component: () => import('@/views/statistical/index.vue'),
                meta: {
                    role: '1'
                }
            },
            {
                path: '/house',
                name: 'House',
                component: () => import('@/views/house/index.vue'),
                meta: {
                    role: '1'
                }
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('@/views/user/index.vue'),
                meta: {
                    role: '1'
                }
            },
            {
                path: '/servicePerson',
                name: 'ServicePerson',
                component: () => import('@/views/servicePerson/index.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/order',
                name: 'Order',
                component: () => import('@/views/order/index.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/attraction',
                name: 'Attraction',
                component: () => import('@/views/attraction/index.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/coupon',
                name: 'Coupon',
                component: () => import('@/views/coupon/index.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/coupon/category',
                name: 'CouponCategory',
                component: () => import('@/views/coupon/category.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/notification',
                name: 'Notification',
                component: () => import('@/views/notification/index.vue'),
                meta: {
                    role: '0'
                }
            },
            {
                path: '/log',
                name: 'Log',
                component: () => import('@/views/log/index.vue'),
                meta: {
                    role: '0'
                }
            },
        ]
    }

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login/admin',
            name: 'LoginAdmin',
            component: () => import('@/views/loginAdmin.vue'),
        },
        {
            path: '/login/super',
            name: 'LoginSuperAdmin',
            component: () => import('@/views/loginSuperAdmin.vue'),
        }
    ].concat(routes)
})

export { routes }
export default router
