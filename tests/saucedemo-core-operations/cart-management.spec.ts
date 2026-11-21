import { test, expect } from '@playwright/test';

test.describe('3. Cart management', () => {
  test('Add products, review the cart, and remove an item', async ({ page }) => {
    // 1. Sign in with the standard demo account and verify the catalog starts with an empty cart.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 2. Add the Onesie and Bike Light and verify the cart count and remove actions.
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // 3. Open the cart and verify item details and cart actions.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    const onesieRow = cartItems.filter({ hasText: 'Sauce Labs Onesie' });
    const bikeLightRow = cartItems.filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(onesieRow.locator('.cart_quantity')).toHaveText('1');
    await expect(onesieRow).toContainText('$7.99');
    await expect(bikeLightRow.locator('.cart_quantity')).toHaveText('1');
    await expect(bikeLightRow).toContainText('$9.99');
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // 4. Remove the Onesie and verify the Bike Light is the only remaining item.
    await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(onesieRow).toHaveCount(0);
    await expect(bikeLightRow).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // 5. Remove the remaining Bike Light and verify the cart is empty.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(cartItems).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
  });
});
