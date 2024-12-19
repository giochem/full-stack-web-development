<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>
            <div class="th-content">
              {{ $t("Views.Admin.ManageUser.UserID") }}
            </div>
          </th>
          <th>
            <div class="th-content" @click="toggleSort('username')">
              {{ $t("Views.Admin.ManageUser.Username") }}
              <i :class="getSortIcon('username')"></i>
            </div>
          </th>
          <th>
            <div class="th-content" @click="toggleSort('email')">
              {{ $t("Views.Admin.ManageUser.Email") }}
              <i :class="getSortIcon('email')"></i>
            </div>
          </th>
          <th>
            {{ $t("Views.Admin.ManageUser.Role") }}
          </th>
          <th>{{ $t("Views.Admin.ManageUser.Carts") }}</th>
          <th>{{ $t("Views.Admin.ManageUser.Orders") }}</th>
          <th>
            <div class="th-content" @click="toggleSort('createdAt')">
              {{ $t("Views.Admin.ManageUser.CreatedAt") }}
              <i :class="getSortIcon('createdAt')"></i>
            </div>
          </th>
          <th>{{ $t("Views.Admin.ManageUser.Actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.userID">
          <td>{{ currentPage * itemsPerPage + index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
          </td>
          <td>
            <RouterLink
              :to="`/admin/manage-cart?user=${user.userID}`"
              class="stat-link"
            >
              <span class="stat-count">{{ user.numCartItems }}</span>
              <span class="stat-label">{{
                $t("Views.Admin.ManageUser.NumItems")
              }}</span>
            </RouterLink>
          </td>
          <td>
            <RouterLink
              :to="`/admin/manage-order?user=${user.userID}`"
              class="stat-link"
            >
              <span class="stat-count">{{ user.numOrders }}</span>
              <span class="stat-label">{{
                $t("Views.Admin.ManageUser.NumOrders")
              }}</span>
            </RouterLink>
          </td>
          <td class="created-at">{{ user.createdAt }}</td>
          <td>
            <div class="action-buttons">
              <RouterLink
                :to="`/admin/edit-user/${user.userID}`"
                class="edit-btn"
              >
                <i class="ri-edit-line"></i>
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  users: Array,
  currentPage: Number,
  itemsPerPage: Number,
  sortBy: String,
  sortOrder: String
});

const emit = defineEmits(["toggleSort", "changePage"]);

function toggleSort(field) {
  emit("toggleSort", field);
}

function changePage(newPage) {
  emit("changePage", newPage);
}

const getSortIcon = (field) => {
  if (props.sortBy !== field) return "ri-more-fill";
  return props.sortOrder === "asc" ? "ri-sort-asc" : "ri-sort-desc";
};
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--light-bg-color);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  white-space: nowrap;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.role-badge.admin {
  background: var(--primary-color);
  color: white;
}

.role-badge.client {
  background: var(--secondary-color);
  color: white;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: var(--secondary-color);
  background: rgba(121, 74, 250, 0.1);
}

.edit-btn:hover {
  background: rgba(121, 74, 250, 0.2);
}

.stat-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.stat-link:hover {
  background-color: var(--light-bg-color);
}

.stat-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--light-text-color);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.th-content:hover {
  color: var(--primary-color);
}

.th-content i {
  font-size: 1.125rem;
}

/* Add created at column styles */
.data-table td.created-at {
  white-space: nowrap;
  color: var(--light-text-color);
  font-size: 0.875rem;
}
</style>
