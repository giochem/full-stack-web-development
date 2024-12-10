const fs = require("fs");
const path = require("path");

// Utility functions for generating random data
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
};

// Constants for number of rows
const ROWS_COUNT = {
  users: 100,
  categories: 20,
  promotions: 10,
  variations: 10,
  products: 50,
  productItem: 100,
  variationOption: 100,
  carts: 50,
  payments: 5,
  orders: 100,
  orderItem: 200,
};

// Generate Users data
const generateUsers = () => {
  let content = "INSERT INTO users (username, email, password, role) VALUES\n";
  const roles = ["client", "admin"];

  for (let i = 1; i <= ROWS_COUNT.users; i++) {
    content += `('fashionista${i}', 'fashionista${i}@example.com', 'password${i}', '${
      roles[i % 2]
    }')`;
    content += i === ROWS_COUNT.users ? ";\n" : ",\n";
  }
  return content;
};

// Generate Categories data
const generateCategories = () => {
  let content = "INSERT INTO categories (parentCategoryID, name) VALUES\n";
  const categoryNames = ["Men", "Women", "Kids", "Accessories", "Footwear"];

  for (let i = 1; i <= ROWS_COUNT.categories; i++) {
    const parentId =
      i <= categoryNames.length
        ? "NULL"
        : getRandomInt(1, categoryNames.length);
    const categoryName =
      i <= categoryNames.length ? categoryNames[i - 1] : `Subcategory ${i}`;
    content += `(${parentId}, '${categoryName}')`;
    content += i === ROWS_COUNT.categories ? ";\n" : ",\n";
  }
  return content;
};

// Generate Promotions data
const generatePromotions = () => {
  let content =
    "INSERT INTO promotions (name, discount, startDate, endDate) VALUES\n";
  const promotionNames = [
    "Summer Sale",
    "Winter Clearance",
    "Black Friday",
    "Cyber Monday",
    "New Year Sale",
  ];

  for (let i = 1; i <= ROWS_COUNT.promotions; i++) {
    const startDate = getRandomDate(
      new Date(2023, 0, 1),
      new Date(2023, 11, 31)
    );
    const endDate = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    const promotionName = promotionNames[i % promotionNames.length];
    content += `('${promotionName}', ${getRandomInt(
      5,
      50
    )}, '${startDate}', '${endDate}')`;
    content += i === ROWS_COUNT.promotions ? ";\n" : ",\n";
  }
  return content;
};

// Generate Variations data
const generateVariations = () => {
  let content = "INSERT INTO variations (nameAtribute, type) VALUES\n";
  const variations = [
    "Color",
    "Size",
    "Material",
    "Style",
    "Pattern",
    "Fit",
    "Length",
    "Width",
    "Height",
    "Fabric",
  ];

  for (let i = 1; i <= ROWS_COUNT.variations; i++) {
    content += `('${variations[i - 1]}', 'Type${i}')`;
    content += i === ROWS_COUNT.variations ? ";\n" : ",\n";
  }
  return content;
};

// Generate Products data
const generateProducts = () => {
  let content =
    "INSERT INTO products (categoryID, promotionID, name, description, image) VALUES\n";
  const productNames = [
    "T-Shirt",
    "Jeans",
    "Dress",
    "Jacket",
    "Sneakers",
    "Hat",
    "Scarf",
    "Belt",
    "Sunglasses",
    "Watch",
  ];

  for (let i = 1; i <= ROWS_COUNT.products; i++) {
    const categoryId = getRandomInt(1, ROWS_COUNT.categories);
    const promotionId = getRandomInt(1, ROWS_COUNT.promotions);
    const productName = productNames[i % productNames.length];
    content += `(${categoryId}, ${promotionId}, '${productName} ${i}', 'Description for ${productName.toLowerCase()} ${i}', 'default.png')`;
    content += i === ROWS_COUNT.products ? ";\n" : ",\n";
  }
  return content;
};

// Generate ProductItem data
const generateProductItems = () => {
  let content =
    "INSERT INTO productItem (productID, sku, quantity, price, image) VALUES\n";

  for (let i = 1; i <= ROWS_COUNT.productItem; i++) {
    const productId = getRandomInt(1, ROWS_COUNT.products);
    content += `(${productId}, 'SKU${i}', ${getRandomInt(
      0,
      100
    )}, ${getRandomInt(10, 1000)}, 'defaultitem.png')`;
    content += i === ROWS_COUNT.productItem ? ";\n" : ",\n";
  }
  return content;
};

