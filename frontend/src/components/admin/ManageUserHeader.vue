<template>
  <header class="page-header">
    <div class="header-content">
      <h1>{{ $t("Views.Admin.ManageUser.Title") }}</h1>
      <div class="header-actions">
        <div class="filter-group">
          <div class="search-box">
            <i class="ri-search-line"></i>
            <input
              type="text"
              :value="searchQuery"
              :placeholder="$t('Views.Admin.ManageUser.SearchPlaceholder')"
              @input="$emit('update:searchQuery', $event.target.value)"
              @keyup.enter="handleSearch"
              :disabled="loading"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-search"
              :disabled="loading"
            >
              <i class="ri-close-line"></i>
            </button>
          </div>
          <select
            :value="filterRole"
            class="filter-select"
            @change="$emit('update:filterRole', $event.target.value)"
          >
            <option value="">
              {{ $t("Views.Admin.ManageUser.AllRoles") }}
            </option>
            <option value="admin">
              {{ $t("Views.Admin.ManageUser.OptionAdmin") }}
            </option>
            <option value="client">
              {{ $t("Views.Admin.ManageUser.OptionClient") }}
            </option>
          </select>
        </div>
        <RouterLink to="/admin/add-user" class="add-button">
          <i class="ri-add-line"></i>
          {{ $t("Views.Admin.ManageUser.AddUser") }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  searchQuery: String,
  loading: Boolean,
  filterRole: String
});

const emit = defineEmits([
  "handleSearch",
  "clearSearch",
  "update:searchQuery",
  "update:filterRole"
]);

function handleSearch() {
  emit("handleSearch");
}

function clearSearch() {
  emit("clearSearch");
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  outline: none;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  font-size: 1.25rem;
  color: var(--text-light-color);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light-color);
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  outline: none;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: darken(var(--primary-color), 10%);
}
</style>
