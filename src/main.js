import '@/assets/style/index.scss'
import '@/assets/style/iconfont/iconfont.js'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
// froala editor
import VueFroala from 'vue-froala-wysiwyg';
//Import Froala Editor
import 'froala-editor/js/plugins.pkgd.min.js';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/languages/zh_cn.js'
// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import debounce from "@/utils/directives/debounce.js";

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.directive('debounce', debounce)
app.use(VueFroala)
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
