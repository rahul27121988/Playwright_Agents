import { test, expect } from '@playwright/test';

test.describe('1. Authentication', () => {
  test('Reject invalid credentials and sign in with a standard demo account', async ({ page }) => {
    // 1. Start from the logged-out Swag Labs login page and confirm the login controls are visible.
    await page.goto('https://www.saucedemo.com');
    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // 2. Submit invalid credentials and verify the user remains on the login page with an error.
    await usernameInput.fill('invalid_user');
    await passwordInput.fill('wrong_password');
    await loginButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );

    // 3. Replace the credentials with the standard demo account and verify the catalog and empty cart.
    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
  });
});
