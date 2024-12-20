import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
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
  categories: 5,
  promotions: 4,
  variations: 2,
  products: 5,
  productItem: 20,
  variationOption: 100,
  carts: 50,
  payments: 5,
  orders: 100,
  orderItem: 200
};

// Generate Users data
const generateUsers = () => {
  const ROWS_USERS = 1000;
  let content = "INSERT INTO users (username, email, password, role) VALUES\n";
  const roles = ["client", "admin"];

  const hashedPassword = createHash("sha256").update("1").digest("hex");
  content += `('admin', 'admin@example.com', '${hashedPassword}', 'admin'),\n`;
  for (let i = 2; i <= ROWS_USERS; i++) {
    content += `('client_${i - 1}', 'client${
      i - 1
    }@example.com', '${hashedPassword}', 'client')`;
    content += i === ROWS_USERS ? ";\n" : ",\n";
  }
  return content;
};

// Generate Categories data
const generateCategories = () => {
  let content = "INSERT INTO categories (parentCategoryID, name) VALUES\n";
  const categoryNames = ["polo", "sweatshirt", "jeans", "kaki", "hat"];

  for (let i = 1; i <= categoryNames.length; i++) {
    content += `(null, '${categoryNames[i - 1]}')`;
    content += i === categoryNames.length ? ";\n" : ",\n";
  }
  return content;
};

