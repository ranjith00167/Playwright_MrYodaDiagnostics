class PaymentPageSteps {
    constructor(page) {
        this.page = page;
        // Exact locators from Locators.java
        this.payOnlineButton = page.locator("//button[text()='Pay Online']");
        this.payInCashButton = page.locator("//button[text()='Pay in Cash']");
        this.amountToPay = page.locator("//p[normalize-space()='Amount to pay']/following-sibling::p[1]");
        this.razorpayFrame = page.frameLocator("//iframe[@class='razorpay-checkout-frame']");
        this.razorpayAmountLabel = this.razorpayFrame.locator("//h3[contains(@class,'number-flip') and @data-value]");
        this.paymentUpiOption = this.razorpayFrame.locator("(//div[@data-value='upi'])[1]");
        this.paymentCardOption = this.razorpayFrame.locator("//div[@data-value='card']");
        this.paymentWalletOption = this.razorpayFrame.locator("(//div[@data-value='wallet'])");
        this.mobikwikOption = this.razorpayFrame.locator("//span[text()='Mobikwik']");
        this.vpaInput = this.razorpayFrame.locator("//input[@id='vpa-bpa']");
        this.emailInput = this.razorpayFrame.locator("//input[@inputmode='email']");
        this.continueButton = this.razorpayFrame.locator("//button[text()='Continue']");
        this.payNowButton = this.razorpayFrame.locator("//button[contains(text(),'Pay Now')]");
        this.successButton = this.razorpayFrame.locator("//button[text()='Success']");
        this.failureButton = this.razorpayFrame.locator("//button[text()='Failure']");
        this.goToOrdersButton = page.locator("//button[contains(text(),'Go to Orders')] | //div[contains(text(),'Go to Orders')]");
        this.viewOrderButton = page.locator("//button[contains(text(),'View')]").first();
    }
}

module.exports = { PaymentPageSteps };
