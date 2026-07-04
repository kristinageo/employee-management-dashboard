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

  function getEmployees(first: number, rows: number) {
    return new Promise<{ data: Employee[], totalRecords: number }>((resolve) => {
      setTimeout(() => {
        const start = first
        const end = first + rows

        resolve({
          data: employeeData.slice(start, end),
          totalRecords: employeeData.length
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
    createEmployee,
    updateEmployee,
    deleteEmployee,
    cacheEmployees
  }
})