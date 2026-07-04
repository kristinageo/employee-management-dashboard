<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from "primevue/card"
import { useEmployeeStore } from '@/stores/employeeStore';

const store  = useEmployeeStore()

const stats = computed(() => [
  {
    label: "Total Employees",
    value: store.employeesCache.length
  },
  {
    label: "This Year Hires",
    value: store.totalYearHires
  },
  {
    label: "Total Departments",
    value: store.totalDepartments
  }
])
</script>
<template>
  <div class="dashboard">
     <div class="cards">
      <Card v-for="item in stats" :key="item.label" class="card">
        <template #title>{{ item.label }}</template>
        <template #content>
          <h2>{{ item.value }}</h2>
        </template>
      </Card>
    </div>

  </div>

</template>
<style></style>