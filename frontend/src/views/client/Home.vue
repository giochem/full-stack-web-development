<template>
  <div class="home">
    <div class="container">
      <section class="products-section">
        <h2>Sản phẩm nổi bật</h2>
        
        <div v-if="products.length === 0" class="no-products">
          <p>Cửa hàng hiện đang không có sản phẩm.</p>
        </div>
        
        <div v-else class="products-grid">
          <div 
            v-for="product in products" 
            :key="product.productID"
            class="product-card"
            @click="navigateTo(`/product/${product.productID}`)"
          >
            <div class="product-image">
              <img src="http://localhost:5000/uploads/1.png" alt="Product Image" />
            </div>
            
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <div class="product-price">
                <span class="current-price">{{ product.price }} đ</span>
                <span class="old-price">{{ product.oldPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products?page=0&size=10");
    products.value = response.data.data;
  } catch (err) {
    console.log(err);
  }
});

function navigateTo(path) {
  router.push(path);
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.products-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-dark-color);
}

.no-products {
  text-align: center;
  padding: 2rem;
  color: var(--light-text-color);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  padding-top: 100%;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-price {
  font-weight: bold;
  color: var(--primary-color);
}

.old-price {
  color: var(--light-text-color);
  text-decoration: line-through;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
