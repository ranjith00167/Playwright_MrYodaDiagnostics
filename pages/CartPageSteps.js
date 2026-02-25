// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/pages/CartPage.js

class CartPageSteps {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.locator("//button[contains(text(),'Checkout')] | //button[contains(text(),'Proceed')]");
        this.proceedButton = page.locator("//div[contains(@class,'overflow-y-auto')]//button[normalize-space()='Proceed']");
        this.membersTab = page.locator("//p[text()='Members']");
        this.totalPrice = page.locator("//p[@class='text-sm font-semibold text-textHeading'] | //div[contains(text(),'Total Payable')]//following::div[1]");
        this.subtotalAmount = page.locator("//div[contains(text(),'Sub total')]//following::div[1]");
        this.discountAmount = page.locator("//div[contains(text(),'Discount')]//following::div[1]");
        
        // --- 🛒 EMPTY CART ---
        this.emptyCartMessage = page.locator("//h2[contains(text(),'Your cart is empty')] | //p[contains(text(),'Your cart is empty')]");
        this.shopNowButton = page.locator("//button[contains(text(),'Shop Now')]");
        
        // --- 🧪 CART ITEMS ---
        this.cartItems = page.locator("//div[contains(@class, 'divide-y')]//div[contains(@class,'flex')]");
        this.removeItemsBtn = page.locator("//button[contains(text(),'Remove')] | //div[contains(@class,'cursor-pointer') and (text()='×' or text()='Remove')] | //img[contains(@alt,'trash')]");
        this.payInCashButton = page.locator("//button[text()='Pay in Cash']");
        this.payOnlineButton = page.locator("//button[text()='Pay Online']");
    }

    /**
     * Clears all items currently in the cart.
     */
    async clearCart() {
        console.log("🧹 Starting cart cleanup loop (Thin-POM logic)...");
        
        while (true) {
            // Re-fetch remove button because DOM resets after deletion
            const removeBtn = this.removeItemsBtn.first();
            
            // Check visibility with a short timeout to see if it even exists
            if (await removeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log("  - Removing one item...");
                try {
                    await removeBtn.click({ force: true });
                    // Give UI time to update after deletion
                    await this.page.waitForTimeout(600); 
                } catch (e) {
                    console.log("  ⚠️ Click failed or element disappeared, breaking loop.");
                    break;
                }
            } else {
                console.log("  ✔ No more remove buttons found.");
                break;
            }
        }
    }
}

module.exports = { CartPageSteps };
