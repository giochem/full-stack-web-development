// localhost:5173

const { test, expect } = require("@playwright/test");

test("demo test to open localhost and click a button", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  // Click the first product in the product grid
  await page.click(".products-grid .product-card:first-child");

  // Verify redirection to a new page
  await expect(page).toHaveURL(/\/product\/\d+/); // Adjust the URL pattern as per your project
});
