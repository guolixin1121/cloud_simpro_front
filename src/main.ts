import { createApp } from 'vue'
import SvgIcon from './components/icon/index.vue'
import './assets/iconfont/iconfont.js'
import App from './App.vue'
import router from './router'
import pinia from './store/pinia'
import './assets/styles/index.less'

createApp(App).use(router).use(pinia).component('SvgIcon', SvgIcon).mount('#app')