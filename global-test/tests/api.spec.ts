import { test, expect } from '@playwright/test';

test.describe('API Testing', () => {
  const baseUrl = 'http://localhost:5000/api';

  test('should get items', async ({ request }) => {
    const response = await request.get(`${baseUrl}/items`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const items = await response.json();
    expect(Array.isArray(items)).toBeTruthy();
  });

  test('should create a new item', async ({ request }) => {
    const newItem = {
      title: 'Test Item',
      description: 'Created during E2E test'
    };

    const response = await request.post(`${baseUrl}/items`, {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.title).toBe(newItem.title);
    expect(createdItem.description).toBe(newItem.description);
  });

  test('should update an item', async ({ request }) => {
    // First create an item
    const createResponse = await request.post(`${baseUrl}/items`, {
      data: { title: 'Update Test', description: 'Will be updated' }
    });
    const item = await createResponse.json();

    // Then update it
    const updateResponse = await request.put(`${baseUrl}/items/${item.id}`, {
      data: { title: 'Updated Title' }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedItem = await updateResponse.json();
    expect(updatedItem.title).toBe('Updated Title');
  });
});
