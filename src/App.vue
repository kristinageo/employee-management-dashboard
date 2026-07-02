<script setup lang="ts">
import { computed, ref } from 'vue';
import EmployeeManagementIndex from './components/EmployeeManagementIndex.vue';
import Dashboard from './components/Dashboard.vue';
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

console.log(navItems)

console.log(Object.keys(pages))

const currentComponent = computed(() => pages[activePage.value])

</script>

<template>
  <p>test</p>
  <nav>
      <span v-for="item in navItems" 
      :key="item.key"
      @click="activePage = item.key"
      :class="{active: activePage === item.key}">
          {{item.label}}
      </span>
  </nav>
  <component :is="currentComponent" />
  
</template>

<style scoped>
span.active{
   background: lightseagreen;
   color: white;
   margin-right: 10px;
   padding: 5px;
}
</style>
