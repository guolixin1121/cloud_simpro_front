import App from './App.vue'
import router from './router'
import pinia from './store/pinia'
import './assets/styles/index.less'

createApp(App).use(router).use(pinia).mount('#app')

