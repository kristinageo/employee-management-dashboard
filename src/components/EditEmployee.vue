<script setup lang="ts">
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const employeeStore = useEmployeeStore()
const { selectedEmployee } = storeToRefs(employeeStore)

// const employee = computed(() => {
//     if (selectedEmployee.value) {
//         return selectedEmployee.value;
//     }

//     const urlCode = route.params.code as string;
//     const found = employeeStore.getEmployeeByCode(urlCode);
//     console.log(urlCode);
    
//     if (found) {
//         employeeStore.setSelectedEmployee(found);
//         return found;
//     }

//     return null;
// });

</script>
<template>
    <div v-if="employee">
        <p> <strong>{{ employee.code }}</strong></p>
        <h2>{{employee.fullName}}</h2>
        <p>{{ employee.department }}</p>
        <p>{{ employee.dateOfEmployment }}</p>
        <p>{{ employee.terminationDate ?? 'Unknown'}}</p>
    </div>
    <div v-else>
         You can't update this employee.
    </div>


</template>