// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/pages/LoginPage.js

class LoginPageSteps {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginButton = page.locator("//span[text()='Login']");
        this.mobile_number = page.locator("//input[@id='phone-number']");
        this.enter_mobile_number = page.locator("//input[@placeholder='Enter Mobile Number']");
        this.getOtpButton = page.locator("//button[@aria-label='Get OTP']");
        this.otpInput = page.locator("//input[@id='otp']");
        this.submit_otp_button = page.locator("//button[@aria-label='Submit OTP']");
    }
}

module.exports = { LoginPageSteps };
