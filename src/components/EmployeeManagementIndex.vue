<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from "primevue/button"
import { ref, onMounted }  from 'vue'
import employeesJson from '../data/purple_cross_employees.json'
import type { Employee } from '@/types/Employee'

const employees = ref<Employee[]>([]);
const loading = ref(true);
const totalRecords = ref(0);
const allEmployees: Employee[] = employeesJson as Employee[];
const page = ref(0)
const rows = ref(5);



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

const loadPage = () => {
    const start = page.value * rows.value;
    const end = start + rows.value;

    employees.value = allEmployees.slice(start, end)
   // console.log(employees)
}

const onPage = (event:any) => {
  page.value = event.page;
  rows.value = event.rows;

  loadPage()
}


function getEmployees(): Promise<Employee[]>{
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve(employeesJson);
              }, 500);
          });
}

onMounted(async() => {
  loading.value = true;
  const data = await getEmployees()
  employees.value = data;
  console.log('getEmployees:', data)
  totalRecords.value = data.length;
  loadPage()
  loading.value = false;

})


</script>

<script setup lang="ts">

    
</script>

<template>
  <DataTable paginator 
      lazy
      :value="employees" 
      :rows="rows" 
      :totalRecords="totalRecords"
      @page="onPage"
      :loading="loading"
      showCurrentPageReport
      currentPageReportTemplate ="Showing {first} to {last} of {totalRecords}">
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

