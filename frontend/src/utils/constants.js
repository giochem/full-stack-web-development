// API Endpoints with Methods
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: {
      url: "/auth/login",
      method: "POST",
    },
    REGISTER: {
      url: "/auth/register",
      method: "POST",
    },
    PROFILE: {
      url: "/auth/profile",
      method: "GET",
    },
    UPDATE_PROFILE: {
      url: "/users/profile",
      method: "PUT",
    },
  },
  USERS: {
    LIST: {
      url: (page = 0, size = 10) => `/users?page=${page}&size=${size}`,
      method: "GET",
    },
    SEARCH: {
      url: "/users/search",
      method: "GET",
    },
    GET_BY_ID: {
      url: (id) => `/users/${id}`,
      method: "GET",
    },
    UPDATE: {
      url: (id) => `/users/${id}`,
      method: "PUT",
    },
    CREATE: {
      url: "/users",
      method: "POST",
    },
  },
  PRODUCTS: {
    LIST: {
      url: (page = 0, size = 10) => `/products?page=${page}&size=${size}`,
      method: "GET",
    },
    DETAIL: {
      url: (id) => `/products/${id}`,
      method: "GET",
    },
    CREATE: {
      url: "/products",
      method: "POST",
    },
    UPDATE: {
      url: (id) => `/products/${id}`,
      method: "PUT",
    },
    DELETE: {
      url: (id) => `/products/${id}`,
      method: "DELETE",
    },
  },
  CART: {
    LIST: {
      url: "/carts/owner",
      method: "GET",
    },
    UPSERT: {
      url: "/carts",
      method: "PUT",
    },
  },
  ORDERS: {
    LIST: {
      url: (page = 0, size = 10) => `/orders?page=${page}&size=${size}`,
      method: "GET",
    },
    OWNER: {
      url: "/orders/owner",
      method: "GET",
    },
    CREATE: {
      url: "/orders",
      method: "POST",
    },
  },
};

// App Constants
export const APP_CONSTANTS = {
  API_URL: "http://localhost:5000",
  API_BASE_URL: "http://localhost:5000/api",
  API_TIMEOUT: 5000,
  STORAGE_KEYS: {
    AUTH_TOKEN: "token",
    IS_LOGGED_IN: "logined",
  },
  ROLES: {
    ADMIN: "admin",
    USER: "user",
  },
  ORDER: {
    SHIPPING_FEE: 0,
  },
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
  },
  UPLOAD: {
    DEFAULT_IMAGE: "https://via.placeholder.com/200",
    UPLOAD_URL: "http://localhost:5000/uploads/v0/",
  },
};
