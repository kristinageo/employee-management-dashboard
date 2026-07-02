<script setup lang="ts">
import { computed, ref } from 'vue';
import EmployeeManagementIndex from './components/EmployeeManagementIndex.vue';
import Dashboard from './components/Dashboard.vue';
import { Button } from 'primevue';
// import Department from './components/Department.vue';

const activePage = ref('dashboard')

const pages: Record<string, any> = {
    dashboard: Dashboard,
    employees: EmployeeManagementIndex
}

const navItems = computed(() =>
  Object.keys(pages).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1)
  })
 ))



const currentComponent = computed(() => pages[activePage.value])

</script>

<template>
  <nav class="navbar">
     <div class="nav-left">
           <span v-for="item in navItems" 
            :key="item.key"
            @click="activePage = item.key"
            :class="{active: activePage === item.key}">
                {{item.label}}
            </span>
     </div>
     <div class="nav-right">
         <Button icon="pi pi-user" label="Sign In"></Button>
     </div>
  </nav>
  <component :is="currentComponent" />
  
</template>

<style scoped>
span.active{
   background: lightseagreen;
   color: white;
   padding: 5px;
}
.navbar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid lightgray;
  padding-bottom: 5px;
}

.nav-left span{
  margin: 5px;
  cursor: pointer;
}
.nav-right{
  display: flex;
  align-items: center;
}
</style>
