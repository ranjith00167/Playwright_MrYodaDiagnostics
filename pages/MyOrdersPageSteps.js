class MyOrdersPageSteps {
    constructor(page) {
        this.page = page;
        this.viewOrderButton = page.locator('//button[text()="View"] | //span[text()="View Details"]').first();
        this.rescheduleOrderButton = page.locator('//button[contains(text(),"Reschedule")]');
        this.reschedule_otp_input = page.locator('//input[@name="otp"] | //input[contains(@class,"otp-input")]');
        this.verifyAndRescheduleButton = page.locator('//button[contains(text(),"Verify & Reschedule")]');
        this.cancelOrderButton = page.locator('//button[contains(text(),"Cancel Order")]');
        this.slot_proceed = page.locator('//button[contains(text(),"Select Slot")] | //button[contains(text(),"Proceed")]');
        this.rescheduleReason = page.locator('//textarea[@placeholder="Enter reason for reschedule"]');
        this.rescheduleSubmit = page.locator('//button[contains(text(),"Submit")]');
        this.orderStatus = page.locator('//div[contains(@class,"status-badge")]');
    }
}

module.exports = { MyOrdersPageSteps };
