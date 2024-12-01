<template>
  <div class="container">
    <div class="wrapper">
      <div class="navbar">
        <ul>
          <li><router-link to="/admin">dashboard</router-link></li>
          <li>
            <router-link to="/admin/manage-user">manage users</router-link>
          </li>
          <li>
            <router-link to="/admin/manage-product"
              >manage products</router-link
            >
          </li>
          <li>
            <router-link to="/admin/manage-collection"
              >manage collections</router-link
            >
          </li>
          <li>
            <router-link to="/admin/manage-promotion"
              >manage promotions</router-link
            >
          </li>
          <li>
            <router-link to="/admin/manage-cart">manage carts</router-link>
          </li>
          <li>
            <router-link to="/admin/manage-order">manage orders</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  padding: 3em;
  font-weight: 650;
  text-transform: capitalize;
  background-color: var(--light-bg-color);
}
.navbar ul li {
  margin-bottom: 2em;
}
</style>
