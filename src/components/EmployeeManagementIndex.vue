<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from "primevue/button"
import { ref, onMounted }  from 'vue'
import getEmployees from '../services/employeeService'

const employees = ref([]);
const loading = ref(true)


onMounted(async() => {
  employees.value = await getEmployees()
  loading.value = false;
})

</script>

<template>
  <p>
    Employee Management Index Page
  </p>
  <DataTable :value="employees" :rows="5">
      <Column field="actions" header="Actions">
        <template #body="{data}">
            <Button icon="pi pi-eye" text rounded @click="viewRow(data)"></Button>
            <Button icon="pi pi-pencil"  text rounded @click="editRow(data)"></Button>
            <Button icon="pi pi-trash"  text rounded severity="danger" @click="deleteRow(data)"></Button>
        </template>
      </Column>
      <Column field="fullName" header="Employee Full Name"/>
      <Column field="occupation" header="Occupation"/>
      <Column field="department" header="Department" />
      <Column field="dateOfEmployment" header="Date of Employment" />
      <Column field="terminationDate" header="Termination Date" />
  </DataTable>
</template>

