import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import EmployeeManagementIndex from '@/components/EmployeeManagementIndex.vue'
import ViewEmployee from '@/components/ViewEmployee.vue'
import EmployeeForm from '@/components/EmployeeForm.vue'


//ALL NEEDED ROUTES FOR THIS APP
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        props: false
    },
    {
        path: '/employees',
        name: 'employees',
        component: EmployeeManagementIndex,
        props: false
    },
    {
        path:'/employees/:code',
        name: 'employee-detail',
        component: ViewEmployee,
        props: true
    },
    {
        path: '/employees/edit/:code',
        name: 'employee-detail-edit',
        component: EmployeeForm,
        props: true
    },
        {
        path: '/employees/new',
        name: 'create-employee',
        component: EmployeeForm,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;