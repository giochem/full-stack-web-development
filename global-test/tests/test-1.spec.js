import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Recording...
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: " Xác thực" }).click();
  await page.getByPlaceholder("Nhập email của bạn").click();
  await page.getByPlaceholder("Nhập email của bạn").fill("admin@example.com");
  await page.getByPlaceholder("Nhập mật khẩu của bạn").click();
  await page.getByPlaceholder("Nhập mật khẩu của bạn").fill("1");
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.getByRole("link", { name: " Người dùng" }).click();
  await page.getByRole("link", { name: " Thêm người dùng" }).click();
  await page.getByPlaceholder("Nhập email").click();
  await page.getByPlaceholder("Nhập email").fill(`newclient@example.com`);
  await page.getByPlaceholder("Nhập tài khoản").click();
  await page.getByPlaceholder("Nhập tài khoản").fill("new client");
  await page.getByPlaceholder("Nhập mật khẩu").click();
  await page.getByPlaceholder("Nhập mật khẩu").fill("123123q");
  await page.getByLabel("Vai trò").selectOption("admin");
  await page.getByRole("button", { name: "Tạo người dùng" }).click();
  await page.getByText("ID người dùng").click();
  await page.getByText("Tài khoản").click();
  await page.getByText("Tài khoản").click();
  await page
    .getByRole("row", { name: "2 new client newclient@" })
    .locator("div")
    .getByRole("link")
    .click();
  await page.getByPlaceholder("Nhập tài khoản").click();
  await page.getByPlaceholder("Nhập tài khoản").fill("new client change");
  await page.getByLabel("Vai trò").selectOption("client");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page.getByPlaceholder("Nhập mật khẩu").click();
  await page.getByPlaceholder("Nhập mật khẩu").fill("123321q");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page.getByRole("link", { name: " Sản phẩm" }).click();
  await page.goto("http://localhost:5173/admin/manage-product");
  await expect(
    page.locator("div:nth-child(6) > .product-actions > .edit-btn")
  ).toBeVisible();
  await page.locator("div:nth-child(6) > .product-actions > .edit-btn").click();
  await page.locator('input[type="file"]').click();
  await page.locator('input[type="file"]').setInputFiles("do an 4.jpg");
  await page.getByPlaceholder("Nhập mô tả sản phẩm").click();
  await page.getByPlaceholder("Nhập mô tả sản phẩm").fill("new change");
  await page.getByRole("button", { name: " Lưu thay đổi" }).click();
});
