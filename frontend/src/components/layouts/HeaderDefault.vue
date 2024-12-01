<template>
  <header>
    <div class="container">
      <div class="wrapper">
        <div class="header">
          <nav>
            <div><RouterLink to="/">Home</RouterLink></div>
            <div><RouterLink to="/">.369</RouterLink></div>
            <div>
              <ul>
                <li><RouterLink to="/cart">Cart</RouterLink></li>
                <li>
                  <RouterLink :to="statusAuth">{{ statusAuth }}</RouterLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { ref, computed } from "vue";
const statusAuth = ref("register");
</script>
<style scoped>
.wrapper{
  padding: 1em;
}
.header nav {
  display: flex;
  justify-content: space-between;
}
.header nav ul {
  display: flex;
  gap: 1em;
}
</style>
