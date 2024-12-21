<template>
  <div class="search-page">
    <div class="search-container">
      <input
        v-model="searchText"
        type="text"
        placeholder="Search..."
        @input="debouncedSearch"
      />
      <button @click="search">Search</button>
    </div>
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="results.length === 0" class="no-results">
      <p>No results found.</p>
    </div>
    <div v-else class="results-list">
      <div
        v-for="result in results"
        :key="result.productID"
        class="result-item"
        :class="getPromotionClass(result)"
        @click="selectResult(result)"
      >
        <div class="result-left">
          <h3>{{ result.name }}</h3>
          <p>{{ result.description }}</p>
          <p><strong>Category:</strong> {{ result.categoryName }}</p>
        </div>
        <div class="result-right">
          <p v-if="result.promotionName">
            <strong>Promotion:</strong> {{ result.promotionName }} ({{
              result.discount
            }}% off)
          </p>
          <p v-if="result.startDate && result.endDate">
            <strong>Sale Period:</strong> {{ formatDate(result.startDate) }} -
            {{ formatDate(result.endDate) }}
          </p>
          <p><strong>Stock:</strong> {{ result.totalQuantityInStock }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";
import { parseISO, isAfter, isBefore } from "date-fns";

const searchText = ref("");
const results = ref([]);
const loading = ref(false);

const debouncedSearch = debounce(async () => {
  console.log("Searching for:", searchText.value);
  await search();
}, 200);

async function search() {
  loading.value = true;
  const db = await openIndexedDB();

  const transaction = db.transaction("queries", "readonly");
  const store = transaction.objectStore("queries");
  const cachedResults = await new Promise((resolve, reject) => {
    const request = store.get(searchText.value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (cachedResults) {
    results.value = cachedResults.data;
  } else {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.PRODUCTS.LIST.url(0, 12, { searchText: searchText.value })
      );
      const data = response.data.data.map((product) => ({
        productID: product.productID,
        name: product.name,
        description: product.description,
        categoryName: product.categoryName,
        promotionName: product.promotionName,
        discount: product.discount,
        startDate: product.startDate,
        endDate: product.endDate,
        totalQuantityInStock: product.totalQuantityInStock
      }));
      results.value = data;

      const transaction = db.transaction("queries", "readwrite");
      const store = transaction.objectStore("queries");
      await new Promise((resolve, reject) => {
        const request = store.put(
          { data, timestamp: Date.now() },
          searchText.value
        );
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  loading.value = false;
  await cleanUpOldData(db);
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("searchCache", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("queries");
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    const context = this;
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function selectResult(result) {
  console.log("Selected result:", result, results.value);
  searchText.value = result.name;
  results.value = [result];
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function getPromotionClass(result) {
  if (!result.startDate || !result.endDate) return "";
  const now = new Date();
  const startDate = parseISO(result.startDate);
  const endDate = parseISO(result.endDate);

  if (isBefore(now, startDate)) return "upcoming";
  if (isAfter(now, endDate)) return "expired";
  return "active";
}

async function cleanUpOldData(db) {
  const transaction = db.transaction("queries", "readwrite");
  const store = transaction.objectStore("queries");
  const now = Date.now();
  const oneHour = 30 * 1000;

  const keys = await new Promise((resolve, reject) => {
    const request = store.getAllKeys();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  for (const key of keys) {
    const entry = await new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (now - entry.timestamp > oneHour) {
      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
}
</script>

<style scoped>
.search-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f4f8;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 800px;
}

.search-container input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
  background-color: #fff;
  transition: border-color 0.3s;
}

.search-container input:focus {
  border-color: var(--primary-color);
}

.search-container button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-container button:hover {
  background-color: var(--primary-dark-color);
}

.loading,
.no-results {
  text-align: center;
  color: var(--light-text-color);
}

.results-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-item {
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.result-item:hover {
  background-color: #e0f7fa;
  transform: translateY(-2px);
}

.result-item h3 {
  font-size: 1.2rem;
  color: var(--secondary-dark-color);
}

.result-item p {
  font-size: 0.9rem;
  color: #666;
}

.result-item strong {
  color: var(--primary-color);
}

.result-left,
.result-right {
  flex: 1;
}

.result-right {
  text-align: right;
}

.active {
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
  background-color: #e8f5e9;
}

.upcoming {
  border-left: 4px solid #f59e0b; /* Amber color for upcoming */
  padding-left: 1rem;
  background-color: #fff3e0;
}

.expired {
  border-left: 4px solid var(--light-text-color); /* Grey for expired */
  padding-left: 1rem;
  background-color: #f5f5f5;
}
</style>
