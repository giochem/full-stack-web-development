const { test, expect } = require("@playwright/test");

test("user login and redirect to admin page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Wait for products grid to be fully loaded
  await page.waitForSelector(".products-grid .product-card", {
    state: "visible"
  });
  await expect(page.locator(".products-grid .product-card")).toHaveCount(12);

  // Click the login action button
  await page.click("a.action-button.login"); // Adjusted the selector as per the provided HTML structure

  // Verify redirection to the auth page
  await expect(page).toHaveURL("http://localhost:5173/auth");

  // Input email and password
  await page.fill("#email", "admin@example.com");
  await page.fill("#password", "1");

  // Click the login button
  await page.click('button.primary-btn:has-text("Đăng nhập")');

  // Verify redirection to the admin page
  await expect(page).toHaveURL("http://localhost:5173/admin/dashboard");

  // Click the link to manage users
  await page.click('a.nav-link:has-text("Người dùng")');

  // Verify redirection to the manage user page
  await expect(page).toHaveURL("http://localhost:5173/admin/manage-user");

  // Check the UI after the response returns
  await expect(page.locator("tbody tr")).toHaveCount(10); // Adjust the count as per your data

  // Click the "Thêm người dùng" button
  await page.click('a.add-button:has-text("Thêm người dùng")');

  // Verify redirection to the add user page
  await expect(page).toHaveURL("http://localhost:5173/admin/add-user");

  // Generate random string
  const randomString = Math.random().toString(36).substring(2, 8);

  // Fill in the email, username, and password fields
  await page.fill("#email", `test.${randomString}@example.com`);
  await page.fill("#username", `test${randomString}`);
  await page.fill("#password", "123123q");

  // Click the "Tạo người dùng" button
  await page.click('button.primary-btn:has-text("Tạo người dùng")');

  // Wait for 200ms
  await page.waitForTimeout(200);

  // Verify redirection to the manage user page
  await expect(page).toHaveURL("http://localhost:5173/admin/manage-user");

  await expect(page.locator("tbody tr")).toHaveCount(10); // Count should be 10 after adding new user

  // Perform search action with the newly created username
  await page.getByPlaceholder("Tìm kiếm").fill(`test${randomString}`);
  await page.keyboard.press("Enter");

  // Verify exactly one search result is displayed
  await expect(page.locator("tbody tr")).toHaveCount(1);

  // Verify the search result contains the correct username
  await expect(page.locator("tbody tr")).toContainText(`test${randomString}`);

  // Click the edit button
  await page.click(".action-buttons .edit-btn i.ri-edit-line");

  // Verify redirection to the edit user page
  await expect(page).toHaveURL(
    /http:\/\/localhost:5173\/admin\/edit-user\/\d+/
  );
});
