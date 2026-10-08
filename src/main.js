import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/main.css'

const saved = localStorage.getItem('mss-locale')
const locale = saved || i18n.global.locale.value
document.documentElement.lang = locale

createApp(App).use(i18n).mount('#app')