import { createApp } from 'vue'
import EmployeeManagementIndex from './components/EmployeeManagementIndex.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'


const app = createApp(EmployeeManagementIndex)
app.use(PrimeVue, {
    theme:{
        preset: Aura
    }
})
app.mount('#app')