// Generate Promotions data
const generatePromotions = () => {
  const ROWS_PROMOTIONS = {
    "Exprired Sale": 10,
    "Normal Sale": 20,
    "Special Sale": 65,
    "Comming Soon Sale": 50
  };
  let content =
    "INSERT INTO promotions (name, discount, startDate, endDate) VALUES\n";

  const currentTime = new Date().getTime();
  for (const [promotionName, discount] of Object.entries(ROWS_PROMOTIONS)) {
    if (promotionName === "Exprired Sale") {
      const startDate = new Date(currentTime - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const endDate = new Date(currentTime - 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      content += `('${promotionName}', ${discount}, '${startDate}', '${endDate}')`;
    } else if (
      promotionName === "Normal Sale" ||
      promotionName === "Special Sale"
    ) {
      const startDate = new Date(currentTime - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(currentTime + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      content += `('${promotionName}', ${discount}, '${startDate}', '${endDate}')`;
    } else if (promotionName === "Comming Soon Sale") {
      const startDate = new Date(currentTime + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(currentTime + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      content += `('${promotionName}', ${discount}, '${startDate}', '${endDate}')`;
    }
    content += promotionName === "Comming Soon Sale" ? ";\n" : ",\n";
  }
  return content;
};

// Generate Products data
const generateProducts = () => {
  let content =
    "INSERT INTO products (categoryID, promotionID, name, description, image) VALUES\n";

  const categoryNames = ["polo", "sweatshirt", "jeans", "kaki", "hat"];
  const ROWS_PROMOTIONS = {
    "Exprired Sale": 10,
    "Normal Sale": 20,
    "Special Sale": 65,
    "Comming Soon Sale": 50
  };
  // polo
  content += `(1, 1,'polo nam','Description for polo','polo-black.jpg'),\n`;
  // sweatshirt
  content += `(2, 2,'sweatshirt nam','Description for sweatshirt','sweatshirt-black.jpg'),\n`;
  // jeans
  content += `(3, 3,'jeans nam','Description for jeans','jeans-light-green.jpg'),\n`;
  // kaki
  content += `(4, 4,'kaki nam','Description for kaki','kaki-white.jpg'),\n`;
  // hat
  content += `(5, Null,'hat nam','Description for hat','hat-black.jpg');\n`;
  return content;
};

// Generate ProductItem data
const generateProductItems = () => {
  let content =
    "INSERT INTO productItem (productID, sku, quantity, price, image) VALUES\n";
  const categoryNames = ["polo", "sweatshirt", "jeans", "kaki", "hat"];

  content += `(1, 'polo-black-s', 10, 100000, 'polo-black.jpg'),\n`;
  content += `(1, 'polo-black-m', 10, 100000, 'polo-black.jpg'),\n`;
  content += `(1, 'polo-black-l', 10, 100000, 'polo-black.jpg'),\n`;
  content += `(1, 'polo-black-xl', 10, 100000, 'polo-black.jpg'),\n`;
  content += `(1, 'polo-light-grey-s', 10, 100000, 'polo-light-grey.jpg'),\n`;
  content += `(1, 'polo-light-grey-m', 10, 100000, 'polo-light-grey.jpg'),\n`;
  content += `(1, 'polo-light-grey-l', 10, 100000, 'polo-light-grey.jpg'),\n`;
  content += `(1, 'polo-light-grey-xl', 10, 100000, 'polo-light-grey.jpg'),\n`;

  content += `(2, 'sweatshirt-black-s', 10, 100000, 'sweatshirt-black.jpg'),\n`;
  content += `(2, 'sweatshirt-black-m', 10, 100000, 'sweatshirt-black.jpg'),\n`;
  content += `(2, 'sweatshirt-black-l', 10, 100000, 'sweatshirt-black.jpg'),\n`;
  content += `(2, 'sweatshirt-black-xl', 10, 100000, 'sweatshirt-black.jpg'),\n`;
  content += `(2, 'sweatshirt-green-s', 10, 100000, 'sweatshirt-green.jpg'),\n`;
  content += `(2, 'sweatshirt-green-m', 10, 100000, 'sweatshirt-green.jpg'),\n`;
  content += `(2, 'sweatshirt-green-l', 10, 100000, 'sweatshirt-green.jpg'),\n`;
  content += `(2, 'sweatshirt-green-xl', 10, 100000, 'sweatshirt-green.jpg'),\n`;

  content += `(3, 'jeans-light-green-29', 10, 100000, 'jeans-light-green.jpg'),\n`;
  content += `(3, 'jeans-light-green-30', 10, 100000, 'jeans-light-green.jpg'),\n`;
  content += `(3, 'jeans-light-green-31', 10, 100000, 'jeans-light-green.jpg'),\n`;
  content += `(3, 'jeans-light-green-32', 10, 100000, 'jeans-light-green.jpg'),\n`;
  content += `(3, 'jeans-light-green-34', 10, 100000, 'jeans-light-green.jpg'),\n`;

  content += `(4, 'kaki-white-29', 10, 100000, 'kaki-white.jpg'),\n`;
  content += `(4, 'kaki-white-30', 10, 100000, 'kaki-white.jpg'),\n`;
  content += `(4, 'kaki-white-31', 10, 100000, 'kaki-white.jpg'),\n`;
  content += `(4, 'kaki-white-32', 10, 100000, 'kaki-white.jpg'),\n`;
  content += `(4, 'kaki-white-34', 10, 100000, 'kaki-white.jpg'),\n`;
  content += `(4, 'kaki-grey-29', 10, 100000, 'kaki-grey.jpg'),\n`;
  content += `(4, 'kaki-grey-30', 10, 100000, 'kaki-grey.jpg'),\n`;
  content += `(4, 'kaki-grey-31', 10, 100000, 'kaki-grey.jpg'),\n`;
  content += `(4, 'kaki-grey-32', 10, 100000, 'kaki-grey.jpg'),\n`;
  content += `(4, 'kaki-grey-34', 10, 100000, 'kaki-grey.jpg'),\n`;

  content += `(5, 'hat-black', 10, 100000, 'hat-black.jpg');\n`;
  return content;
};
// Generate Variations data
const generateVariations = () => {
  let content = "INSERT INTO variations (nameAtribute, type) VALUES\n";
  const variations = ["Color", "Size"];

  for (let i = 1; i <= variations.length; i++) {
    content += `('${variations[i - 1]}', Null)`;
    content += i === variations.length ? ";\n" : ",\n";
  }
  return content;
};
// Generate VariationOption data
const generateVariationOptions = () => {
  let content =
    "INSERT INTO variationOption (productItemID, variationID, value) VALUES\n";

  content += `(1, 1, 'black'),\n`;
  content += `(2, 1, 'black'),\n`;
  content += `(3, 1, 'black'),\n`;
  content += `(4, 1, 'black'),\n`;
  content += `(1, 2, 's'),\n`;
  content += `(2, 2, 'm'),\n`;
  content += `(3, 2, 'l'),\n`;
  content += `(4, 2, 'xl'),\n`;
  content += `(5, 1, 'light grey'),\n`;
  content += `(6, 1, 'light grey'),\n`;
  content += `(7, 1, 'light grey'),\n`;
  content += `(8, 1, 'light grey'),\n`;
  content += `(5, 2, 's'),\n`;
  content += `(6, 2, 'm'),\n`;
  content += `(7, 2, 'l'),\n`;
  content += `(8, 2, 'xl'),\n`;

  content += `(9, 1, 'black'),\n`;
  content += `(10, 1, 'black'),\n`;
  content += `(11, 1, 'black'),\n`;
  content += `(12, 1, 'black'),\n`;
  content += `(9, 2, 's'),\n`;
  content += `(10, 2, 'm'),\n`;
  content += `(11, 2, 'l'),\n`;
  content += `(12, 2, 'xl'),\n`;
  content += `(13, 1, 'green'),\n`;
  content += `(14, 1, 'green'),\n`;
  content += `(15, 1, 'green'),\n`;
  content += `(16, 1, 'green'),\n`;
  content += `(13, 2, 's'),\n`;
  content += `(14, 2, 'm'),\n`;
  content += `(15, 2, 'l'),\n`;
  content += `(16, 2, 'xl'),\n`;

  content += `(17, 1, 'green'),\n`;
  content += `(18, 1, 'green'),\n`;
  content += `(19, 1, 'green'),\n`;
  content += `(20, 1, 'green'),\n`;
  content += `(21, 1, 'green'),\n`;
  content += `(17, 2, '29'),\n`;
  content += `(18, 2, '30'),\n`;
  content += `(19, 2, '31'),\n`;
  content += `(20, 2, '32'),\n`;
  content += `(21, 2, '34'),\n`;

  content += `(22, 1, 'white'),\n`;
  content += `(23, 1, 'white'),\n`;
  content += `(24, 1, 'white'),\n`;
  content += `(25, 1, 'white'),\n`;
  content += `(26, 1, 'white'),\n`;
  content += `(22, 2, '29'),\n`;
  content += `(23, 2, '30'),\n`;
  content += `(24, 2, '31'),\n`;
  content += `(25, 2, '32'),\n`;
  content += `(26, 2, '34'),\n`;
  content += `(27, 1, 'grey'),\n`;
  content += `(28, 1, 'grey'),\n`;
  content += `(29, 1, 'grey'),\n`;
  content += `(30, 1, 'grey'),\n`;
  content += `(31, 1, 'grey'),\n`;
  content += `(27, 2, '29'),\n`;
  content += `(28, 2, '30'),\n`;
  content += `(29, 2, '31'),\n`;
  content += `(30, 2, '32'),\n`;
  content += `(31, 2, '34'),\n`;

  content += `(32, 1, 'black');\n`;
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
    "Digital Wallet"
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
    "11_orderItem": generateOrderItems()
  };

  // Create the 'sql' directory if it doesn't exist
  const dir = join(process.cwd(), "sql");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  // Write each table's data to a separate file in the 'sql' directory
  for (const [tableName, content] of Object.entries(data)) {
    writeFileSync(join(dir, `${tableName}_data.sql`), content);
    console.log(`Generated ${tableName}_data.sql in the 'sql' directory`);
  }

  // Create a combined SQL file with all insert statements
  const combinedContent = Object.values(data).join("\n");
  writeFileSync("combined_data.sql", combinedContent);
  console.log(`Generated 0_combined_data.sql in the 'sql' directory`);
};

// Execute the generation
generateAllData();
