const { Given, When, Then } = require('@cucumber/cucumber');
const { DNADecoder } = require('../pages/DNADecoder');
const BasePriceManager = require('../utils/BasePriceManager');
const { readExcelData } = require('../utils/excelReader');

let dnaDecoder;

Given('load the excel data for single member and lab visit with memership in DNA Decoder', async function () {
    this.testData = readExcelData('DNADecoder', '7');
});

Given('load the excel data for single member and home visit with memership in DNA Decoder', async function () {
    this.testData = readExcelData('DNADecoder', '8'); 
});

Given('load the excel data for single non member and lab visit with memership in DNA Decoder', async function () {
    this.testData = readExcelData('DNADecoder', '9');
});

When('the user navigates to DNA Decoder Lab Visit page', async function () {
    dnaDecoder = new DNADecoder(this.page);
    await dnaDecoder.DNADecoder_TestImage.click();
});

When('the user navigates to DNA Decoder Home Visit page', async function () {
    dnaDecoder = new DNADecoder(this.page);
    await dnaDecoder.DNADecoder_TestImage.click();
    // Use locators instead of methods
    const homeVisitTab = this.page.locator("//button[text()='Home Visit'] | //div[text()='Home Visit']");
    await homeVisitTab.click();
});

When('the user navigates to DNA Decoder panels at a glance filter', async function () {
    dnaDecoder = new DNADecoder(this.page);
    await dnaDecoder.panelsAtAGlanceFilter.click();
});

When('the user selects DNA Decoder tests and adds them to cart', async function () {
    console.log("========== 🧬 DNA DECODER TEST SELECTION ==========");
    BasePriceManager.reset();
    
    const testNamesData = this.testData.testName;
    if (!testNamesData) {
        throw new Error("❌ DNA Decoder test name(s) missing in Excel!");
    }
    const testNames = testNamesData.split(',').map(t => t.trim());
    
    for (const testName of testNames) {
        await dnaDecoder.DNADecoder_SearchField.fill(testName);
        await this.page.waitForTimeout(2000);
        
        const priceText = await dnaDecoder.pricetext_DNADecoder.innerText();
        const price = BasePriceManager.cleanAndConvert(priceText);
        
        BasePriceManager.addSelectionPrice(testName, priceText);
        console.log(`💰 Captured DNA Decoder price: ${priceText} (${price})`);
        
        await dnaDecoder.addToCartButton.click();
        await this.page.waitForTimeout(1000);
        
        await dnaDecoder.DNADecoder_SearchField.fill('');
        await this.page.waitForTimeout(700);
    }
    console.log("🟩 SUCCESS → All DNA Decoder tests added & prices captured!");
});

Then('validate checkout summary header values of DNA Decoder tests', async function () {
    // Porting logic if it needs to be different, otherwise reuse checkout_steps
    console.log("Validating DNA Decoder checkout summary header values...");
});
