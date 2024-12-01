<template>
  <div class="container">
    <div class="wrapper">
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." />
          <img width="30px" src="@/assets/logo.svg" alt="" />
        </div>
        <h3>Edit Promotion</h3>
        <form action="">
          <div>
            <label for="">Name</label>
            <input v-model="promotion.name" type="text" />
          </div>
          <div>
            <label for="">Reduce (%)</label>
            <input v-model="promotion.reduce" type="number" min="0" max="100" />
          </div>
          <div>
            <label for="">Start Time</label>
            <input v-model="promotion.startTime" type="datetime-local" />
          </div>
          <div>
            <label for="">End Time</label>
            <input v-model="promotion.endTime" type="datetime-local" />
          </div>
          <div>
            <label for="">Product IDs</label>
            <input v-model="promotion.productIDs" type="text" />
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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();

const promotion = ref({
  name: "",
  reduce: 0,
  startTime: "",
  endTime: "",
  productIDs: "",
});

onMounted(async () => {
  const options = {
    method: "GET",
    url: `http://localhost:5000/api/promotions/${route.params.promotionID}`,
    withCredentials: true,
  };

  try {
    const res = await axios.request(options);
    const data = res.data.data[0];
    promotion.value = {
      ...data,
      productIDs: data.productIDs,
      startTime: new Date(data.startTime)
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
      endTime: new Date(data.endTime)
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
    };
  } catch (err) {
    console.log(err);
  }
});

async function save() {
  const { name, reduce, startTime, endTime, productIDs } = promotion.value;
  const productIDArray = productIDs.split(",").map((id) => parseInt(id.trim()));

  const options = {
    method: "PUT",
    url: `http://localhost:5000/api/promotions/${route.params.promotionID}`,
    withCredentials: true,
    data: {
      name,
      reduce: parseInt(reduce),
      startTime,
      endTime,
      productIDs: productIDArray,
    },
  };

  try {
    await axios.request(options);
    window.location.href = "/admin/manage-promotion";
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
