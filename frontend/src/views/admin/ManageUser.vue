<template>
  <div class="container">
    <div class="wrapper">
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." /><img
            width="30px"
            src="@/assets/logo.svg"
            alt=""
          />
        </div>
        <h3>Manager User</h3>
        <div class="functions">
          <button>
            <router-link to="/admin/add-user">Add New</router-link>
          </button>
          <select class="sort">
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="content">
          <table class="">
            <thead>
              <tr>
                <th>STT</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Cart</th>
                <th>Order</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users">
                <td>{{ index + 1 }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>Link</td>
                <th>Order</th>
                <td>
                  <p>
                    <router-link :to="`/admin/edit-user/${user.userID}`"
                      >Edit</router-link
                    >
                  </p>
                  <p @click.prevent="remove(user.userID)">Delete</p>
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
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const currentPage = ref(0);
const newPage = ref([1, 2, 3]);
const users = ref([]);

onMounted(async () => {
  // axios
  const options = {
    method: "GET",
    url: "http://localhost:5000/api/users?page=0&size=10",
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      users.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
});
async function changePage(newValue) {
  if (newValue < 0 || newValue === currentPage.value) {
    return;
  }
  currentPage.value = newValue;
  newPage.value = [newValue, newValue + 1, newValue + 2];

  // axios
  const options = {
    method: "GET",
    url: `http://localhost:5000/api/users?page=${newValue}&size=10`,
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      users.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function remove(value) {
  if (confirm("Bạn có chắc chắn muốn xóa không?") === false) {
    return;
  }

  // axios
  const options = {
    method: "DELETE",
    url: `http://localhost:5000/api/users/${value}`,
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      router.go();
    })
    .catch((err) => {
      console.log(err);
    });
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
