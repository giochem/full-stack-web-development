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
        <h3>Edit Product</h3>
        <form action="">
          <div>
            <label for="">Name</label
            ><input v-model="product.name" type="text" />
          </div>
          <div>
            <label for="">Description</label>
            <input v-model="product.description" type="text" />
          </div>
          <div>
            <label for="">Color</label>
            <input v-model="product.color" type="text" />
          </div>
          <div>
            <label for="">Size</label>
            <input v-model="product.size" type="text" />
          </div>
          <div>
            <label for="">Price</label>
            <input v-model="product.price" type="text" />
          </div>
          <div>
            <label for="">Quantity</label>
            <input v-model="product.quantity" type="text" />
          </div>
          <div>
            <label for="">Image</label>
            <input v-on:change="uploadImage" type="file" />
          </div>
          <div>
            <img
              ref="previewImage"
              :src="`http://localhost:5000/uploads/${product.linkImage}`"
              alt=""
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
import { onMounted, ref, useTemplateRef } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
const route = useRoute();
const previewImage = useTemplateRef("previewImage");
const newImage = ref(null);
const product = ref({
  name: "",
  description: "",
  color: "",
  size: "",
  price: "",
  quantity: "",
  linkImage: "",
});
onMounted(async () => {
  // axios
  const options = {
    method: "GET",
    url: `http://localhost:5000/api/products/${route.params.productID}`,
    withCredentials: true,
  };
  await axios
    .request(options)
    .then((res) => {
      product.value = res.data.data[0];
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
function uploadImage(e) {
  newImage.value = e.target.files[0];
  previewImage.value.src = URL.createObjectURL(e.target.files[0]);
}
async function save() {
  const { name, description, color, size, price, quantity, linkImage } =
    product.value;
  var formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("color", color);
  formData.append("size", size);
  formData.append("price", price);
  formData.append("quantity", quantity);
  formData.append("file", newImage.value);

  // axios
  const options = {
    method: "PUT",
    url: `http://localhost:5000/api/products/${route.params.productID}`,
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  };
  await axios
    .request(options)
    .then((res) => {
      window.location.href = "/admin/manage-product";
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
