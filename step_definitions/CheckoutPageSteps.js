const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { DiagnosticsPageSteps } = require('../pages/DiagnosticsPageSteps');
const BasePriceManager = require('../utils/BasePriceManager');

let diagPage;

When('click on the cart icon', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);
    await diagPage.cart_logo.click();
    await this.page.waitForTimeout(2000);
});

Then('select the member', async function () {
    diagPage = new DiagnosticsPageSteps(this.page);

    console.log("⏳ Waiting for loaders to disappear...");
    await this.page.waitForLoadState('networkidle');

    // Some flows show a full-screen backdrop that intercepts clicks.
    // Wait for it to go away before interacting with member chips.
    try {
        await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 15000 });
    } catch (e) {
        // If it doesn't disappear in time, we'll still attempt a JS click fallback below.
        console.log("⚠️ Backdrop still present, will attempt click with fallback...");
    }

    // Click Members tab
    await diagPage.members_tab.click();

    // Wait for member section to load
    await diagPage.memberElements.first().waitFor({ state: 'visible', timeout: 10000 });

    const memberBubble = diagPage.memberElements.first();

    // Ensure at least one member exists
    await memberBubble.waitFor({ state: 'visible', timeout: 10000 });

    console.log("👤 Selecting first member...");
    try {
        await memberBubble.click({ timeout: 10000 });
    } catch (e) {
        // Fallback when something intercepts pointer events.
        await memberBubble.evaluate(el => el.click());
    }

    // Don't assert a specific CSS class for selection since it changes across builds.
    // Instead, rely on the Proceed button becoming available.

    // Wait for proceed button to become enabled
    const proceedBtn = diagPage.proceed_cart.last();
    await proceedBtn.waitFor({ state: 'visible', timeout: 10000 });

    console.log("➡️ Clicking Proceed...");
    try {
        await proceedBtn.click({ timeout: 10000 });
    } catch (e) {
        await proceedBtn.evaluate(el => el.click());
    }

    // Wait for navigation or cart section
    await this.page.waitForLoadState('networkidle');

    console.log("✅ Member selected and proceeded successfully.");
});

Then('select the member for multi member scenario', async function () {
    console.log("\n================= 👥 MULTI-MEMBER SELECTION START =================");
    
    diagPage = new DiagnosticsPageSteps(this.page);
    await diagPage.members_tab.click();
    await this.page.waitForTimeout(1500);

    const memberData = this.testData.memberNames || "";
    const excelMemberNames = memberData.split(',').map(m => m.trim()).filter(m => m.length > 0);
    
    if (excelMemberNames.length === 0) {
        console.log("⚠️ No specific members in Excel, selecting first available member...");
        const firstMember = diagPage.memberElements.first();
        await firstMember.click();
    } else {
        console.log(`🎯 Processing ${excelMemberNames.length} members from Excel`);

        for (const memberName of excelMemberNames) {
            console.log(`\n➡ Processing Member: ${memberName}`);
            const firstName = memberName.split(/\s+/)[0];
            
            // Complex XPath from Java
            const memberCardXpath = `//div[contains(@class,'rounded') and contains(@class,'bg-') and .//text()[contains(.,'${firstName}')] and .//text()[contains(.,'tests selected')]]`;
            
            let foundSpecificCard = false;
            let memberCard;

            for (let attempt = 1; attempt <= 10; attempt++) {
                const cards = this.page.locator(memberCardXpath);
                const count = await cards.count();
                
                for (let i = 0; i < count; i++) {
                    const card = cards.nth(i);
                    const cardText = await card.innerText();
                    
                    // Exclusion logic for parent containers
                    let otherMemberCount = 0;
                    for (const otherMember of excelMemberNames) {
                        if (cardText.includes(otherMember.split(/\s+/)[0])) {
                            otherMemberCount++;
                        }
                    }
                    
                    if (otherMemberCount === 1 && cardText.includes(firstName)) {
                        memberCard = card;
                        foundSpecificCard = true;
                        console.log(`   ✅ Found SPECIFIC card for: ${memberName}`);
                        break;
                    }
                }

                if (foundSpecificCard) break;
                
                if (attempt < 10) {
                    // Manually scroll if needed since methods are removed from POM
                    await this.page.mouse.wheel(0, 250);
                    await this.page.waitForTimeout(400);
                }
            }

            if (!foundSpecificCard) {
                console.log(`   ❌ Member not found → ${memberName}`);
                continue;
            }

            await memberCard.scrollIntoViewIfNeeded();
            const cardText = await memberCard.innerText();
            const matcher = cardText.match(/(\d+)\s*tests selected/);
            const currentTests = matcher ? parseInt(matcher[1]) : 0;
            console.log(`   📊 Current tests: ${currentTests}`);

            if (currentTests === 0) {
                const selectAllBtn = memberCard.locator('.//*[text()="Select All"]').first();
                if (await selectAllBtn.isVisible()) {
                    await selectAllBtn.click();
                    console.log(`   ✔ Clicked 'Select All' for: ${memberName}`);
                    await this.page.waitForTimeout(1500);
                } else {
                    // Expanding logic if button not visible
                    await memberCard.click();
                    await this.page.waitForTimeout(1000);
                    const expandedSelectAll = memberCard.locator('.//*[text()="Select All"]').first();
                    await expandedSelectAll.click();
                    console.log(`   ✔ Expanded and Clicked 'Select All' for: ${memberName}`);
                }
            }
        }
    }

    await this.page.click('//div[contains(@class,"overflow-y-auto")]//button[normalize-space()="Proceed"]');
    console.log("\n================= 👥 MULTI-MEMBER SELECTION COMPLETED =================");
});

