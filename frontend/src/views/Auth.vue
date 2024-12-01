<template>
  <div class="container">
    <div class="wrapper">
      <div class="notify" ref="notify">Notify.</div>
      <h1>Trang web quần áo thời trang 369</h1>
      <div class="content">
        <img src="@/assets/images/products/apparel1.jpg" alt="" />
        <form action="">
          <h3>{{ status }}</h3>

          <label for="email">Email</label
          ><input v-model="form.email" name="email" type="email" />
          <br />
          <label for="password">Mật khẩu</label>
          <input v-model="form.password" name="password" type="password" />
          <br />
          <div v-show="status === 'register'">
            <label for="password2">Nhập lại Mật khẩu</label
            ><input v-model="form.password2" name="password2" type="password" />
          </div>
          <br />
          <div class="" v-if="status === 'login'">
            <button @click.prevent="login">Đăng nhập</button
            ><button @click.prevent="toggleStatus">Đăng ký</button>
            <button @click.prevent="forgotPassword">Quên mật khẩu</button>
          </div>

          <div v-else>
            <button @click.prevent="register">Đăng ký</button
            ><button @click.prevent="toggleStatus">Đăng nhập</button>
            <button @click.prevent="forgotPassword">Quên mật khẩu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, useTemplateRef } from "vue";
import axios from "axios";
const status = ref("login");
const notify = useTemplateRef("notify");

const form = ref({
  email: "",
  password: "",
  password2: "",
});

onMounted(() => {
  const token = window.sessionStorage.getItem("token");
  if (token) {
    console.log("not have token");
  }
});

async function login() {
  const { email, password } = form.value;

  // axios
  const options = {
    method: "POST",
    url: "http://localhost:5000/api/auth/login",
    data: { email, password },
    credentials: "include",
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      if (res.data.data[0].role === "admin") {
        window.location.href = "admin";
      } else {
        window.location.href = "/";
      }
    })
    .catch((err) => {
      const data = err.response?.data;
      if (data) {
        notify.value.innerText = data.error || data.errors;
        notify.value.style.display = "block";
        setTimeout(() => {
          notify.value.style.display = "none";
        }, 3000);
      } else {
        console.log(err);
      }
    });
}
async function register() {
  const { email, password, password2 } = form.value;
  if (email || password || password2) {
    notify.value.innerText = "Vui lòng nhập đủ thông tin";
    notify.value.style.display = "block";
    setTimeout(() => {
      notify.value.style.display = "none";
    }, 3000);
    return;
  }
  if (password !== password2) {
    notify.value.innerText = "Mật khẩu nhập lại không trùng mật khẩu ban đầu";
    notify.value.style.display = "block";
    setTimeout(() => {
      notify.value.style.display = "none";
    }, 3000);
    return;
  }

  const options = {
    method: "POST",
    url: "http://localhost:5000/api/auth/register",
    data: { email, password },
    credentials: "include",
    withCredentials: true,
  };
  // axios
  await axios
    .request(options)
    .then((res) => {
      if (res.data.data[0].role === "admin") {
        window.location.href = "admin";
      } else {
        window.location.href = "/";
      }
    })
    .catch((err) => {
      const data = err.response.data;
      if (data) {
        notify.value.innerText = data.error || data.errors;
        notify.value.style.display = "block";
        setTimeout(() => {
          notify.value.style.display = "none";
        }, 3000);
      } else {
        console.log(err);
      }
    });
}
async function forgotPassword() {
  const options = {
    method: "GET",
    url: "http://localhost:5000/api/auth/check",
    withCredentials: true,
  };
  // axios
  await axios
    .request(options)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function toggleStatus() {
  status.value = status.value === "login" ? "register" : "login";
}
</script>
<style scoped>
/* notify */
.notify {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  background: #fde073;
  text-align: center;
  line-height: 2.5;
  overflow: hclassden;
  -webkit-box-shadow: 0 0 5px black;
  -moz-box-shadow: 0 0 5px black;
  box-shadow: 0 0 5px black;
  display: none;
}
.wrapper {
  padding: 1em;
}
.wrapper h1 {
  text-align: center;
  padding: 0 0 1em 0;
}
.content {
  display: grid;
  grid-template-columns: 40% 60%;
}
.content img {
  border-radius: 10px;
}
form {
  width: 550px;
  margin: 0 auto;
  padding: 2em;
  border: 1em solid var(--dark-color);
  border-radius: 10px;
  text-align: center;
}
form h3 {
  text-align: center;
  text-transform: uppercase;
  padding: 0.5em;
}
form label {
  float: left;
}
form input {
  float: right;
}
form button {
  width: 200px;
  padding: 1em;
  margin: 1em;
  text-align: center;
  justify-content: center;
}
form button:hover {
  background-color: var(--primary-color);
}
</style>
