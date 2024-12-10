const Message = {
  // User related messages
  SUCCESS_GET_USERS: "Successfully retrieved users",
  SUCCESS_SEARCH_USERS: "Successfully searched users",
  SUCCESS_GET_USER: "Successfully retrieved user",
  SUCCESS_CREATE_USER: "Successfully created user",
  SUCCESS_UPDATE_USER: "Successfully updated user",
  SUCCESS_DELETE_USER: "Successfully deleted user",
  ERROR_EMAIL_EXISTS: "Email already exists",
  ERROR_USER_NOT_FOUND: "User not found",

  // Auth related messages
  SUCCESS_LOGIN: "Successfully logged in",
  SUCCESS_REGISTER: "Successfully registered",
  SUCCESS_LOGOUT: "Successfully logged out",
  ERROR_INVALID_CREDENTIALS: "Invalid credentials",
  ERROR_UNAUTHORIZED: "Unauthorized access",

  // Product related messages
  SUCCESS_GET_PRODUCTS: "Successfully retrieved products",
  SUCCESS_GET_PRODUCT: "Successfully retrieved product",
  SUCCESS_UPSERT_PRODUCT: "Successfully upserted product",
  SUCCESS_UPSERT_PRODUCT_ITEM: "Successfully upserted product item",
  SUCCESS_DELETE_PRODUCT: "Successfully deleted product",
  SUCCESS_GET_PRODUCT_EXTRA_INFO: "Successfully retrieved product extra info",
  ERROR_PRODUCT_NOT_FOUND: "Product not found",
  ERROR_PRODUCT_IMAGE_REQUIRED: "Product image is required",
  SUCCESS_DELETE_PRODUCT_ITEM: "Successfully deleted product item",
  ERROR_PRODUCT_ITEM_NOT_FOUND: "Product item not found",
  ERROR_INVALID_QUERY: "Invalid query",
  // Variation related messages
  SUCCESS_GET_VARIATIONS: "Successfully retrieved variations",
  SUCCESS_CREATE_VARIATION: "Successfully created variation",
  SUCCESS_UPDATE_VARIATION: "Successfully updated variation",
  SUCCESS_DELETE_VARIATION: "Successfully deleted variation",
  ERROR_VARIATION_NOT_FOUND: "Variation not found",
  ERROR_VARIATION_NAME_EXISTS: "Variation name already exists",

  // Cart related messages
  SUCCESS_GET_CART: "Successfully retrieved cart",
  SUCCESS_ADD_TO_CART: "Successfully added to cart",
  SUCCESS_UPDATE_CART: "Successfully updated cart",
  SUCCESS_DELETE_FROM_CART: "Successfully removed from cart",
  SUCCESS_CLEAR_CART: "Successfully cleared cart",
  ERROR_CART_NOT_FOUND: "Cart not found",
  ERROR_INSUFFICIENT_STOCK: "Insufficient stock",
  SUCCESS_UPSERT_CART: "Successfully upserted cart",

  // Order related messages
  SUCCESS_GET_ORDERS: "Successfully retrieved orders",
  SUCCESS_GET_ORDER: "Successfully retrieved order",
  SUCCESS_CREATE_ORDER: "Successfully created order",
  SUCCESS_UPDATE_ORDER: "Successfully updated order",
  SUCCESS_DELETE_ORDER: "Successfully deleted order",
  ERROR_ORDER_NOT_FOUND: "Order not found",

  // Category related messages
  SUCCESS_GET_CATEGORIES: "Successfully retrieved categories",
  SUCCESS_GET_CATEGORY: "Successfully retrieved category",
  SUCCESS_CREATE_CATEGORY: "Successfully created category",
  SUCCESS_UPDATE_CATEGORY: "Successfully updated category",
  SUCCESS_DELETE_CATEGORY: "Successfully deleted category",
  ERROR_CATEGORY_NOT_FOUND: "Category not found",
  ERROR_CATEGORY_NAME_EXISTS: "Category name already exists",

  // Promotion related messages
  SUCCESS_GET_PROMOTIONS: "Successfully retrieved promotions",
  SUCCESS_GET_PROMOTION: "Successfully retrieved promotion",
  SUCCESS_CREATE_PROMOTION: "Successfully created promotion",
  SUCCESS_UPDATE_PROMOTION: "Successfully updated promotion",
  SUCCESS_DELETE_PROMOTION: "Successfully deleted promotion",
  ERROR_PROMOTION_NOT_FOUND: "Promotion not found",
  ERROR_PROMOTION_NAME_EXISTS: "Promotion name already exists",
  ERROR_PROMOTION_EXPIRED: "Promotion has expired",
  ERROR_PROMOTION_NOT_STARTED: "Promotion has not started yet",

  // Payment related messages
  SUCCESS_GET_PAYMENTS: "Successfully retrieved payments",
  SUCCESS_CREATE_PAYMENT: "Successfully created payment",
  SUCCESS_UPDATE_PAYMENT: "Successfully updated payment",
  SUCCESS_DELETE_PAYMENT: "Successfully deleted payment",
  ERROR_PAYMENT_NOT_FOUND: "Payment not found",

  // Database related messages
  ERROR_DB_CONNECTION: "Database connection error",
  ERROR_DB_QUERY: "Database query error",

  // General errors
  ERROR_UNKNOWN: "An unknown error occurred",
  ERROR_VALIDATION: "Validation error",
};

const StatusCode = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const Path = {
  UPLOAD_DIR: "./src/v0/uploads",
  STATIC_DIR: "/v0/uploads",
};

module.exports = {
  Message,
  StatusCode,
  Path,
};
