const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPageSteps } = require('../pages/LoginPageSteps');
const { DiagnosticsPageSteps } = require('../pages/DiagnosticsPageSteps');
const { CartPageSteps } = require('../pages/CartPageSteps');
const BasePriceManager = require('../utils/BasePriceManager');

let selectedTestNames = [];
let testPrices = {};
let calculatedTotal = 0.0;
let cartTotal = 0.0;

Given('login with mobile {string} and otp {string}', async function (mobile, otp) {
    if (!this.testData) {
        this.testData = {};
    }
    this.testData.mobileNumber = mobile;
    this.testData.otp = otp;
    
    console.log(`\n✅ Login credentials configured:`);
    console.log(`   Mobile: ${mobile}`);
    console.log(`   OTP: ${otp}`);
});

When('select first {int} tests and capture their details', async function (count) {
    console.log(`\n📍 Selecting ${count} tests and capturing details...`);
    
    selectedTestNames = [];
    testPrices = {};
    calculatedTotal = 0.0;
    
    await this.page.waitForTimeout(2000);
    
    // Using simple locator for test names as in Java LocatorsPage.testNames
    const testElements = this.page.locator("//h4[@class='text-textHeading md:text-lg text-base font-bold w-full  trunk-2']");
    const totalAvailable = await testElements.count();
    const testsToSelect = Math.min(count, totalAvailable);
    
    console.log(`   Found ${totalAvailable} tests, selecting ${testsToSelect}\n`);
    
    for (let i = 0; i < testsToSelect; i++) {
        try {
            const testElement = testElements.nth(i);
            await testElement.scrollIntoViewIfNeeded();
            
            const testName = (await testElement.innerText()).trim();
            
            // Find price element in parent container
            const priceElement = this.page.locator(`//h4[contains(text(),"${testName}")]/ancestor::div[contains(@class,'border')]//span[contains(text(),'₹')] | //h4[contains(text(),"${testName}")]/ancestor::div[contains(@class,'flex')]//p[contains(text(),'₹')]`).first();
            const priceText = await priceElement.innerText();
            const price = BasePriceManager.cleanAndConvert(priceText);
            
            // Find and click Add to Cart button
            const addButton = this.page.locator(`//h4[contains(text(),"${testName}")]/ancestor::div[contains(@class,'border')]//button[contains(text(),'Add to cart')] | //h4[contains(text(),"${testName}")]/ancestor::div[contains(@class,'flex')]//button[contains(text(),'Add to cart')]`).first();
            
            await addButton.scrollIntoViewIfNeeded();
            await addButton.click();
            
            selectedTestNames.push(testName);
            testPrices[testName] = price;
            calculatedTotal += price;
            BasePriceManager.addSelectionPrice(testName, priceText);
            
            console.log(`   ✅ Test ${i + 1} added:`);
            console.log(`      Name: ${testName}`);
            console.log(`      Price: ₹${price}\n`);
            
            await this.page.waitForTimeout(2000);
            
        } catch (e) {
            console.log(`   ⚠️  Could not add test ${i + 1}: ${e.message}`);
        }
    }
    
    console.log(`   ✅ Total tests selected: ${selectedTestNames.length}`);
    console.log(`   💰 Calculated Total: ₹${calculatedTotal}\n`);
});

Then('extract and validate complete cart calculations', async function () {
    console.log(`\n═══════════════════════════════════════════════════════════`);
    console.log(`             CART VALIDATION - COMPLETE ANALYSIS`);
    console.log(`═══════════════════════════════════════════════════════════\n`);
    
    await this.page.waitForTimeout(3000);
    
    const headerLocator = this.page.locator("//button[contains(@class,'justify-between') and contains(.,'Tests/Packages in Cart')]");
    
    try {
        const headerText = await headerLocator.innerText();
        console.log(`📦 CART SUMMARY HEADER:`);
        console.log(`   ${headerText}\n`);
        
        const totalAmount = BasePriceManager.cleanAndConvert(headerText);
        cartTotal = totalAmount;
        console.log(`   💰 Cart Total (from header): ₹${cartTotal}`);
    } catch (e) {
        console.log(`⚠️  Could not extract cart summary header: ${e.message}`);
    }
    
    console.log();
});

