import '@/assets/style/index.scss'
import '@/assets/style/iconfont/iconfont.js'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import debounce from "@/utils/directives/debounce.js";

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.directive('debounce', debounce)
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
