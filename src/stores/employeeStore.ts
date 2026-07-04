import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Employee } from '@/types/Employee'
import employeeData from '@/data/purple_cross_employees.json'

//STORE FOR Purple Cross Ltd

export const useEmployeeStore = defineStore('employee', () => {
  const employeesCache = ref<Employee[]>(employeeData as Employee[])
  const selectedEmployee = ref<Employee | null>(null)

  //HOW MANY DEPARTMENTS ARE IN THIS LIST
  const totalDepartments = computed(() => {
      const departments = new Set(
        employeesCache.value.map(e => e.department)
      )

      return departments.size
  })

  //GET TERMINATION STATUS WITH DESCRIPTION

  const getTerminationStatus = (date: string | null) => {
      if (!date) return 'Unknown'

      const d = new Date(date)
      const now = new Date()

      if (d > now) return 'To be terminated'
      return 'Terminated'
  }

  //TOTAL HIRES IN A YEAR
  const totalYearHires = computed(() => {
      const year = new Date().getFullYear()
      return employeesCache.value.filter(e => {
            if (!e.dateOfEmployment) return false
            return new Date(e.dateOfEmployment).getFullYear() === year
      }).length
  })

  function getEmployeeByCode(code: string) {
    return employeesCache.value.find(emp => emp.code === code) || null
  }

  function getEmployees(
  first: number,
  rows: number,
  filters: any = null,
  sortField?: string,
  sortOrder?: number
) {
  return new Promise<{ data: Employee[]; totalRecords: number }>((resolve) => {
    setTimeout(() => {
      let data = [...employeeData]

      // FILTER FOR ALL COLUMNS
      if (filters?.global?.value) {
        const search = filters.global.value.toLowerCase()
        data = data.filter(e =>
          e.fullName.toLowerCase().includes(search) ||
          e.department.toLowerCase().includes(search) ||
          e.occupation.toLowerCase().includes(search)
        )
      }

      if (filters?.department?.value) {

        //console.log(filters?.department.value)
        data = data.filter(e =>
          e.department
            .toLowerCase()
            .includes(filters.department.value.toLowerCase())
        )
        console.log(data)
      }

      if (filters?.fullName?.value) {
        data = data.filter(e =>
          e.fullName
            .toLowerCase()
            .includes(filters.fullName.value.toLowerCase())
        )
      }

      if (filters?.occupation?.value) {
        data = data.filter(e =>
          e.occupation
            .toLowerCase()
            .includes(filters.occupation.value.toLowerCase())
        )
      }

      if (filters?.dateOfEmployment?.value) {
        const filter = filters.dateOfEmployment.value
       
        data = data.filter(e => {
          const iso = new Date(e.dateOfEmployment).toISOString().slice(0, 10)
        

          if (filter.length === 4) {
            return iso.startsWith(filter) 
          }

          if (filter.length === 7) {
            return iso.startsWith(filter) 
          }

          return iso === filter 
        })
      }

      if (filters?.terminationStatus?.value) {
        console.log(filters?.terminationStatus?.value);
        data = data.filter(e => {
          return getTerminationStatus(e.terminationDate) === filters.terminationStatus.value
        })
        console.log(data);
      }

      //SORT FOR ALL COLUMNS

      if (sortField) {
        data.sort((a: any, b: any) => {
          const v1 = a[sortField]
          const v2 = b[sortField]

          if (v1 == null) return 1
          if (v2 == null) return -1

          const result = v1 > v2 ? 1 : v1 < v2 ? -1 : 0
          return sortOrder === 1 ? result : -result
        })
      }

      // TO GET THE NEEDED PAGINATION PAGE BY PAGE
      const totalRecords = data.length
      const paged = data.slice(first, first + rows)

      resolve({
        data: paged,
        totalRecords
      })
    }, 300)
  })
}

  //SET SELECTED EMPLOYEE FOR EDIT OR DELETE SO THAT WE KNOW WHICH EMPLOYEE IS CHOSEN
  function setSelectedEmployee(employee: Employee | null) {
    selectedEmployee.value = employee
  }

  // CREATE NEW EMPLOYEE BASED ON THE INFO INSIDE PARAMS
  function createEmployee(employee: Employee) {
    employeesCache.value.push(employee)
  }

  // EDIT/UPDATE THE DATA FOR SELECTED EMPLOYEE
  function updateEmployee(employee: Employee) {
    const index = employeesCache.value.findIndex(
      e => e.code === employee.code
    )

    if (index !== -1) {
      employeesCache.value[index] = employee
    }
  }

  // DELETE THE SELECTED EMPLOYEE FROM THE LIST
  function deleteEmployee(code: string) {
    employeesCache.value = employeesCache.value.filter(
      e => e.code !== code
    )
  }

  // CACHE THE EMPLOYEES SO THAT WE HAVE ALWAYS THE CORRECT LIST
  function cacheEmployees(newEmployees: Employee[]) {
    newEmployees.forEach(emp => {
      const index = employeesCache.value.findIndex(
        e => e.code === emp.code
      )

      if (index !== -1) {
        employeesCache.value[index] = emp
      } else {
        employeesCache.value.push(emp)
      }
    })
  }

  return {
    employeesCache,
    selectedEmployee,
    getEmployeeByCode,
    setSelectedEmployee,
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    cacheEmployees,
    totalYearHires,
    totalDepartments,
    getTerminationStatus
  }
})