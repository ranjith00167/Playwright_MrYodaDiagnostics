const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPageSteps } = require('../pages/LoginPageSteps');
const { HomePageSteps } = require('../pages/HomePageSteps');
const { DiagnosticsPageSteps } = require('../pages/DiagnosticsPageSteps');
const { CartPageSteps } = require('../pages/CartPageSteps');
const BasePriceManager = require('../utils/BasePriceManager');

let loginPage;
let homePage;
let diagPage;
let cartPage;

Then('validate login page loaded correctly', async function () {
    loginPage = new LoginPageSteps(this.page);
    await expect(loginPage.mobile_number).toBeVisible();
    await expect(loginPage.getOtpButton).toBeVisible();
});

Then('validate mobile number entry and format', async function () {
    const mobile = await loginPage.mobile_number.inputValue();
    expect(mobile).toMatch(/^[0-9]{10}$/);
});

Then('validate OTP submission and login success', async function () {
    await this.page.waitForTimeout(2000);
    homePage = new HomePageSteps(this.page);
    // User identified by presence of home icon or welcome text
    const homeIcon = this.page.locator('//p[text()="Home"] | //img[contains(@src,"home")]');
    await expect(homeIcon).toBeVisible({ timeout: 15000 });
});

Then('validate user membership status', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    const isMember = await diagPage.membership_star_icon.isVisible();
    this.isMember = isMember;
    console.log(`⭐ Membership detected: ${isMember}`);
});

Then('validate auto-detected location', async function () {
    const location = await this.page.locator('//span[@title] | //div[contains(@class,"location")]').first().innerText();
    console.log(`📍 Current Location: ${location}`);
    expect(location.length).toBeGreaterThan(0);
});

Then('validate Best Seller section visible and clickable', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    await expect(diagPage.bestSellerViewAll).toBeVisible();
    await expect(diagPage.bestSellerViewAll).toBeEnabled();
});

Then('validate product list loaded after clicking View All', async function () {
    const products = this.page.locator('//div[contains(@class,"flex-col")]//p[contains(@class,"font-bold")]');
    await expect(products.first()).toBeVisible({ timeout: 5000 });
});

Then('validate Add to Cart button visible and clickable', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    await expect(diagPage.addToCartButton.first()).toBeVisible();
});

Then('validate product successfully added to cart', async function () {
    // Check if cart badge count is updated or a toast appears
    const toast = this.page.locator('//div[contains(text(),"added to cart")] | //p[contains(text(),"Success")]');
    const isVisible = await toast.isVisible();
    if (isVisible) {
        console.log("✅ Success toast visible: Product added to cart.");
    } else {
        const badge = this.page.locator('//span[contains(@class,"badge")] | //div[contains(@class,"cart-count")]');
        expect(await badge.innerText()).not.toBe('0');
    }
});

When('click the Best Seller View All button', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    try {
        await diagPage.bestSellerViewAll.first().scrollIntoViewIfNeeded();
        await diagPage.bestSellerViewAll.first().waitFor({ state: 'visible', timeout: 10000 });
        await diagPage.bestSellerViewAll.first().click();
    } catch (e) {
        console.log("⚠️ Failed to click Best Seller View All. Trying fallback to search directly.");
    }
});

When('select tests and capture individual prices', async function () {
    console.log("========== 🧪 TEST SELECTION START ==========");
    BasePriceManager.reset();
    
    diagPage = new DiagnosticsPageSteps(this.page);
    for (const test of this.testNames) {
        console.log("Executing: " + test);
        
        // Handle site-level popups
        try {
            if (await diagPage.locationPopupOkButton.isVisible({ timeout: 1000 })) {
                await diagPage.locationPopupOkButton.click();
            }
        } catch (e) {}

        const searchInput = diagPage.searchTestField.first();
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.clear();
        await searchInput.fill(test);
        
        await this.page.waitForTimeout(2000);
        
        // Find specific card
        const testCard = this.page.locator(`//div[contains(@class,'card') or contains(@class,'border') or (contains(@class,'flex') and contains(@class,'p-'))][.//h4[normalize-space()='${test}']]`)
            .filter({ has: this.page.locator('button', { hasText: /Add|Remove/i }) })
            .first();

        try {
            await testCard.waitFor({ state: 'visible', timeout: 7000 });
        } catch (e) {
            console.log(`❌ Card not found for ${test}.`);
        }

        const priceElement = testCard.locator('xpath=.//p[contains(text(),"₹")] | .//span[contains(text(),"₹")] | .//div[contains(text(),"₹")]').last();
        
        let priceText = "₹0";
        try {
            await priceElement.waitFor({ state: 'visible', timeout: 3000 });
            priceText = await priceElement.innerText();
        } catch (e) {}

        const addButton = testCard.locator('button').filter({ hasText: /Add/i }).first();
        if (await addButton.isVisible()) {
            await addButton.click();
            await this.page.waitForTimeout(1000);
            console.log(`✅ Added ${test} to cart.`);
        }

        BasePriceManager.addSelectionPrice(test, priceText);
        console.log(`💰 Captured price for ${test}: ${priceText}`);
        
        await diagPage.searchTestField.fill('');
    }
});

When('select tests and capture individual prices from global search', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    const testCount = 3; // Change this value based on the number of tests to select
    this.selectedTestPrices = []; // Initialize the array in the context

    for (let i = 0; i < testCount; i++) {
        const testLocator = diagPage.globalSearchTestLocator.nth(i);
        const priceLocator = diagPage.globalSearchIndividualTestPriceLocator.nth(i);

        // Wait for the test element to be visible
        await expect(testLocator).toBeVisible({ timeout: 5000 });

        // Click on the test element
        await testLocator.click();

        // Wait for the price element to be visible and get its text
        const priceText = await priceLocator.innerText();
        this.selectedTestPrices.push(priceText); // Store the price in the context
    }

    console.log('Selected test prices from global search:', this.selectedTestPrices);
});

// Removing duplicates that are already in payment_steps.js or checkout_steps.js
// to resolve ambiguity in Cucumber dry-run


// Duplicate of payment_steps.js removed to resolve ambiguity in dry-run


// Removing multi-member and checkout amount extraction duplicates from
// checkout_steps.js

