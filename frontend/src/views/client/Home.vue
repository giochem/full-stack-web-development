<template>
  <div class="container">
    <div class="wrapper">
      <div class="products">
        <h2>Danh sách sản phẩm nổi bật</h2>
        <ul>
          <p v-if="products.length === 0">
            Cửa hàng hiện đang không có sản phẩm.
          </p>
          <li v-for="product in products" class="item">
            <img src="http://localhost:5000/uploads/1.png" alt="ảnh" />
            <h4>{{ product.name }}</h4>
            <div class="price">
              <p>{{ product.price }} đ</p>
              <span>200k</span>
              <span>{{ product.oldPrice }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUpdated, ref } from "vue";
import axios from "axios";
const products = ref([]);
onMounted(async () => {
  console.log("axios");
  await axios
    .get("http://localhost:5000/api/products?page=0&size=10")
    .then((res) => {
      products.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>
<style scoped>
.wrapper {
  padding: 1em;
}
.products h2 {
  text-align: center;
  padding: 1em;
}
.products ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
}
.products ul li {
  padding: 1em;
  background-color: var(--light-bg-color);
}
.products ul li img {
  margin-bottom: 1em;
  transition: transform 0.25s ease;
}
.products ul li img:hover {
  transform: scale(1.05);
}
.products ul li h4 {
  text-align: center;
}
.products ul li .price {
  padding: 0 1em;
  display: flex;
  justify-content: space-between;
}
.products ul li .price span {
  color: var(--light-text-color);
  text-decoration: line-through;
}
</style>
