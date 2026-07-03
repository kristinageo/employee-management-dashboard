import { createApp } from 'vue'


import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import App from '@/App.vue'
import router from './router'
import { Button, Column, DataTable } from 'primevue'
import { createPinia } from 'pinia'


const app = createApp(App)
app.use(PrimeVue, {
    theme:{
        preset: Aura
    }
})
app.use(createPinia())
app.use(router)

app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')