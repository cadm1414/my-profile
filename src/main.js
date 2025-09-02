import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupAxiosInterceptors } from '@/services/axiosService'
import App from './App.vue'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css'

setupAxiosInterceptors()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
