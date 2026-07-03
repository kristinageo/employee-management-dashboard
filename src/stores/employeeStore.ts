import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types/Employee'
import employeeData from '@/data/purple_cross_employees.json';

export const useEmployeeStore = defineStore('employee', () => {
  const employeesCache = ref<Employee[]>(employeeData as Employee[])
  const selectedEmployee = ref<Employee | null>(null)

  function setSelectedEmployee(employee: Employee) {
    selectedEmployee.value = employee
  }

  // Save an array of employees to our global cache (preventing duplicates)
  function cacheEmployees(newEmployees: Employee[]) {
    newEmployees.forEach(emp => {
      const index = employeesCache.value.findIndex(cached => cached.code === emp.code)
      if (index !== -1) {
        // If employee exists, replace it with the fresh data from the table
        employeesCache.value[index] = emp
      } else {
        // If it's a completely new employee, add it to the list
        employeesCache.value.push(emp)
      }
    })
  }
  function getEmployeeByCode(code: string): Employee | null {
    console.log(employeesCache);
    return employeesCache.value.find(emp => emp.code === code) || null
  }

  return {
    employeesCache,
    selectedEmployee,
    setSelectedEmployee,
    cacheEmployees,
    getEmployeeByCode
  }
})
