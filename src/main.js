import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import router from '@/router/index'
import run from '@/core/core.js'
import App from './App.vue'
import VueDiff from 'vue-diff';
import 'vue-diff/dist/index.css';
import "@icon-park/vue-next/styles/index.css";


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(ElementPlus,{
    locale: zhCn,
  })
  .use(router)
  .use(VueDiff, {componentName: 'VueDiff',})
  .mount('#app')

export default app
