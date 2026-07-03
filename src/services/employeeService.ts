import employeesJson from '@/data/purple_cross_employees.json'
import type { Employee } from '@/types/Employee'


const allEmployees: Employee[] = employeesJson as Employee[];

export  function getEmployees(first: number, rows: number): Promise<{
    data: Employee[],
    totalRecords: number}>
    {
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve({
                    data: allEmployees.slice(first, first + rows),
                    totalRecords: allEmployees.length
                  });
              }, 500);
          });
}

export default allEmployees;