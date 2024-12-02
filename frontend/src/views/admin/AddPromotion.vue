<template>
  <div class="container">
    <div class="wrapper">
      <div class="notify" ref="notify">Notify.</div>
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." />
          <img width="30px" src="@/assets/logo.svg" alt="" />
        </div>
        <h3>Add Promotion</h3>
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
            <input
              v-model="promotion.productIDs"
              type="text"
              placeholder="1,2,3"
            />
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

const promotion = ref({
  name: "",
  reduce: 0,
  startTime: "",
  endTime: "",
  productIDs: "",
});

async function save() {
  const { name, reduce, startTime, endTime, productIDs } = promotion.value;
  const productIDArray = productIDs.split(",").map((id) => parseInt(id.trim()));

  const options = {
    method: "POST",
    url: `http://localhost:5000/api/promotions`,
    withCredentials: true,
    data: {
      name,
      reduce: parseInt(reduce),
      startTime: startTime.replace("T", " "),
      endTime: endTime.replace("T", " "),
      productIDs: productIDArray,
    },
  };

  try {
    await axios.request(options);
    window.location.href = "/admin/manage-promotion";
  } catch (err) {
    notify.value.innerText = err.response.data.error;
    notify.value.style.display = "block";
    setTimeout(() => {
      notify.value.style.display = "none";
    }, 3000);
  }
}
</script>

<style scoped>
.notify {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  background: #fde073;
  text-align: center;
  line-height: 2.5;
  overflow: hidden;
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