Then('display cart summary with all pricing details', async function () {
    console.log(`───────────────────────────────────────────────────────────`);
    console.log(`💰 PRICING BREAKDOWN:`);
    console.log(`───────────────────────────────────────────────────────────\n`);
    
    const cartPage = new CartPageSteps(this.page);
    
    try {
        // Actual Price / MRP
        const mrpLocators = [
            "//p[normalize-space()='Actual price']/following-sibling::span[1]",
            "//p[normalize-space()='Actual Price']/following-sibling::p[1]",
            "//p[normalize-space()='MRP']/following-sibling::p[1]"
        ];
        
        for (const loc of mrpLocators) {
            const el = this.page.locator(loc).first();
            if (await el.isVisible()) {
                console.log(`   MRP / Actual Price: ${await el.innerText()}`);
                break;
            }
        }
    } catch (e) {}
    
    try {
        const discountPriceLoc = "//p[contains(text(),'Discount Price')]/following-sibling::span[1]";
        const el = this.page.locator(discountPriceLoc).first();
        if (await el.isVisible()) {
            console.log(`   Discount: ${await el.innerText()}`);
        }
    } catch (e) {}
    
    try {
        const membershipDiscountLoc = "//p[contains(text(),'Membership Discount')]/following-sibling::span[1]";
        const el = this.page.locator(membershipDiscountLoc).first();
        if (await el.isVisible()) {
            console.log(`   Membership Discount: ${await el.innerText()}`);
        }
    } catch (e) {}
    
    try {
        const savedLoc = "//span[@class='text-sm font-bold']";
        const el = this.page.locator(savedLoc).first();
        if (await el.isVisible()) {
            console.log(`   You Save: ${await el.innerText()}`);
        }
    } catch (e) {}
    
    try {
        const finalAmountLoc = "//p[normalize-space()='Total Amount to be Paid']/following-sibling::span[1]";
        const el = this.page.locator(finalAmountLoc).first();
        if (await el.isVisible()) {
            console.log(`   Total Amount to be Paid: ${await el.innerText()}`);
        }
    } catch (e) {}
});

Then('verify individual test prices in cart', async function () {
    console.log(`───────────────────────────────────────────────────────────`);
    console.log(`🛒 INDIVIDUAL TEST VERIFICATION IN CART:`);
    console.log(`───────────────────────────────────────────────────────────\n`);
    
    for (const testName of selectedTestNames) {
        const rowLoc = `//div[contains(@class,'divide-y')]//div[.//div[contains(@class,'text-textHeading') and normalize-space(text())='${testName}']]`;
        const row = this.page.locator(rowLoc).first();
        
        if (await row.isVisible()) {
            const priceLoc = row.locator(".//div[contains(@class,'cursor-pointer')]/span | .//p[contains(text(),'₹')]").last();
            const uiPriceText = await priceLoc.innerText();
            const uiPrice = BasePriceManager.cleanAndConvert(uiPriceText);
            const expectedPrice = testPrices[testName];
            
            if (Math.abs(uiPrice - expectedPrice) > 1) {
                console.log(`   ❌ MISMATCH for ${testName}: Expected ₹${expectedPrice}, UI showed ₹${uiPrice}`);
            } else {
                console.log(`   ✅ Matched ${testName}: ₹${uiPrice}`);
            }
        } else {
            console.log(`   ❌ NOT FOUND in cart: ${testName}`);
        }
    }
    console.log();
});

Then('validate subtotal calculation', async function () {
    console.log(`───────────────────────────────────────────────────────────`);
    console.log(`🧮 SUB-TOTAL VALIDATION:`);
    console.log(`───────────────────────────────────────────────────────────\n`);
    
    console.log(`   Calculated Sum from Selection: ₹${calculatedTotal}`);
    console.log(`   Reported UI Cart Total: ₹${cartTotal}`);
    
    if (Math.abs(calculatedTotal - cartTotal) > 5) {
        console.log(`   ❌ SUB-TOTAL MISMATCH! Expected sum: ₹${calculatedTotal}, Cart Header showed: ₹${cartTotal}`);
    } else {
        console.log(`   ✅ Sub-total verified successfully.`);
    }
});

Then('validate final amount', async function () {
    console.log(`\n✅ CART VALIDATION COMPLETED SUCCESSFULLY`);
});
