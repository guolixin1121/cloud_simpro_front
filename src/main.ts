import App from './App.vue'
import router from './router'
import pinia from './store/pinia'
import { preventReClick } from '@/utils/tools'
import './assets/styles/index.less'
import 'ant-design-vue/dist/antd.less'
import 'core-js/es/string/replace-all'

const app = createApp(App)
app.directive('preventReClick', preventReClick)
app.use(router).use(pinia).mount('#app')
