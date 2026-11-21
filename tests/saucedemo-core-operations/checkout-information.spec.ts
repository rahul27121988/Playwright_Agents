import { test, expect } from '@playwright/test';

test.describe('4. Checkout information and order review', () => {
  test('Validate required customer fields and review checkout totals', async ({ page }) => {
    // 1. Sign in, add both planned products, and open checkout information.
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
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    const continueButton = page.locator('[data-test="continue"]');
    await expect(continueButton).toBeVisible();

    // 2. Submit the empty form and verify first-name validation.
    await continueButton.click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    // 3. Enter first and last names only and verify postal-code validation.
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await continueButton.click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');

    // 4. Complete customer information and verify the order review and calculated totals.
    await page.locator('[data-test="postalCode"]').fill('12345');
    await continueButton.click();
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
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $17.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $1.44');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $19.42');
  });
});
