<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <RouterLink to="/admin" class="nav-link">
            <i class="ri-dashboard-line"></i>
            <span>Dashboard</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-user" class="nav-link">
            <i class="ri-user-line"></i>
            <span>Users</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-product" class="nav-link">
            <i class="ri-shopping-bag-line"></i>
            <span>Products</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-collection" class="nav-link">
            <i class="ri-folder-line"></i>
            <span>Collections</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-promotion" class="nav-link">
            <i class="ri-price-tag-3-line"></i>
            <span>Promotions</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-cart" class="nav-link">
            <i class="ri-shopping-cart-line"></i>
            <span>Carts</span>
          </RouterLink>
        </li>
        
        <li class="nav-item">
          <RouterLink to="/admin/manage-order" class="nav-link">
            <i class="ri-file-list-line"></i>
            <span>Orders</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-nav {
  padding: 2rem 0;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--secondary-dark-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: var(--light-bg-color);
  color: var(--primary-color);
}

.nav-link i {
  font-size: 1.25rem;
}

.nav-link span {
  font-weight: 500;
  text-transform: capitalize;
}
</style>
