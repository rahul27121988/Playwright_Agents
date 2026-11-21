import { test, expect } from '@playwright/test';

test.describe('2. Product discovery', () => {
  test('Browse products, sort by price, and inspect a product detail', async ({ page }) => {
    // 1. Sign in with the standard demo account and verify the full product catalog is available.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('.inventory_item_name')).toHaveCount(6);
    await expect(page.locator('.inventory_item_desc')).toHaveCount(6);
    await expect(page.locator('.inventory_item_price')).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);

    // 2. Sort by price from low to high and verify the first and last products.
    const sortProducts = page.locator('[data-test="product-sort-container"]');
    await sortProducts.selectOption('lohi');
    await expect(sortProducts).toHaveValue('lohi');
    const productNames = page.locator('.inventory_item_name');
    const productPrices = page.locator('.inventory_item_price');
    await expect(productNames.first()).toHaveText('Sauce Labs Onesie');
    await expect(productPrices.first()).toHaveText('$7.99');
    await expect(productNames.last()).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productPrices.last()).toHaveText('$49.99');

    // 3. Open Sauce Labs Backpack details and verify its information and available actions.
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-desc"]')).toContainText('sleek, streamlined Sly Pack');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // 4. Return to the product listing and verify the catalog is visible.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });
});
