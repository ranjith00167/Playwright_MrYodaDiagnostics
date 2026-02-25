// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/pages/AddressPage.js

class UserAddressPageSteps {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.addAddressButton = page.locator("//img[@alt='My Addresses']");
        this.receiverNameInput = page.locator("//input[@name='receiver_name']");
        this.addressLine1Input = page.locator("//input[@name='address_line1']");
        this.roadAreaInput = page.locator("//input[@name='name']");
        this.cityInput = page.locator("//input[@name='city']");
        this.stateInput = page.locator("//input[@name='state']");
        this.pinCodeInput = page.locator("//input[@name='postal_code']");
        this.mobileNumberInput = page.locator("//input[@name='recipient_mobile_number']");
        this.saveAddressButton = page.locator("//button[@type='submit'] | //button[contains(@class,'addtocartButton')]");
        this.successMessage = page.locator("//div[@role='alert' and (contains(.,'Success') or contains(.,'saved'))] | //span[contains(text(),'Success') or contains(text(),'saved') or contains(text(),'updated')]");
    }
}

module.exports = { UserAddressPageSteps };
