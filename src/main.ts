import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
// import './assets/styles/index.scss'

// createApp(App).use(router).use(createPinia()).use(Antd).mount('#app')
createApp(App).use(router).use(createPinia()).mount('#app')
