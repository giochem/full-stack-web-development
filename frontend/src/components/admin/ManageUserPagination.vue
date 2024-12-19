<template>
  <div class="pagination">
    <div class="pagination-controls">
      <button
        class="page-btn prev-btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 0 || loading"
      >
        <i class="ri-arrow-left-s-line"></i>
        Previous
      </button>
      <span class="page-info">Page {{ currentPage + 1 }}</span>
      <button
        class="page-btn next-btn"
        @click="changePage(currentPage + 1)"
        :disabled="!hasNextPage || loading"
      >
        Next
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
    <div class="page-size-selector">
      <label>Show:</label>
      <select
        :value="itemsPerPage"
        @change="$emit('update:itemsPerPage', $event.target.value)"
        :disabled="loading"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      <span>entries</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  itemsPerPage: Number,
  hasNextPage: Boolean,
  loading: Boolean
});

const emit = defineEmits(["changePage", "update:itemsPerPage"]);

function changePage(newPage) {
  emit("changePage", newPage);
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--light-text-color);
  font-size: 0.875rem;
}

.page-size-selector select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
}

.page-size-selector select:hover:not(:disabled) {
  border-color: var(--primary-color);
}

.page-size-selector select:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  background: var(--light-bg-color);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: var(--light-bg-color);
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--light-text-color);
}
</style>
