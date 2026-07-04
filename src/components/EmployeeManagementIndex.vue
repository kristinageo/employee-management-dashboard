<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

import type { Employee } from '@/types/Employee'
import { getEmployees } from '@/services/employeeService'
import { useEmployeeStore } from '@/stores/employeeStore'

const router = useRouter()
const confirm = useConfirm()
const employeeStore = useEmployeeStore()

const employees = ref<Employee[]>([])

const loading = ref(false)
const totalRecords = ref(0)

// -------------------- NAVIGATION --------------------

function viewEmployee(employee: Employee) {
  employeeStore.setSelectedEmployee(employee)

  router.push({
    name: 'employee-detail',
    params: { code: employee.code }
  })
}

function editEmployee(employee: Employee) {
  employeeStore.setSelectedEmployee(employee)

  router.push({
    name: 'employee-detail-edit',
    params: { code: employee.code }
  })
}

function createEmployee() {
  router.push({ name: 'create-employee' })
}

// -------------------- DELETE --------------------

function deleteEmployee(employee: Employee) {
  confirm.require({
    message: `Are you sure you want to delete ${employee.fullName}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',

    accept: () => {
      employeeStore.deleteEmployee(employee.code)
      totalRecords.value = employeeStore.employeesCache.length
    }
  })
}

// -------------------- STATUS HELPERS --------------------

function getEmploymentStatus(dateOfEmployment: string) {
  if (!dateOfEmployment) return 'Unknown'

  const d = new Date(dateOfEmployment)
  return d < new Date() ? 'Currently working' : 'Employed soon'
}

function getTerminationStatus(terminationDate: string) {
  if (!terminationDate) return 'Unknown'

  const d = new Date(terminationDate)
  return d < new Date() ? 'Terminated' : 'To be terminated'
}

// -------------------- LOAD DATA --------------------

const onPage = async (event: any) => {
  loading.value = true

  console.log(event.first, event.rows)

  const result = await getEmployees(event.first, event.rows)

  console.log(result.data)
  //employeeStore.cacheEmployees(result.data)
  totalRecords.value = result.totalRecords
  employees.value  = result.data;
  console.log(result.data);

  loading.value = false
}

onMounted(async () => {
  loading.value = true

  const result = await getEmployees(0, 5)
  

  // employeeStore.cacheEmployees(result.data)
  totalRecords.value = result.totalRecords
  employees.value  = result.data;
  loading.value = false
})
</script>
<template>
  <ConfirmDialog />

  <DataTable
    paginator
    lazy
    :value="employees"
    :rows="5"
    :totalRecords="totalRecords"
    @page="onPage"
    scrollable
    scrollHeight="flex"
    :loading="loading"
    showCurrentPageReport
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
  >
    <Column field="actions" header="Actions">
      <template #body="{ data }">
        <Button icon="pi pi-eye" text rounded @click="viewEmployee(data)" />
        <Button icon="pi pi-pencil" text rounded @click="editEmployee(data)" />
        <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteEmployee(data)" />
      </template>
    </Column>

    <Column field="fullName" header="Employee Full Name" sortable />
    <Column field="occupation" header="Occupation" sortable />
    <Column field="department" header="Department" sortable />

    <Column field="dateOfEmployment" header="Date of Employment" sortable>
      <template #body="{ data }">
        {{ getEmploymentStatus(data.dateOfEmployment) }}
      </template>
    </Column>

    <Column field="terminationDate" header="Termination Date" sortable>
      <template #body="{ data }">
        {{ getTerminationStatus(data.terminationDate) }}
      </template>
    </Column>
  </DataTable>

  <div class="add-container">
    <Button label="Create New Employee" icon="pi pi-plus" @click="createEmployee" />
  </div>
</template>
<style>
.add-container{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>