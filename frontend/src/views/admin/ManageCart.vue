<template>
  <div class="container">
    <div class="wrapper">
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." />
          <img width="30px" src="@/assets/logo.svg" alt="" />
        </div>
        <h3>Manage Carts</h3>
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>User ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cart, index) in carts" :key="cart.cartID">
                <td>{{ index + 1 }}</td>
                <td>{{ cart.userID }}</td>
                <td>{{ cart.productID }}</td>
                <td>{{ cart.quantity }}</td>
                <td>
                  <p @click="remove(cart.cartID)">Delete</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <ul>
              <li @click.prevent="changePage(newPage[0] - 1)"><~~</li>
              <li @click.prevent="changePage(newPage[0])">{{ newPage[0] }}</li>
              <li @click.prevent="changePage(newPage[1])">{{ newPage[1] }}</li>
              <li @click.prevent="changePage(newPage[2])">{{ newPage[2] }}</li>
              <li @click.prevent="changePage(newPage[2] + 1)">~~></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const currentPage = ref(0);
const newPage = ref([1, 2, 3]);
const carts = ref([]);

onMounted(async () => {
  const options = {
    method: "GET",
    url: "http://localhost:5000/api/carts?page=0&size=10",
    withCredentials: true,
  };

  try {
    const res = await axios.request(options);
    carts.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
});

async function changePage(newValue) {
  if (newValue < 0 || newValue === currentPage.value) {
    return;
  }
  currentPage.value = newValue;
  newPage.value = [newValue, newValue + 1, newValue + 2];

  const options = {
    method: "GET",
    url: `http://localhost:5000/api/carts?page=${newValue}&size=10`,
    withCredentials: true,
  };

  try {
    const res = await axios.request(options);
    carts.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function remove(cartID) {
  if (!confirm("Are you sure you want to delete this cart item?")) return;

  const options = {
    method: "DELETE",
    url: `http://localhost:5000/api/carts/${cartID}`,
    withCredentials: true,
  };

  try {
    await axios.request(options);
    router.go();
  } catch (err) {
    console.log(err);
  }
}
</script>

<style scoped>
.wrapper {
  margin-left: 20em;
  padding: 1em;
  height: 100vh;
  background-color: var(--light-bg-color);
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}
.dashboard .functions {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background-color: var(--light-bg-color);
}
.dashboard .functions button {
  background-color: var(--secondary-color);
  border-radius: 8px;
  color: var(--white-color);
}
.dashboard table {
  border-collapse: collapse;
  width: 100%;
}
.dashboard .content .pagination ul {
  display: flex;
  justify-content: space-evenly;
  padding: 2em 15em;
  margin: 0 5em;
}
.dashboard .content .pagination ul li {
  cursor: pointer;
  border: 1px solid var(--primary-color);
  padding: 6px;
  border-radius: 10px;
}
th,
td {
  padding: 0.25rem;
  text-align: left;
  border: 1px solid #ccc;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody td:last-child {
  display: flex;
  justify-content: space-evenly;
}
tbody td p {
  cursor: pointer;
}
</style>
