import App from './App.vue'
import router from './router'
import pinia from './store/pinia'
import './assets/styles/index.less'
import 'ant-design-vue/dist/antd.less'

createApp(App).use(router).use(pinia).mount('#app')
