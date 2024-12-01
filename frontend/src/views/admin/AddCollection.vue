<template>
  <div class="container">
    <div class="wrapper">
      <div class="notify" ref="notify">Notify.</div>
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." /><img
            width="30px"
            src="@/assets/logo.svg"
            alt=""
          />
        </div>
        <h3>Add Collection</h3>
        <form action="">
          <div>
            <label for="">Name</label
            ><input v-model="collection.name" type="text" />
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
import { ref, useTemplateRef } from "vue";
import axios from "axios";
const notify = useTemplateRef("notify");

const collection = ref({
  name: "",
});
async function save() {
  const { name } = collection.value;
  // axios
  const options = {
    method: "POST",
    url: `http://localhost:5000/api/collections`,
    withCredentials: true,
    data: {
      name,
    },
  };
  await axios
    .request(options)
    .then((res) => {
      window.location.href = "/admin/manage-collection";
    })
    .catch((err) => {
      notify.value.innerText = err.response.data.error;
      notify.value.style.display = "block";
      setTimeout(() => {
        notify.value.style.display = "none";
      }, 3000);
    });
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
