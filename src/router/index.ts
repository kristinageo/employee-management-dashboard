import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import EmployeeManagementIndex from '@/components/EmployeeManagementIndex.vue'
import ViewEmployee from '@/components/ViewEmployee.vue'
import EditEmployee from '@/components/EditEmployee.vue'

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
        component: EditEmployee,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;