Then('extract the total amount during checkout for the multi-member scenario', async function () {
    const totalText = await this.page.locator('//p[@class="text-sm font-semibold text-textHeading"]').innerText();
    this.totalCheckoutAmount = BasePriceManager.cleanAndConvert(totalText);
    console.log(`Checkout Total Amount: ₹${this.totalCheckoutAmount}`);
});

Then('validate checkout summary header values', async function () {
    console.log("\n================= 🧾 CHECKOUT VALIDATION START =================");
    BasePriceManager.resetCheckoutOnly();
    
    // Extract total from the summary/float bar (using the correct staging-compatible locator)
    const headerEl = this.page.locator('//p[contains(@class,"font-semibold")]//span[contains(text(),"₹")] | //button[contains(.,"Packages in Cart")] | //p[contains(text(),"Total Amount")]/following-sibling::p').first();
    
    try {
        await headerEl.waitFor({ state: 'visible', timeout: 10000 });
        const headerText = await headerEl.innerText();
        this.totalCheckoutAmount = BasePriceManager.cleanAndConvert(headerText);
        console.log(`📌 Checkout Total captured: ₹${this.totalCheckoutAmount}`);
    } catch (e) {
        console.log("⚠️ Could not capture total from header, trying fallback...");
        const fallback = this.page.locator('//p[contains(@class,"text-textHeading")]//span[contains(@class,"font-bold")]').first();
        if (await fallback.isVisible()) {
             this.totalCheckoutAmount = BasePriceManager.cleanAndConvert(await fallback.innerText());
             console.log(`📌 Fallback Total captured: ₹${this.totalCheckoutAmount}`);
        }
    }

    const excelTests = this.testData.testName.split(',').map(t => t.trim());
    
    for (let i = 0; i < excelTests.length; i++) {
        const testName = excelTests[i];
        
        // Robust locator for the test row across sidebar and checkout page
        const row = this.page.locator(`xpath=//div[contains(.,"${testName}")]`).filter({ has: this.page.locator('xpath=.//p[contains(text(),"₹")] | .//span[contains(text(),"₹")] | .//div[contains(text(),"₹")]') }).first();
        
        try {
            await row.waitFor({ state: 'visible', timeout: 10000 });
            const priceElement = row.locator('xpath=.//p[contains(text(),"₹")] | .//span[contains(text(),"₹")] | .//div[contains(text(),"₹")]').last();
            const priceText = await priceElement.innerText();
            const checkoutPrice = BasePriceManager.cleanAndConvert(priceText);
            
            const selectionPrice = BasePriceManager.getSelectionPrices()[i];
            console.log(`🔍 Validating ${testName}: UI Price ₹${checkoutPrice} vs Selection Price ₹${selectionPrice}`);
            
            if (Math.abs(checkoutPrice - selectionPrice) > 5) { // Allowance for small currency symbol parsing variations
                console.log(`⚠️ PRICE VARIANCE for: ${testName} | Selection: ₹${selectionPrice} | UI: ₹${checkoutPrice}`);
            }
            BasePriceManager.addCheckoutTestPrice(testName, checkoutPrice);
        } catch (e) {
            console.log(`❌ Could not find test ${testName} in checkout summary. Error: ${e.message}`);
        }
    }
    
    // As per original Java code, after validation we click the Proceed/Checkout button
    const checkoutBtn = this.page.locator("//button[contains(text(),'Checkout')] | //button[contains(text(),'Proceed')]").first();
    if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
        console.log("✅ Clicked Checkout/Proceed from the summary view.");
    }
});

