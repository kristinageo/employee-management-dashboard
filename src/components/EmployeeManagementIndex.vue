<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from "primevue/button"
import ConfirmDialog from 'primevue/confirmdialog'
import { ref, onMounted }  from 'vue'
import type { Employee } from '@/types/Employee'
import { getEmployees } from '@/services/employeeService'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useConfirm } from 'primevue/useconfirm'


const employees = ref<Employee[]>([]);
const loading = ref(false);
const totalRecords = ref(0);
const router = useRouter()
const {setSelectedEmployee, cacheEmployees} = useEmployeeStore()
const confirm = useConfirm();

function viewEmployee(employee: Employee){
   setSelectedEmployee(employee)
    router.push({
       name: 'employee-detail',
       params: { code: employee.code }
   })
}    

function editEmployee(employee: Employee)
{
  setSelectedEmployee(employee)
  router.push({
      name: 'employee-detail-edit',
      params: { code: employee.code }
  })
}


function deleteEmployee(employee: Employee)
{
     confirm.require({
      message: `Are you sure you want to delete ${employee.fullName} ?`,
      header: 'Confirmation required',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: 
      {
        label: 'Close',
        severity: 'secondary'
      },
      acceptProps: 
      {
        label:'Save',
        severity: 'danger'
      },
      accept: () => {
          employees.value = employees.value.filter(emp => emp.code != employee.code)
          useEmployeeStore().employeesCache = useEmployeeStore().employeesCache.filter(emp => emp.code != employee.code)
          totalRecords.value = Math.max(0, totalRecords.value - 1);
      }
     })
}

const getEmploymentStatus = (dateOfEmployment: string) => {
   if(!dateOfEmployment) return 'Unknown'

   const employmentDate = new Date(dateOfEmployment);
   const now = new Date()

   return employmentDate < now 
   ? 'Currently working'
   : 'Employed soon'
}

const getTerminationStatus = (terminationDate: string) => {
   if(!terminationDate) return 'Unknown'

   const termination = new Date(terminationDate);
   const now = new Date()

   return termination < now 
   ? 'Terminated'
   : 'To be terminated'
}



const onPage = async (event:any) => {
  loading.value = true;
  const result = await getEmployees(event.first, event.rows)
  employees.value = result.data;
  totalRecords.value = result.totalRecords;
  cacheEmployees(result.data);
  loading.value = false;

}




onMounted(async() => {
  loading.value = true;
   const result = await getEmployees(0,5);
   employees.value = result.data;
   totalRecords.value = result.totalRecords;
   cacheEmployees(result.data);
   loading.value = false;
})

</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <DataTable paginator 
      lazy
      :value="employees" 
      :rows="5" 
      :totalRecords="totalRecords"
      @page="onPage"
      scrollable
      scrollHeight="flex"
      :loading="loading"
      showCurrentPageReport
      currentPageReportTemplate ="Showing {first} to {last} of {totalRecords}">
      <Column field="actions" header="Actions">
        <template #body="{data}">
            <Button icon="pi pi-eye" text rounded @click="viewEmployee(data)"></Button>
            <Button icon="pi pi-pencil"  text rounded @click="editEmployee(data)"></Button>
            <Button icon="pi pi-trash"  text rounded severity="danger" @click="deleteEmployee(data)"></Button>
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
  <div class="add-container">
      <Button label="Create New Employee" icon="pi pi-plus"></Button>
  </div>
</template>

<style>
.add-container{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

</style>