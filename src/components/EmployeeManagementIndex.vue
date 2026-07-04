<script setup lang="ts">
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

import type { Employee } from '@/types/Employee'
import { useEmployeeStore } from '@/stores/employeeStore'

const router = useRouter()
const confirm = useConfirm()
const employeeStore = useEmployeeStore()

const employees = ref<Employee[]>([])

const loading = ref(false)
const totalRecords = ref(0)

const statusOptions = [ 
    'Unknown',
    'To be terminated',
    'Terminated' 
]

// VIEW FEATURE TO SEE DETAILS ABOUT SPECIFIC EMPLOYEE

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

// DELETE FEATURE FOR EMPLOYEE

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

// GET TEXT DESCRIPTIONS FOR THE DATES

function getEmploymentStatus(dateOfEmployment: string) {
  if (!dateOfEmployment) return 'Unknown'

  const d = new Date(dateOfEmployment)
  return d < new Date() ? 'Currently working' : 'Employed soon'
}

// function getTerminationStatus(terminationDate: string) {
//   if (!terminationDate) return 'Unknown'

//   const d = new Date(terminationDate)
//   return d < new Date() ? 'Terminated' : 'To be terminated'
// }

onMounted(async () => {
  //LOAD THE EMPLOYEES IN THE TABLE 
  loading.value = true
  const result = await employeeStore.getEmployees(0, 5)
  totalRecords.value = result.totalRecords
  employees.value  = result.data;
  loading.value = false
})

//FILTERS NEEDED FOR PRIMEVUE

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: 'contains' },
  fullName: { value: null, matchMode: 'contains' },
  department: { value: null, matchMode: 'contains' },
  occupation: { value: null, matchMode: 'contains' },
  dateOfEmployment: { value: null, matchMode: 'contains'},
  terminationStatus: { value: null, matchMode: 'equals' }
})


const loadData = async (first = 0, rows = 5, filtersData?: DataTableFilterMeta, sortField?: string, sortOrder?: number) => {
  loading.value = true

  const result = await employeeStore.getEmployees(first, rows, filtersData, sortField, sortOrder)

  employees.value = result.data
  totalRecords.value = result.totalRecords

  loading.value = false
}


const onPage = async (event: any) => {
  loadData(event.first, event.rows, filters.value)
}

const onFilter = async (event: any) => {
  loadData(0, 5, event.filters)
}

const onSort = async (event: any) => {
  loadData(event.first, event.rows, filters.value, event.sortField, event.sortOrder)
}

// const statusOptions = [
//   { label: 'Active', value: 'Active' },
//   { label: 'To be terminated', value: 'To be terminated' },
//   { label: 'Terminated', value: 'Terminated' }
// ]

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
    v-model:filters = "filters"
    @filter="onFilter"
    filterDisplay="row"
    scrollable
    scrollHeight="flex"
    @sort="onSort"
    :loading="loading"
    showCurrentPageReport
    breakpoint="960px"
    responsiveLayout="scroll"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
  >
    <Column field="actions" header="Actions">
      <template #body="{ data }">
        <Button icon="pi pi-eye" text rounded @click="viewEmployee(data)" />
        <Button icon="pi pi-pencil" text rounded @click="editEmployee(data)" />
        <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteEmployee(data)" />
      </template>
    </Column>
    <Column
    field="fullName"
    header="Employee Full Name"
    sortable
    :showFilterMenu="false"
    >
        <template #filter="{ filterModel, filterCallback }">
            <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Search Full Name"
            />
        </template>
    </Column>
    <Column
    field="occupation"
    header="Occupation"
    sortable
    :showFilterMenu="false"
    >
        <template #filter="{ filterModel, filterCallback }">
            <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Search Occupation"
            />
        </template>
    </Column>
    <Column
    field="department"
    header="Department"
    sortable
    :showFilterMenu="false"
    >
        <template #filter="{ filterModel, filterCallback }">
            <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Search Department"
            />
        </template>
    </Column>


    <Column field="dateOfEmployment" 
      header="Employment Status" 
      filterField="dateOfEmployment"
      sortable
      filter
      :showFilterMenu="false">
      <template #body="{ data }">
        {{ getEmploymentStatus(data.dateOfEmployment) }}
      </template>
        <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          placeholder="Search Employment date..."
          @input="filterCallback()"
        />
      </template>
    </Column>

    <Column
      field="terminationDate"
      header="Termination Status"
      filterField="terminationStatus"
      sortable
      filter
      :showFilterMenu="false"
    >
      <template #body="{ data }">
        {{ employeeStore.getTerminationStatus(data.terminationDate) }}
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <Select
          v-model="filterModel.value"
          :options="statusOptions"
          placeholder="Select status"
          @change="filterCallback()"
        />
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
.actions{
  display: flex;
  gap: 1px;
  flex-wrap: wrap;
}
.p-datatable{
  width: 100%;
}

@media (max-width: 768px) {
  .add-container {
    justify-content: center;
  }

  .p-datatable {
    font-size: 10px;
  }

  .actions {
    justify-content: center;
  }

  .p-column-filter {
    width: 100%;
    min-width: 120px;
  }

  .add-container .p-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>