// Generate VariationOption data
const generateVariationOptions = () => {
  let content =
    "INSERT INTO variationOption (productItemID, variationID, value) VALUES\n";
  const variationValues = [
    "Red",
    "Blue",
    "Green",
    "Small",
    "Medium",
    "Large",
    "Cotton",
    "Leather",
    "Silk",
    "Denim",
  ];

  for (let i = 1; i <= ROWS_COUNT.variationOption; i++) {
    const productItemId = getRandomInt(1, ROWS_COUNT.productItem);
    const variationId = getRandomInt(1, ROWS_COUNT.variations);
    const value = variationValues[i % variationValues.length];
    content += `(${productItemId}, ${variationId}, '${value}')`;
    content += i === ROWS_COUNT.variationOption ? ";\n" : ",\n";
  }
  return content;
};

// Generate Carts data
const generateCarts = () => {
  let content = "INSERT INTO carts (userID, productItemID, quantity) VALUES\n";

  for (let i = 1; i <= ROWS_COUNT.carts; i++) {
    const userId = getRandomInt(1, ROWS_COUNT.users);
    const productItemId = getRandomInt(1, ROWS_COUNT.productItem);
    content += `(${userId}, ${productItemId}, ${getRandomInt(1, 5)})`;
    content += i === ROWS_COUNT.carts ? ";\n" : ",\n";
  }
  return content;
};

// Generate Payments data
const generatePayments = () => {
  let content = "INSERT INTO payments (name, price) VALUES\n";
  const paymentMethods = [
    "Cash",
    "Credit Card",
    "PayPal",
    "Bank Transfer",
    "Digital Wallet",
  ];

  for (let i = 1; i <= ROWS_COUNT.payments; i++) {
    content += `('${paymentMethods[i - 1]}', ${getRandomInt(0, 50)})`;
    content += i === ROWS_COUNT.payments ? ";\n" : ",\n";
  }
  return content;
};

// Generate Orders data
const generateOrders = () => {
  let content =
    "INSERT INTO orders (userID, paymentID, fullName, phone, address, note, status) VALUES\n";
  const statuses = ["processing", "completed", "cancelled"];

  for (let i = 1; i <= ROWS_COUNT.orders; i++) {
    const userId = getRandomInt(1, ROWS_COUNT.users);
    const paymentId = getRandomInt(1, ROWS_COUNT.payments);
    const status = statuses[getRandomInt(0, 2)];
    content += `(${userId}, ${paymentId}, 'Customer ${i}', '${getRandomInt(
      1000000000,
      9999999999
    )}', 'Address ${i}', 'Note ${i}', '${status}')`;
    content += i === ROWS_COUNT.orders ? ";\n" : ",\n";
  }
  return content;
};

// Generate OrderItem data
const generateOrderItems = () => {
  let content =
    "INSERT INTO orderItem (orderID, productItemID, quantity, price) VALUES\n";

  for (let i = 1; i <= ROWS_COUNT.orderItem; i++) {
    const orderId = getRandomInt(1, ROWS_COUNT.orders);
    const productItemId = getRandomInt(1, ROWS_COUNT.productItem);
    content += `(${orderId}, ${productItemId}, ${getRandomInt(
      1,
      5
    )}, ${getRandomInt(10, 1000)})`;
    content += i === ROWS_COUNT.orderItem ? ";\n" : ",\n";
  }
  return content;
};

// Generate all data and write to files
const generateAllData = () => {
  const data = {
    "1_users": generateUsers(),
    "2_categories": generateCategories(),
    "3_promotions": generatePromotions(),
    "4_variations": generateVariations(),
    "5_products": generateProducts(),
    "6_productItem": generateProductItems(),
    "7_variationOption": generateVariationOptions(),
    "8_carts": generateCarts(),
    "9_payments": generatePayments(),
    "10_orders": generateOrders(),
    "11_orderItem": generateOrderItems(),
  };

  // Create the 'sql' directory if it doesn't exist
  const dir = path.join(__dirname, "sql");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Write each table's data to a separate file in the 'sql' directory
  for (const [tableName, content] of Object.entries(data)) {
    fs.writeFileSync(path.join(dir, `${tableName}_data.sql`), content);
    console.log(`Generated ${tableName}_data.sql in the 'sql' directory`);
  }
};

// Execute the generation
generateAllData();
