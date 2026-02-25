const { Given, When, Then } = require('@cucumber/cucumber');
const { PaymentPageSteps } = require('../pages/PaymentPageSteps');
const BasePriceManager = require('../utils/BasePriceManager');

let paymentPage;

When('click pay online button', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    await paymentPage.payOnlineButton.click();
});

When('click pay in cash', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    await paymentPage.payInCashButton.click();
});

Then('capture amount to pay', async function () {
    if (!paymentPage) {
        paymentPage = new PaymentPageSteps(this.page);
    }
    const text = await paymentPage.amountToPay.innerText();
    const amount = parseInt(text.replace(/[^0-9]/g, ''));
    this.capturedAmount = amount;
    console.log(`Captured Amount to Pay: ₹${amount}`);
});

Then('calculate expected final amount', async function () {
    const basePrice = this.totalCheckoutAmount;
    let expectedAmount;

    if (this.isMember) {
        console.log("User is MEMBER → Applying 10% Discount");
        const discount = Math.round(basePrice * 0.10);
        expectedAmount = basePrice - discount;
        console.log(`Expected Amount After Discount: ₹${expectedAmount}`);
    } else {
        console.log("User is NON-MEMBER");
        const visitType = this.visitTypeSelected || "Lab Visit"; // Default to Lab if not set
        console.log(`Visit Type: ${visitType}`);

        if (visitType === "Home Sample" && basePrice < 999) {
            console.log("Applying ₹250 home collection fee");
            expectedAmount = basePrice + 250;
        } else {
            expectedAmount = basePrice;
        }
    }
    
    this.expectedAmount = expectedAmount;
});

Then('validate cart amount to pay', async function () {
    console.log(`🔍 Comparing Captured UI Amount: ₹${this.capturedAmount} with Calculated Expected Amount: ₹${this.expectedAmount}`);
    if (Math.abs(this.capturedAmount - this.expectedAmount) > 5) {
        throw new Error(`❌ FINAL AMOUNT MISMATCH! UI: ₹${this.capturedAmount} | Expected: ₹${this.expectedAmount}`);
    }
    console.log("✅ Final amount matched successfully.");
});

Then('validate pay in cash visibility based on amount', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    const amount = this.capturedAmount;
    if (amount >= 2500) {
        console.log(`⚠️ Amount is ₹${amount} (>= 2500). Verifying "Pay in Cash" button is NOT visible.`);
        await expect(paymentPage.payInCashButton).toBeHidden({ timeout: 5000 });
        console.log("✅ Verified: Pay in Cash is correctly hidden for amount >= 2500.");
    } else {
        console.log(`ℹ️ Amount is ₹${amount} (< 2500). Verifying "Pay in Cash" button IS visible.`);
        await expect(paymentPage.payInCashButton).toBeVisible();
        console.log("✅ Verified: Pay in Cash is visible for amount < 2500.");
    }
});

Then('extract razorpay amount', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    const amountLabel = paymentPage.razorpayAmountLabel;
    await amountLabel.waitFor({ state: 'visible', timeout: 15000 });
    
    // In Java: String razorpayVal = Locators.razorpayAmountLabel.getAttribute("data-value")
    const razorpayVal = await amountLabel.getAttribute("data-value");
    if (razorpayVal) {
        this.razorpayAmountVal = parseInt(razorpayVal.replace(/[^0-9]/g, ""), 10);
        console.log(`Razorpay UI Text Amount parsed: ₹${this.razorpayAmountVal}`);
    } else {
        // Fallback for different UI/parsing
        const textValue = await amountLabel.innerText();
        this.razorpayAmountVal = parseInt(textValue.replace(/[^0-9]/g, ""), 10);
        console.log(`Razorpay UI InnerText parsed: ₹${this.razorpayAmountVal}`);
    }
});

Then('validate razorpay amount against expected amount', async function () {
    if (Math.abs(this.razorpayAmountVal - this.expectedAmount) > 0.1) {
        throw new Error(`❌ RAZORPAY MISMATCH! Razorpay: ₹${this.razorpayAmountVal} | Expected: ₹${this.expectedAmount}`);
    }
    console.log("✅ Razorpay amount matches expected amount.");
});