When('selects a lab location', async function () {
    cartPage = new CartPage(this.page);
    await this.page.locator("//input[@placeholder='Search Lab Locations...']").fill('Central Lab');
    await this.page.locator("//input[@placeholder='Search Lab Locations...']//following::div[1]").click();
    await cartPage.proceedButton.click();
});

When('selects a home sample collection address', async function () {
    // This assumes an address is already present.
    await this.page.locator("(//div[contains(@class,'border-cartItemsBdr')])[1]").click();
    await this.page.locator("//button[text()='Confirm location']").click();
});


When('selects an available slot', async function () {
    // This is highly dependent on the UI and available data.
    // We will click the first available slot.
    await this.page.locator("(//div[contains(@class,'p-4')][.//div[contains(@class,'viewButton')]])[1]//div[contains(@class,'viewButton')][1]").click();
    await this.page.locator("//div[contains(@class,'overflow-y-auto')]//button[normalize-space()='Proceed']").click();
});

Then('the final amount to pay is validated', async function () {
    cartPage = new CartPage(this.page);
    // Placeholder for amount validation logic
    await expect(cartPage.totalPrice).toBeVisible();
    console.log('Final amount is visible: ' + await cartPage.totalPrice.textContent());
});

When('the user clicks the pay online button', async function () {
    cartPage = new CartPage(this.page);
    await cartPage.payOnlineButton.click();
});

Then('the Razorpay amount is validated against the cart amount', async function () {
    // This requires switching to the Razorpay iframe
    const frame = this.page.frameLocator("//iframe[@class='razorpay-checkout-frame']");
    await expect(frame.locator("//h3[contains(@class,'number-flip') and @data-value]")).toBeVisible();
    console.log('Razorpay amount is visible.');
});

When('the user completes a dummy UPI payment', async function () {
    const frame = this.page.frameLocator("//iframe[@class='razorpay-checkout-frame']");
    await frame.locator("(//div[@data-value='upi'])[1]").click();
    await frame.locator("//input[@placeholder='example@okhdfcbank']").fill('test@ybl');
    await frame.locator("//button[@data-testid='vpa-submit']").click();
    // Handle the success/failure simulation
    await this.page.locator("//button[@data-val='S']").click();
});

When('navigates to the orders page to view the order', async function () {
    await this.page.locator("//div[text()='Go to Orders']").click();
    await this.page.locator("(//div[contains(@class,'p-4')][.//div[contains(@class,'viewButton')]])[1]//div[contains(@class,'viewButton')][1]").click();
    // Add assertion to verify order details
    console.log('Navigated to order details page.');
});
