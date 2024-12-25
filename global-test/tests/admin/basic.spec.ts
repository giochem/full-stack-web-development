import { test, expect } from '@playwright/test';

test('get all manage functions', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('link', { name: ' Xác thực' })).toBeVisible();
  await page.getByRole('link', { name: ' Xác thực' }).click();
  await page.getByPlaceholder('Nhập email của bạn').click();
  await page.getByPlaceholder('Nhập email của bạn').fill('admin@example.com');
  await page.getByPlaceholder('Nhập email của bạn').press('Tab');
  await page.getByPlaceholder('Nhập mật khẩu của bạn').fill('1');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.getByRole('link', { name: ' Người dùng' }).click();
  await page.getByRole('link', { name: ' Sản phẩm' }).click();
  await page.getByRole('link', { name: ' Thuộc tính sản phẩm' }).click();
  await page.getByRole('link', { name: ' Danh mục' }).click();
  await page.getByRole('link', { name: ' Giảm giá' }).click();
  await page.getByRole('link', { name: ' Giỏ hàng' }).click();
  await page.getByRole('link', { name: ' Đơn hàng' }).click();
  await page.getByRole('button', { name: ' Đăng xuất' }).click();
});