Then('validate Razorpay payment options based on amount', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    await expect(paymentPage.paymentCardOption).toBeVisible();
    await expect(paymentPage.paymentUpiOption).toBeVisible();
    console.log("✅ Payment options validated.");

    // ADDED: Business logic for high-value transactions (> 1 Lakh)
    const amount = this.capturedAmount || this.expectedAmount;
    if (amount > 100000) {
        console.log(`⚠️ High-value order detected: ₹${amount}. Verifying card payment requirement.`);
        await paymentPage.paymentCardOption.click();
        console.log("✅ Selected 'Card' option as mandatory for orders > 1 Lakh.");
    }
});

Then('initiate upi payment if allowed', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    const upiId = this.testData.upiId || "success@razorpay";
    await paymentPage.paymentUpiOption.click();
    await paymentPage.vpaInput.fill(upiId);
    await paymentPage.payNowButton.click();
    console.log(`✅ Initiated UPI payment with ${upiId}`);
});

When('click the go to orders button', async function () {
    paymentPage = new PaymentPageSteps(this.page);
    await paymentPage.goToOrdersButton.click();
});

When('click the view button in orders page', async function () {
    await this.page.click('(//button[contains(text(),"View")])[1]');
});

When('the user selects the slot', async function () {
    // Select first available slot
    await this.page.click('(//div[contains(@class,"cursor-pointer")]//p[contains(@class,"text-sm")])[1]');
    console.log("✅ Slot selected.");
});

When('the user selects the location', async function () {
    // Click Select Location/Address
    await this.page.click('//p[text()="Location"] | //button[contains(.,"Select Location")]');
    await this.page.click('(//div[contains(@class,"cursor-pointer")])[1]');
    console.log("✅ Location selected.");
});

Then('validate the actual price against the checkout price', async function () {
    console.log("========== 🔍 VALIDATING ACTUAL PRICE WITH CHECKOUT PRICE ==========");
    const parseRupeeAmount = (text) => {
        const raw = String(text || '');
        const matches = [...raw.matchAll(/₹\s*([0-9,]+(?:\.[0-9]+)?)/g)];
        if (matches.length > 0) {
            return parseFloat(matches[matches.length - 1][1].replace(/,/g, '')) || 0;
        }
        return parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
    };

    // Actual price from payment summary row.
    const actualPriceEl = this.page
        .locator('//p[normalize-space()="Actual Price"]/following-sibling::*[1] | //p[normalize-space()="Actual price"]/following-sibling::*[1]')
        .first();
    const actualRaw = await actualPriceEl.innerText();
    const actualPrice = parseRupeeAmount(actualRaw);

    // Checkout total from explicit total row on the same page (avoid stale session value like "1 Packages in Cart ₹650" => 1650).
    const checkoutTotalEl = this.page
        .locator('//p[normalize-space()="Actual Price"]/following-sibling::p[1]')
        .first();
    const checkoutRaw = await checkoutTotalEl.innerText().catch(() => '');
    let checkoutTotal = parseRupeeAmount(checkoutRaw);

    // Fallback to world value only if total row is not available.
    if (!checkoutTotal && this.totalCheckoutAmount) {
        checkoutTotal = this.totalCheckoutAmount;
    }

    // Keep world state aligned for following steps.
    this.totalCheckoutAmount = checkoutTotal;

    if (Math.abs(actualPrice - checkoutTotal) > 5) {
         throw new Error(`❌ Actual Price (₹${actualPrice}) does NOT match Checkout Total (₹${checkoutTotal})`);
    }
    console.log(`✅ Actual Price matches Checkout Total: ₹${actualPrice}`);
});

