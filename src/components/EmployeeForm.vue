<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore'
import type { Employee } from '@/types/Employee'

const route = useRoute()
const router = useRouter()
const store = useEmployeeStore()

const isEdit = computed(() => !!route.params.code)

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

const errors = ref({
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: ''
})

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

  return valid
}

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
      <InputText v-model="form.dateOfEmployment" />
      <small class="error">{{ errors.dateOfEmployment }}</small>
    </div>

    <div class="field">
      <label>Termination Date</label>
      <InputText v-model="form.terminationDate" />
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
}
.error {
  color: red;
  font-size: 12px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>