import axios from "axios";
import { APP_CONSTANTS } from "./constants";

const axiosInstance = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
  timeout: APP_CONSTANTS.API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Construct full URL with query parameters
    const fullUrl =
      config.baseURL +
      config.url +
      (config.params
        ? "?" + new URLSearchParams(config.params).toString()
        : "");

    console.log("🚀 Request:", {
      method: config.method.toUpperCase(),
      fullUrl,
      params: config.params,
      data: config.data,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });

    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          console.log("🔒 Unauthorized - Redirecting to login");
          localStorage.removeItem("token");
          break;
        case 403:
          console.log("🚫 Forbidden access");
          break;
        case 404:
          console.log("📭 Resource not found");
          break;
        case 500:
          console.log("🔥 Server error");
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