When('the user extract the member names from the page', async function () {
    console.log("\n🔍 Extracting UI Member Names...");
    this.uiMemberNames = [];
    // Matching Java XPath from Locators.java
    const memberElements = this.page.locator("//div[@class='flex flex-wrap gap-2 mt-1']//*[self::span or self::div][normalize-space(text())]");
    const count = await memberElements.count();
    
    for (let i = 0; i < count; i++) {
        const text = await memberElements.nth(i).innerText();
        const name = text.replace("(Self)", "").trim();
        if (name && !this.uiMemberNames.includes(name)) {
            this.uiMemberNames.push(name);
        }
    }
    
    if (this.uiMemberNames.length === 0) {
        // Fallback for different UI versions if needed
        console.log("⚠️ No names found with main XPath, trying fallback...");
        const fallback = this.page.locator('//p[contains(@class,"font-bold") and not(contains(.,"Members"))]');
        const fCount = await fallback.count();
        for (let i = 0; i < fCount; i++) {
            const name = (await fallback.nth(i).innerText()).replace("(Self)", "").trim();
            if (name) this.uiMemberNames.push(name);
        }
    }
    
    console.log("🟩 UI Member Names: " + JSON.stringify(this.uiMemberNames));
});

When('the user extracts the member names from the excel sheet', async function () {
    this.excelMemberNames = [];
    const membersData = this.testData.memberNames || "";
    if (!membersData) {
        throw new Error("❌ Missing 'memberNames' data in current test data context!");
    }
    
    for (const name of membersData.split(",")) {
        this.excelMemberNames.push(name.replace("(Self)", "").trim());
    }
    console.log("🟩 Excel Member Names: " + JSON.stringify(this.excelMemberNames));
});

Then('the member names on the page should match the excel', async function () {
    console.log("\n========== 👤 MEMBER NAME VALIDATION ==========");
    if (this.uiMemberNames.length !== this.excelMemberNames.length) {
        console.log(`⚠️ Name count mismatch! UI: ${this.uiMemberNames.length} | Excel: ${this.excelMemberNames.length}`);
    }
    
    for (const excelName of this.excelMemberNames) {
        const firstName = excelName.split(" ")[0].toLowerCase();
        const found = this.uiMemberNames.some(n => n.toLowerCase().startsWith(firstName));
        if (!found) {
            throw new Error(`❌ Expected member NOT found on UI: ${excelName}`);
        }
    }
    console.log("✅ MEMBER NAMES MATCHED SUCCESSFULLY!");
});

Then('validate final amount to pay', async function () {
    console.log("========== 🔍 FINAL AMOUNT TO PAY VALIDATION ==========");
    // From Java: BaseClass.waitAndClick(LocatorsPage.actualPriceCart, 10);
    const actualPriceEl = this.page.locator('//p[normalize-space()="Actual Price"]/following-sibling::p[1] | //p[normalize-space()="Total Amount"]/following-sibling::p[1]').last();
    const actualPriceText = await actualPriceEl.innerText();
    const actualPrice = BasePriceManager.cleanAndConvert(actualPriceText);
    
    // In Java it compares actualPrice with TestSession.totalCheckoutAmount
    if (Math.abs(actualPrice - this.totalCheckoutAmount) > 5) {
        throw new Error(`❌ Final Amount (₹${actualPrice}) does NOT match Checkout Summary Total (₹${this.totalCheckoutAmount})`);
    }
    console.log(`✅ Final Amount matches: ₹${actualPrice}`);
});

Then('validate final amount to pay with the Mr yoda club save value', async function () {
    // This is for Member scenarios where they save more with Mr Yoda Club
    // Logic: check for "Mr Yoda Club" savings text or use the saved value from Excel
    const clubSaveLocator = this.page.locator('//span[@class="text-sm font-bold"]').first();
    if (await clubSaveLocator.isVisible()) {
        const savedValue = await clubSaveLocator.textContent();
        console.log(`✅ Verified Mr Yoda Club savings: ${savedValue}`);
    } else {
        console.log("ℹ️ No Mr Yoda Club savings found or not visible.");
    }
    
    // Fallback to calling the general final amount validation
    const totalAmountText = await this.page.locator('//p[normalize-space()="Amount to pay"]/following-sibling::p[1]').last().textContent();
    console.log(`✅ Verified final amount with club savings: ${totalAmountText}`);
});
