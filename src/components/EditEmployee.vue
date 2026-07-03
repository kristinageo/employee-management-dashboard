<script setup lang="ts">
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const { selectedEmployee } = storeToRefs(employeeStore)

const employee = computed(() => {
    if (selectedEmployee.value) {
        return selectedEmployee.value;
    }

    const urlCode = route.params.code as string;
    const found = employeeStore.getEmployeeByCode(urlCode);
    console.log(urlCode);
    
    if (found) {
        employeeStore.setSelectedEmployee(found);
        return found;
    }

    return null;
});


const form = ref({
   code: '',
   fullName: '',
   department: '',
   occupation: '',
   dateOfEmployment: '',
   terminationDate: ''
})

watchEffect(() => {
    if(employee.value)
    {
        form.value = { ...employee.value,
            dateOfEmployment: employee.value.dateOfEmployment || '',
            terminationDate: employee.value.terminationDate || ''
         }
    }
})

function saveEmployee(){
    if(employee.value)
    {
       employeeStore.cacheEmployees([form.value])
       router.push({name: 'employees'})
    }
}
</script>
<template>
    <div v-if="employee" class="edit-container">
        <h2>Edit Profile: {{ employee.fullName }}</h2>
        
        <div class="field">
            <label for="name">Full Name</label>
            <InputText id="name" v-model="form.fullName" fluid />
        </div>

        <div class="field">
            <label for="occupation">Occupation</label>
            <InputText id="occupation" v-model="form.occupation" fluid />
        </div>

        <div class="field">
            <label for="department">Department</label>
            <InputText id="department" v-model="form.department" fluid />
        </div>
        <div class="field">
            <label for="dateOfEmployment">Date of Employment</label>
            <InputText id="dateOfEmployment" v-model="form.dateOfEmployment" fluid />
        </div>
        <div class="field">
            <label for="terminationDate">Termination Date</label>
            <InputText id="terminationDate" v-model="form.terminationDate" fluid />
        </div>
        <div class="action-container">
            <Button label="Save" @click="saveEmployee()"></Button>
            <Button label="Cancel" @click="router.back()"></Button>
        </div>
  
    </div>
    <div v-else>
         You can't update this employee.
    </div>


</template>
<style>
.edit-container{
    max-height: 400px;
    padding: 20px;
}
.field{
    margin-bottom: 10px;
}
.field label{
    display: block;
}
.action-container{
    display: flex;
    justify-content: flex-end;
    gap:10px;
    margin-top: 20px
}
</style>