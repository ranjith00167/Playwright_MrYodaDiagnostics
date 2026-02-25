const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { UserAddressPageSteps } = require('../pages/UserAddressPageSteps');
const { HomePageSteps } = require('../pages/HomePageSteps');
const { readExcelData } = require('../utils/excelReader');

let addressPage;
let homePage;

When('I navigate to the profile page', async function () {
    homePage = new HomePageSteps(this.page);
    await homePage.profileIcon.click();
    await homePage.viewProfileButton.click();
});

When('I click to add a new address', async function () {
    addressPage = new UserAddressPageSteps(this.page);
    await addressPage.addAddressButton.click();
});

When('I fill in the new address details', async function () {
    addressPage = new UserAddressPageSteps(this.page);
    await addressPage.receiverNameInput.fill(this.testData.fullName || "Test User");
    await addressPage.mobileNumberInput.fill(this.testData.mobileNumber || "9876543210");
    await addressPage.pinCodeInput.fill(this.testData.pinCode || "560001");
    // Using mapping for addressLine1 input
    await addressPage.addressLine1Input.fill(this.testData.addressName || "123 Street");
    await addressPage.cityInput.fill(this.testData.city || "Bangalore");
    await addressPage.stateInput.fill(this.testData.state || "Karnataka");
});

When('I save the new address', async function () {
    addressPage = new UserAddressPageSteps(this.page);
    await addressPage.saveAddressButton.click();
});

When('select address and proceed to pay', async function () {
    console.log("\n================= 🏠 ADDRESS SELECTION START =================");
    
    addressPage = new UserAddressPageSteps(this.page);
    // In Java, it searches for a card matching the address name from Excel
    const addressName = this.testData.addressName || "Home";
    const addressCardXpath = `//div[contains(@class,'cursor-pointer')]//p[normalize-space(text())='${addressName}']`;
    
    console.log(`🎯 Looking for address: ${addressName}`);
    
    const addressCard = this.page.locator(addressCardXpath).first();
    await addressCard.scrollIntoViewIfNeeded();
    await addressCard.click();
    console.log(`✅ Selected address: ${addressName}`);
    
    await this.page.waitForTimeout(1000);
    
    // In Java: "Proceed to pay" button
    const proceedToPayBtn = this.page.locator('//button[normalize-space()="Proceed to pay"]');
    await proceedToPayBtn.click();
    console.log("✅ Clicked Proceed to Pay");
    
    // Select payment mode (always COD in the automation)
    const codXpath = '//p[normalize-space()="Pay on Collection"] | //p[normalize-space()="Cash on Delivery"]';
    await this.page.locator(codXpath).first().click();
    console.log("✅ Selected COD");
    
    await this.page.click('//button[normalize-space()="Proceed"]');
    console.log("✅ Final Proceed Clicked");
    console.log("================= 🏠 ADDRESS SELECTION COMPLETED =================");
});

Given('load the excel data for user address scenario {string}', async function (scenarioKey) {
    this.testData = readExcelData('UserAddress', scenarioKey);
});

// Specific loaders for TC_14 Address Manager
Given('load the excel data for user address with single address', async function () {
    this.testData = readExcelData('UserAddress', 'single_address');
});

Given('load the excel data for user address with multiple addresses', async function () {
    this.testData = readExcelData('UserAddress', 'multiple_addresses');
});

Given('load the excel data for user address editing', async function () {
    this.testData = readExcelData('UserAddress', 'edit_address');
});

Given('load the excel data for user address deletion', async function () {
    this.testData = readExcelData('UserAddress', 'delete_address');
});

Given('load the excel data for user address persistence', async function () {
    this.testData = readExcelData('UserAddress', 'address_persistence');
});

Given('load the excel data for user address as default', async function () {
    this.testData = readExcelData('UserAddress', 'set_default');
});

Given('load the excel data for user address view all', async function () {
    this.testData = readExcelData('UserAddress', 'view_all');
});

Given('load the excel data for user address missing name', async function () {
    this.testData = readExcelData('UserAddress', 'missing_name');
});

Given('load the excel data for user address missing city', async function () {
    this.testData = readExcelData('UserAddress', 'missing_city');
});

Given('load the excel data for user address missing pin', async function () {
    this.testData = readExcelData('UserAddress', 'missing_pin');
});

Given('load the excel data for user address invalid pin', async function () {
    this.testData = readExcelData('UserAddress', 'invalid_pin');
});

Given('load the excel data for user address pin length', async function () {
    this.testData = readExcelData('UserAddress', 'pin_length');
});

Given('load the excel data for user address name limit', async function () {
    this.testData = readExcelData('UserAddress', 'address_name_limit');
});

Then('the user should be on the address management page', async function () {
    await expect(this.page).toHaveURL(/.*address/);
});

Then('I should see a success message confirming the address was saved', async function () {
    const successMsg = this.page.locator('//div[contains(text(),"Address saved successfully")] | //div[contains(text(),"Success")]');
    await expect(successMsg).toBeVisible();
});
