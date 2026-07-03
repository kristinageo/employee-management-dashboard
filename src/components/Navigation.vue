<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
      <RouterLink to="/" active-class="active-link">Dashboard</RouterLink>
      <RouterLink to="/employees" active-class="active-link">Employees</RouterLink>
  </nav>
  <Button label="Sign in" icon="pi pi-people"></Button>
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
  align-items: center;
  border-bottom: 2px solid lightgray;
  padding-bottom: 5px;
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
