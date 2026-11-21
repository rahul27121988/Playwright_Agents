import { test, expect } from '@playwright/test';

test.describe('5. Order completion', () => {
  test('Complete a purchase and verify the confirmation state', async ({ page }) => {
    // 1. Sign in, add the two planned products, and open checkout information.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // 2. Enter customer information and verify the order overview and calculated totals.
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);
    const onesieRow = overviewItems.filter({ hasText: 'Sauce Labs Onesie' });
    const bikeLightRow = overviewItems.filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(onesieRow.locator('.cart_quantity')).toHaveText('1');
    await expect(onesieRow).toContainText('$7.99');
    await expect(bikeLightRow.locator('.cart_quantity')).toHaveText('1');
    await expect(bikeLightRow).toContainText('$9.99');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $17.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $1.44');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $19.42');

    // 3. Finish the order and verify confirmation and the cleared cart.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // 4. Return home and verify the product catalog is available for another shopping session.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });
});
