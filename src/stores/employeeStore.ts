import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types/Employee'
import employeeData from '@/data/purple_cross_employees.json'

export const useEmployeeStore = defineStore('employee', () => {
  // ---------------- STATE ----------------
  const employeesCache = ref<Employee[]>(employeeData as Employee[])
  const selectedEmployee = ref<Employee | null>(null)

  // ---------------- GETTER ----------------
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

      // ---------------- FILTER ----------------
      if (filters?.global?.value) {
        const search = filters.global.value.toLowerCase()
        data = data.filter(e =>
          e.fullName.toLowerCase().includes(search) ||
          e.department.toLowerCase().includes(search) ||
          e.occupation.toLowerCase().includes(search)
        )
      }

      if (filters?.department?.value) {

        console.log(filters?.department.value)
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
            return iso.startsWith(filter) // year
          }

          if (filter.length === 7) {
            return iso.startsWith(filter) // year-month
          }

          return iso === filter // full date
        })
      }

      // ---------------- SORT ----------------
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

      // ---------------- PAGINATION ----------------
      const totalRecords = data.length
      const paged = data.slice(first, first + rows)

      resolve({
        data: paged,
        totalRecords
      })
    }, 300)
  })
}

  // ---------------- SELECT ----------------
  function setSelectedEmployee(employee: Employee | null) {
    selectedEmployee.value = employee
  }

  // ---------------- CREATE ----------------
  function createEmployee(employee: Employee) {
    employeesCache.value.push(employee)
  }

  // ---------------- UPDATE ----------------
  function updateEmployee(employee: Employee) {
    const index = employeesCache.value.findIndex(
      e => e.code === employee.code
    )

    if (index !== -1) {
      employeesCache.value[index] = employee
    }
  }

  // ---------------- DELETE ----------------
  function deleteEmployee(code: string) {
    employeesCache.value = employeesCache.value.filter(
      e => e.code !== code
    )
  }

  // ---------------- MERGE / CACHE API DATA ----------------
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
    cacheEmployees
  }
})