# Sauce Demo Core User Operations Test Plan

## Application Overview

Explore and verify the five core end-user operations on the Swag Labs e-commerce demo: authentication, product discovery, cart management, checkout information and review, and order completion. The live UI was explored at https://www.saucedemo.com. Use a fresh browser context/app state for each scenario. The login page displays the public demo accounts and shared password; use standard_user / secret_sauce for successful flows. Each scenario is independently runnable and should begin logged out with an empty cart. Fail if a listed state, validation message, navigation, product, or order result is absent or inconsistent.

## Test Scenarios

### 1. 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Reject invalid credentials and sign in with a standard demo account

**File:** `tests/saucedemo-core-operations/authentication.spec.ts`

**Steps:**
  1. Start from the logged-out Swag Labs login page with fresh app state.
    - expect: Username and Password fields and the Login button are visible.
  2. Enter invalid_user as Username and wrong_password as Password, then click Login.
    - expect: Login is rejected and the user remains on the login page.
    - expect: An alert states that the username and password do not match any user in the service.
  3. Replace the values with standard_user and secret_sauce, then click Login.
    - expect: The user is signed in and routed to /inventory.html.
    - expect: The Products catalog is visible and the cart is empty.

### 2. 2. Product discovery

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse products, sort by price, and inspect a product detail

**File:** `tests/saucedemo-core-operations/product-discovery.spec.ts`

**Steps:**
  1. From fresh state, sign in with standard_user / secret_sauce.
    - expect: The Products page loads with six product cards, product names, descriptions, prices, and Add to cart buttons.
  2. Choose Price (low to high) from the Sort products dropdown.
    - expect: Products reorder by ascending price; Sauce Labs Onesie ($7.99) is first and Sauce Labs Fleece Jacket ($49.99) is last.
  3. Open the Sauce Labs Backpack product detail from its name or image.
    - expect: The product detail page shows Sauce Labs Backpack, its description, price ($29.99), Add to cart, and Back to products.
  4. Click Back to products.
    - expect: The user returns to /inventory.html and the product catalog is visible.

### 3. 3. Cart management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add products, review the cart, and remove an item

**File:** `tests/saucedemo-core-operations/cart-management.spec.ts`

**Steps:**
  1. From fresh state, sign in with standard_user / secret_sauce.
    - expect: The catalog is shown with an empty cart.
  2. Add Sauce Labs Onesie and Sauce Labs Bike Light to the cart.
    - expect: Both product buttons change to Remove.
    - expect: The cart badge shows 2 items.
  3. Open the cart.
    - expect: The Your Cart page lists Sauce Labs Onesie and Sauce Labs Bike Light, each with quantity 1 and its matching price.
    - expect: Continue Shopping and Checkout buttons are available.
  4. Remove Sauce Labs Onesie from the cart.
    - expect: The Onesie row disappears and the cart badge updates to 1 item.
  5. Remove the remaining Bike Light.
    - expect: The cart is empty, the cart badge is absent or indicates zero items, and no product rows remain.

### 4. 4. Checkout information and order review

**Seed:** `tests/seed.spec.ts`

#### 4.1. Validate required customer fields and review checkout totals

**File:** `tests/saucedemo-core-operations/checkout-information.spec.ts`

**Steps:**
  1. From fresh state, sign in, add Sauce Labs Onesie and Sauce Labs Bike Light, open the cart, and click Checkout.
    - expect: Checkout: Your Information is shown with First Name, Last Name, Zip/Postal Code, Cancel, and Continue controls.
  2. Click Continue with all fields blank.
    - expect: Checkout remains on the information page and an alert says First Name is required.
  3. Enter Alex in First Name and Tester in Last Name, leave Zip/Postal Code blank, and click Continue.
    - expect: Checkout remains on the information page and an alert says Postal Code is required.
  4. Enter 12345 in Zip/Postal Code and click Continue.
    - expect: Checkout: Overview is shown with both selected items and their quantities/prices.
    - expect: Payment information and shipping information are displayed.
    - expect: Item total is $17.98, tax is $1.44, and total is $19.42.

### 5. 5. Order completion

**Seed:** `tests/seed.spec.ts`

#### 5.1. Complete a purchase and verify the confirmation state

**File:** `tests/saucedemo-core-operations/order-completion.spec.ts`

**Steps:**
  1. From fresh state, sign in with standard_user / secret_sauce, add Sauce Labs Onesie and Sauce Labs Bike Light, open the cart, and click Checkout.
    - expect: Checkout: Your Information is shown.
  2. Enter Alex, Tester, and 12345 in First Name, Last Name, and Zip/Postal Code, then click Continue.
    - expect: Checkout: Overview lists the two selected products and displays Item total: $17.98, Tax: $1.44, and Total: $19.42.
  3. Review the items and total, then click Finish.
    - expect: The Checkout: Complete! page appears with the Thank you for your order! confirmation and dispatch message.
    - expect: The cart is empty after successful purchase.
  4. Click Back Home.
    - expect: The user returns to the Products catalog and can begin a new shopping session.
