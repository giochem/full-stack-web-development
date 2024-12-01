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
        <h3>Edit User</h3>
        <form action="">
          <div>
            <label for="">Email</label
            ><input v-model="user.email" type="text" />
          </div>
          <div>
            <label for="">Username</label>
            <input v-model="user.username" type="text" />
          </div>
          <div>
            <label for="">Password</label>
            <input v-model="user.password" type="text" />
          </div>
          <div>
            <label for="">Role</label>
            <select v-model="user.role">
              <option value="client">client</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div class="functions">
            <button @click.prevent="save">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
const route = useRoute();
const user = ref({
  email: "",
  username: "",
  password: "",
  role: "",
});
onMounted(async () => {
  // axios
  const options = {
    method: "GET",
    url: `http://localhost:5000/api/users/${route.params.userID}`,
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      user.value = res.data.data[0];
    })
    .catch((err) => {
      console.log(err);
    });
});
async function save() {
  const { email, username, password, role } = user.value;
  // axios
  const options = {
    method: "PUT",
    url: `http://localhost:5000/api/users/${route.params.userID}`,
    withCredentials: true,
    data: {
      email,
      username,
      password,
      role,
    },
  };
  await axios
    .request(options)
    .then((res) => {
      window.location.href = "/admin/manage-user";
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
form {
  width: 550px;
  margin: 0 auto;
  padding: 2em;
  border: 1em solid var(--dark-color);
  border-radius: 10px;
  text-align: center;
}
form div {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
}

form .functions button {
  background-color: var(--secondary-color);
}
</style>
