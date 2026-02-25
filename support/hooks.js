const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60000); // 1 minute timeout for UI tests

Before(async function () {
    await this.openBrowser();
});

After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        try {
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
        } catch (e) {
            console.log("Could not take screenshot: " + e.message);
        }
    }
    await this.closeBrowser();
});
