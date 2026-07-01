

/**
 * @returns {Promise<any[]>}
 */



import employees from "../data/purple_cross_employees.json"

export default function getEmployees(params) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(employees)
        }, 500);
    })
}