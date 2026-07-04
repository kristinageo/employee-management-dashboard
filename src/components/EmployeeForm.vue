<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore'
import type { Employee } from '@/types/Employee'

const route = useRoute()
const router = useRouter()
const store = useEmployeeStore()
//CHECK IF IT IS EDIT OR CREATE FORM WITH BOOLEAN
const isEdit = computed(() => !!route.params.code)


//FORM FOR ALL FIELDS
const form = ref<Employee>({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: null
})

watchEffect(() => {
  if (isEdit.value) {
    const found = store.getEmployeeByCode(route.params.code as string)

    if (found) {
      form.value = { ...found }
    }
  }
})

//ERROR MSG FOR ALL FIELDS
const errors = ref({
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: ''
})

//VALIDATION NEEDED
function validate() {
  errors.value = {
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: ''
  }

  let valid = true

  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
    valid = false
  }

  if (!form.value.occupation.trim()) {
    errors.value.occupation = 'Occupation is required'
    valid = false
  }

  if (!form.value.department.trim()) {
    errors.value.department = 'Department is required'
    valid = false
  }

  if (!form.value.dateOfEmployment) {
    errors.value.dateOfEmployment = 'Date of employment is required'
    valid = false
  }
  
  //TERMINATION IS NOT REQUIRED BECAUSE I THOUGHT IF THERE IS NULL VALUES WE CAN ENTER EMPTY VALUES HERE

  return valid
}

//form to save the employee first validate and then if edit is true update if not create it.
function saveEmployee() {
  if (!validate()) return

  if (isEdit.value) {
    store.updateEmployee(form.value)
  } else {
    store.createEmployee(form.value)
  }

  router.push({ name: 'employees' })
}

function cancel() {
  router.push({ name: 'employees' })
}

</script>

<template>
  <div class="form-container">
    <h2>
      {{ isEdit ? 'Edit Employee' : 'Create Employee' }}
    </h2>

    <div class="field">
      <label>Full Name</label>
      <InputText v-model="form.fullName" />
      <small class="error">{{ errors.fullName }}</small>
    </div>

    <div class="field">
      <label>Occupation</label>
      <InputText v-model="form.occupation" />
      <small class="error">{{ errors.occupation }}</small>
    </div>

    <div class="field">
      <label>Department</label>
      <InputText v-model="form.department" />
      <small class="error">{{ errors.department }}</small>
    </div>

    <div class="field">
      <label>Date of Employment</label>
      <input type="date" v-model="form.dateOfEmployment" />
      <small class="error">{{ errors.dateOfEmployment }}</small>
    </div>

    <div class="field">
      <label>Termination Date</label>
      <input type="date" v-model="form.dateOfEmployment" />
    </div>

    <div class="actions">
      <Button
        :label="isEdit ? 'Update' : 'Create'"
        @click="saveEmployee"
      />

      <Button
        label="Cancel"
        severity="secondary"
        @click="cancel"
      />
    </div>
  </div>
</template>

<style>
.field {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 2px;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* MOBILE VIEW*/
@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions .p-button {
    width: 100%;
  }
}
</style>