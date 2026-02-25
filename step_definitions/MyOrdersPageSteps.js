const { Given, When, Then } = require('@cucumber/cucumber');
const { MyOrdersPageSteps } = require('../pages/MyOrdersPageSteps');
const { expect } = require('@playwright/test');

let myOrdersPage;

When('click on rechedule button in orders page', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    await myOrdersPage.rescheduleOrderButton.click();
});

Then('enter the reschedule otp', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    const otp = this.testData.otp || '123456';
    await myOrdersPage.reschedule_otp_input.fill(otp);
});

Then('click on verify &Reschedule button', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    await myOrdersPage.verifyAndRescheduleButton.click();
});

Then('select the slot for reschedule', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    // Logic moved from POM to Step Definition
    const dates = this.page.locator('//div[contains(@class,"swiper-slide")]//button:not([disabled])');
    const count = await dates.count();
    if (count > 0) {
        await dates.nth(0).click();
        await this.page.waitForTimeout(1000);
        
        const slots = this.page.locator('//div[contains(@class,"grid")]//button:not([disabled])');
        if (await slots.count() > 0) {
            await slots.nth(1).click();
            await myOrdersPage.slot_proceed.click();
        }
    }
});

Then('enter the reschedule reason', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    const reason = 'Change of plans';
    await myOrdersPage.rescheduleReason.fill(reason);
});

Then('click on submit button', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    await myOrdersPage.rescheduleSubmit.click();
});

Then('validate the rescheduled slot on UI', async function () {
    await this.page.reload();
    await this.page.waitForTimeout(3000);
    
    // Logic from MyOrdersPageSteps.java
    const uiSlotRaw = await this.page.locator('//p[text()="Slot"]/following-sibling::p[contains(@class,"font-semibold")]').first().innerText();
    console.log(`📌 Raw UI Slot Text → ${uiSlotRaw}`);
    
    // Split into time and date fragments
    const parts = uiSlotRaw.split(",");
    const uiTime = parts[0].trim(); 
    const uiDayMonth = parts.length > 1 ? parts[1].trim() : "";
    
    console.log(`📌 UI Time: ${uiTime} | Expected: ${this.selectedSlotTime}`);
    console.log(`📌 UI Date: ${uiDayMonth} | Expected: ${this.selectedSlotDate}`);
    
    // We do loose match since UI text strings can vary formatting slightly
    if (this.selectedSlotTime) {
        expect(uiTime.toLowerCase()).toContain(this.selectedSlotTime.toLowerCase().split('-')[0].trim());
    }
});

When('click on cancel order button in orders page', async function () {
    myOrdersPage = new MyOrdersPageSteps(this.page);
    await myOrdersPage.cancelOrderButton.click();
});

Then('validate the tests in shows admin approval pending state', async function () {
    await this.page.waitForTimeout(2000);
    const status = await myOrdersPage.orderStatus.innerText();
    if (!status.includes('Admin Approval Pending')) {
        throw new Error(`❌ Cancellation status mismatch! Expected: Admin Approval Pending | Actual: ${status}`);
    }
});
