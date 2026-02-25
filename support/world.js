// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/support/world.js
const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');

// Make Playwright expect globally available for step files that reference it without import.
global.expect = expect;

class CustomWorld extends World {
  constructor(options) {
    super(options);
    // You can attach properties to the world here
  }

  async openBrowser() {
  this.browser = await chromium.launch({
    headless: process.env.CI ? true : false,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  this.context = await this.browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 17.4485, longitude: 78.3908 }
  });

  this.page = await this.context.newPage();
}

async closeBrowser() {
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
}

  async dismissPopups() {
    try {
      const popups = [
        this.page.locator("//button[contains(@class,'swal2-confirm')]"),
        this.page.locator("//button[text()='OK']"),
        this.page.locator("//button[contains(text(),'Allow')]"),
        this.page.locator("//div[contains(@class,'swal2-container')]")
      ];

      for (const popup of popups) {
        if (await popup.isVisible({ timeout: 2000 })) {
          console.log("👋 Dismissing a popup...");
          if (await popup.tagName() === 'BUTTON') {
             await popup.click();
          } else {
             // If it's the container, try clicking outside or pressing Escape
             await this.page.keyboard.press('Escape');
          }
          await this.page.waitForTimeout(500);
        }
      }
    } catch (e) {
      // Ignore failures in popup dismissal
    }
  }
}

setWorldConstructor(CustomWorld);
