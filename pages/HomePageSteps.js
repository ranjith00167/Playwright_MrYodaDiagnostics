// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/pages/HomePage.js

class HomePageSteps {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.viewAllBestSellers = page.locator("//h3[contains(text(),'Best Seller')]//following::p[text()='View All'][1]");
        this.searchTestInput = page.locator("//input[@placeholder='Search Test Here']");
        this.addToCartButton = page.locator("//button[text()='Add to cart']");
        this.cartIcon = page.locator("//img[@alt='Cart']");
        this.globalSearchInput = page.locator("//input[@placeholder='Search test, symptom, organ etc']");
        this.profileIcon = page.locator("//button[contains(@class,'dropbtn') and descendant::img[contains(@alt,'profile image')]]");
        this.viewProfileButton = page.locator("//a[contains(@href,'/profile') and contains(.,'View Profile')]");
        this.locationText = page.locator("//div[contains(@class,'custom-select')]//span[@title]");
        this.membershipStarIcon = page.locator("//img[contains(@src, 'profile-star')]");
    }

    /**
     * Navigates to the cart page.
     */
    async goToCart() {
        console.log("🛒 Navigating to cart...");
        await this.cartIcon.click();
        await this.page.waitForTimeout(2000); // Allow cart modal/page to load
    }
}

module.exports = { HomePageSteps };
