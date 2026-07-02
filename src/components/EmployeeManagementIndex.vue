<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from "primevue/button"
import { ref, onMounted }  from 'vue'
import getEmployees from '../services/employeeService'


const employees = ref([]);
const loading = ref(true)

const getEmploymentStatus = (dateOfEmployment: string) => {
   if(!dateOfEmployment) return 'Unknown'

   const employmentDate = new Date(dateOfEmployment);
   const now = new Date()

   return employmentDate < now 
   ? 'Currenly working'
   : 'Employed soon'
}

const getTerminationStatus = (terminationDate: string) => {
   if(!terminationDate) return 'Unknown'

   const termination = new Date(terminationDate);
   const now = new Date()

   return termination < now 
   ? 'To be terminated'
   : 'Terminated'
}

onMounted(async() => {
  employees.value = await getEmployees()
  loading.value = false;
})

</script>

<template>
  <DataTable :value="employees" :rows="5">
      <Column field="actions" header="Actions">
        <template #body="{data}">
            <Button icon="pi pi-eye" text rounded @click="viewRow(data)"></Button>
            <Button icon="pi pi-pencil"  text rounded @click="editRow(data)"></Button>
            <Button icon="pi pi-trash"  text rounded severity="danger" @click="deleteRow(data)"></Button>
        </template>
      </Column>
      <Column field="fullName" header="Employee Full Name" sortable/>
      <Column field="occupation" header="Occupation" sortable/>
      <Column field="department" header="Department" sortable/>
      <Column field="dateOfEmployment" header="Date of Employment" sortable>
         <template #body="{data}">
             <span>
                 {{ getEmploymentStatus(data.dateOfEmployment) }}
             </span>
         </template>
      </Column>
      <Column field="terminationDate" header="Termination Date" sortable >
        <template #body="{data}">
             <span>
                {{(getTerminationStatus(data.terminationDate))}}
             </span>
        </template>
      </Column>
  </DataTable>
</template>

