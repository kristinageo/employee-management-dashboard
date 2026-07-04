<script setup lang="ts">
import { ref } from 'vue';

const isLoggedIn = ref(false)
function toggleLogin(){
  isLoggedIn.value = true;
}

</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/" active-class="active-link">Dashboard</RouterLink>
      <RouterLink to="/employees" active-class="active-link">Employees</RouterLink>
    </div>
    <div class="nav-right">
      <Button label="Sign in" icon="pi pi-sign-in" v-if="!isLoggedIn" @click="toggleLogin()"></Button>
      <span v-else class="login-badge">
        <i class="pi pi-user"></i>
        Logged in
        <Button
          icon="pi pi-sign-out"
          text
          rounded
          @click="toggleLogin"
        />
      </span>
    </div>
  
  </nav>

  <RouterView/>

  
</template>

<style scoped>
.active-link{
   background: lightseagreen;
   color: white;
   border-radius: 4px;
}

a{
  text-decoration: none;
  color: black;
  padding: 5px;
}
.navbar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid lightgray;
  padding-bottom: 5px;
}
.nav-left{
  display: flex;
}

.nav-left span{
  margin: 5px;
  cursor: pointer;
}
.nav-right{
  display: flex;
  align-items: center;
}
</style>
