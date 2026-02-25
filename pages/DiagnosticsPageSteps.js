class DiagnosticsPageSteps {
    constructor(page) {
        this.page = page;
        // Exact locators from Locators.java
        this.searchTestField = page.locator("//input[@placeholder='Search Test Here']");
        this.viewAll_BestSeller = page.locator("//h3[contains(text(),'Best Seller')]//following::p[text()='View All'][1]");
        this.bestSellerViewAll = this.viewAll_BestSeller; // Alias for consistency in steps
        this.globalSearchTestLocator = page.locator("//div[contains(@class,'search-result')]//h4");
        this.globalSearchIndividualTestPriceLocator = page.locator("//div[contains(@class,'search-result')]//p[contains(text(),'₹')]");
        this.addToCartButton = page.locator("//button[text()='Add to cart']");
        this.cart_logo = page.locator("//img[@alt='Cart']");
        this.checkoutButton = page.locator("//button[text()='Checkout']");
        this.members_tab = page.locator("//p[text()='Members'][1]");
        this.proceed_cart = page.locator("//div[contains(@class,'overflow-y-auto')]//button[normalize-space()='Proceed']");
        this.locationText = page.locator("//div[contains(@class,'custom-select')]//span[@title]");
        this.searchLabLocationField = page.locator("//input[@placeholder='Search Lab Locations...']");
        this.location_proceed = page.locator("//div[contains(@class,'overflow-y-auto')]//button[normalize-space()='Proceed']");
        this.checkoutSummaryHeader = page.locator("//button[contains(@class,'justify-between') and contains(.,'Tests/Packages in Cart')]");
        this.membership_star_icon = page.locator("//img[contains(@src, 'profile-star')]");
        this.checkout_Total_price = page.locator("//p[@class='text-sm font-semibold text-textHeading']");
        this.saveAmount = page.locator("//span[@class='text-sm font-bold']");
        this.actualPriceCart = page.locator("//p[normalize-space()='Actual Price']/following-sibling::p[1]");
        this.MRP = page.locator("//p[normalize-space()='MRP']/following-sibling::p[1]");
        this.memberElements = page.locator("//div[@class='flex flex-wrap gap-2 mt-1']//*[self::span or self::div][normalize-space(text())]");
        this.locationPopupOkButton = page.locator("//button[text()='OK']");
        this.labVisitButton = page.locator("//button[text()='Lab Visit']");
        this.homeSampleButton = page.locator("//button[text()='Home Sample']");
        this.particularHomeLocationBox = page.locator("//input[@placeholder='Search Locations...']//following::div[1]");
        this.amountToPay = page.locator("//p[normalize-space()='Amount to pay']/following-sibling::p[1]");
    }
}

module.exports = { DiagnosticsPageSteps };
