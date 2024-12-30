<template>
  <div class="dashboard">
    <div class="header">
      <h1>{{ $t("Views.Admin.Dashboard.Title") }}</h1>
      <div class="period-selector">
        <button
          v-for="period in periods"
          :key="period.value"
          :class="['period-btn', { active: selectedPeriod === period.value }]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card">
        <div class="card-icon orders">
          <i class="ri-shopping-bag-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ $t("Views.Admin.Dashboard.TotalOrders") }}</h3>
          <p class="number">{{ stats.totalOrders }}</p>
          <p
            class="trend"
            :class="{ up: stats.orderTrend > 0, down: stats.orderTrend < 0 }"
          >
            <i
              :class="
                stats.orderTrend > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
              "
            ></i>
            {{ Math.abs(stats.orderTrend) }}% from last period
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon revenue">
          <i class="ri-money-dollar-circle-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ $t("Views.Admin.Dashboard.Revenue") }}</h3>
          <p class="number">{{ formatPrice(stats.totalRevenue) }}</p>
          <p
            class="trend"
            :class="{
              up: stats.revenueTrend > 0,
              down: stats.revenueTrend < 0
            }"
          >
            <i
              :class="
                stats.revenueTrend > 0
                  ? 'ri-arrow-up-line'
                  : 'ri-arrow-down-line'
              "
            ></i>
            {{ Math.abs(stats.revenueTrend) }}% from last period
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon users">
          <i class="ri-user-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ $t("Views.Admin.Dashboard.ActiveUsers") }}</h3>
          <p class="number">{{ stats.activeUsers }}</p>
          <p
            class="trend"
            :class="{ up: stats.userTrend > 0, down: stats.userTrend < 0 }"
          >
            <i
              :class="
                stats.userTrend > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
              "
            ></i>
            {{ Math.abs(stats.userTrend) }}% from last period
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon products">
          <i class="ri-store-2-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ $t("Views.Admin.Dashboard.Products") }}</h3>
          <p class="number">{{ stats.totalProducts }}</p>
          <p class="sub-text">{{ stats.lowStockProducts }} low in stock</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h2>{{ $t("Views.Admin.Dashboard.RevenueChart") }}</h2>
        <canvas ref="revenueChart"></canvas>
      </div>

      <div class="chart-container">
        <h2>{{ $t("Views.Admin.Dashboard.OrdersByStatus") }}</h2>
        <canvas ref="orderStatusChart"></canvas>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="recent-section">
      <div class="section-header">
        <h2>{{ $t("Views.Admin.Dashboard.RecentOrders") }}</h2>
        <RouterLink to="/admin/manage-order" class="view-all">{{
          $t("Views.Admin.Dashboard.ViewAll")
        }}</RouterLink>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ $t("Views.Admin.Dashboard.OrderID") }}</th>
              <th>{{ $t("Views.Admin.Dashboard.Customer") }}</th>
              <th>{{ $t("Views.Admin.Dashboard.Status") }}</th>
              <th>{{ $t("Views.Admin.Dashboard.Amount") }}</th>
              <th>{{ $t("Views.Admin.Dashboard.Date") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.orderID">
              <td>#{{ order.orderID }}</td>
              <td>{{ order.fullName }}</td>
              <td>
                <span :class="['status-badge', order.status]">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ formatPrice(order.totalAmount) }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import axios from "@/utils/axios";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const selectedPeriod = ref("week");
const revenueChart = ref(null);
const orderStatusChart = ref(null);
const recentOrders = ref([]);
const stats = ref({
  totalOrders: 0,
  orderTrend: 0,
  totalRevenue: 0,
  revenueTrend: 0,
  activeUsers: 0,
  userTrend: 0,
  totalProducts: 0,
  lowStockProducts: 0
});

const periods = [
  { label: t("Views.Admin.Dashboard.Week"), value: "week" },
  { label: t("Views.Admin.Dashboard.Month"), value: "month" },
  { label: t("Views.Admin.Dashboard.Year"), value: "year" }
];

// Format helpers
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(price);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

// Fetch dashboard data
async function fetchDashboardData() {
  // try {
  //   const response = await axios.get(
  //     `/dashboard?period=${selectedPeriod.value}`
  //   );
  //   stats.value = response.data.stats;
  //   recentOrders.value = response.data.recentOrders;
  //   // Update charts with new data
  //   updateCharts(response.data.chartData);
  // } catch (error) {
  //   console.error("Error fetching dashboard data:", error);
  // }
}

// Initialize and update charts
function updateCharts(chartData) {
  if (revenueChart.value) {
    revenueChart.value.destroy();
  }
  if (orderStatusChart.value) {
    orderStatusChart.value.destroy();
  }

  // Revenue Chart
  const revenueCtx = document.querySelector("#revenueChart").getContext("2d");
  revenueChart.value = new Chart(revenueCtx, {
    type: "line",
    data: chartData.revenue,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Order Status Chart
  const statusCtx = document
    .querySelector("#orderStatusChart")
    .getContext("2d");
  orderStatusChart.value = new Chart(statusCtx, {
    type: "doughnut",
    data: chartData.orderStatus,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Watch for period changes
watch(selectedPeriod, () => {
  fetchDashboardData();
});

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: var(--secondary-dark-color);
}

.period-selector {
  display: flex;
  gap: 0.5rem;
  background: var(--light-bg-color);
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s;
}

.period-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-icon.orders {
  background: rgba(121, 74, 250, 0.1);
  color: var(--primary-color);
}
.card-icon.revenue {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.card-icon.users {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}
.card-icon.products {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.card-content h3 {
  color: var(--light-text-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.number {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--secondary-dark-color);
  margin-bottom: 0.25rem;
}

.trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend.up {
  color: #10b981;
}
.trend.down {
  color: #ef4444;
}

.sub-text {
  font-size: 0.875rem;
  color: var(--light-text-color);
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
}

.chart-container h2 {
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
  margin-bottom: 1rem;
}

.recent-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
}

.view-all {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 500;
  color: var(--light-text-color);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}
.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
