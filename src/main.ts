import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import SvgIcon from './assets/iconfont/svgIcon.vue'
// import './assets/iconfont/iconfont.js'
import App from './App.vue'
import router from './router'
import './assets/styles/index.less'
// component('SvgIcon', SvgIcon)
createApp(App).use(router).use(createPinia()).mount('#app')
