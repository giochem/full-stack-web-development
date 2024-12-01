<template>
  <div class="container">
    <div class="wrapper">
      <div class="dashboard">
        <div class="header">
          <input type="text" placeholder="Search..." />
          <img width="30px" src="@/assets/logo.svg" alt="" />
        </div>
        <h3>Manage Promotions</h3>
        <div class="functions">
          <button>
            <router-link to="/admin/add-promotion">Add New</router-link>
          </button>
        </div>
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Reduce (%)</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(promotion, index) in promotions"
                :key="promotion.promotionID"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ promotion.name }}</td>
                <td>{{ promotion.reduce }}</td>
                <td>{{ new Date(promotion.startTime).toLocaleString() }}</td>
                <td>{{ new Date(promotion.endTime).toLocaleString() }}</td>
                <td>
                  <p>
                    <router-link
                      :to="`/admin/edit-promotion/${promotion.promotionID}`"
                      >Edit</router-link
                    >
                  </p>
                  <p @click="remove(promotion.promotionID)">Delete</p>
                </td>
              </tr>
            </tbody>
          </table>
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
const promotions = ref([]);

onMounted(async () => {
  const options = {
    method: "GET",
    url: "http://localhost:5000/api/promotions?page=0&size=10",
    withCredentials: true,
  };

  try {
    const res = await axios.request(options);
    promotions.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
});

async function remove(promotionID) {
  if (!confirm("Are you sure you want to delete this promotion?")) return;

  const options = {
    method: "DELETE",
    url: `http://localhost:5000/api/promotions/${promotionID}`,
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
