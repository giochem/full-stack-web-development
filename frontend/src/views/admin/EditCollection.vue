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
        <h3>Edit Collection</h3>
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
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
const route = useRoute();
const collection = ref({
  name: "",
});
onMounted(async () => {
  // axios
  const options = {
    method: "GET",
    url: `http://localhost:5000/api/collections/${route.params.collectionID}`,
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      collection.value = res.data.data[0];
    })
    .catch((err) => {
      console.log(err);
    });
});
async function save() {
  const { name } = collection.value;
  // axios
  const options = {
    method: "PUT",
    url: `http://localhost:5000/api/collections/${route.params.collectionID}`,
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
