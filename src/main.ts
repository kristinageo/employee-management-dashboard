import { createApp } from 'vue'


import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import App from '@/App.vue'
import router from './router'
import { Button, Column, DataTable, InputText } from 'primevue'
import ConfirmationService from 'primevue/confirmationservice'
import { createPinia } from 'pinia'
import DatePicker from 'primevue/datepicker'

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
app.component('InputText', InputText)
app.component('DatePicker', DatePicker);
app.use(ConfirmationService)

app.mount('#app')