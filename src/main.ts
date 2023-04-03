import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SvgIcon from './components/svgIcon.vue'
import './assets/iconfont/iconfont.js'
import App from './App.vue'
import router from './router'
import './assets/styles/index.less'

createApp(App).use(router).use(createPinia()).component('SvgIcon', SvgIcon).mount('#app')
