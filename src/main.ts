import App from './App.vue'
import router from './router'
import pinia from './store/pinia'
import SvgIcon from './components/icon/index.vue'
import './assets/styles/index.less'
import './assets/iconfont/iconfont.js'

createApp(App).use(router).use(pinia).component('SvgIcon', SvgIcon).mount('#app')