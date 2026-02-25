const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { DiagnosticsPageSteps } = require('../pages/DiagnosticsPageSteps');
const { HomePageSteps } = require('../pages/HomePageSteps');
const BasePriceManager = require('../utils/BasePriceManager');

let diagnosticsPage;
let homePage;

When('click the smart choice banner search', async function () {
    diagnosticsPage = new DiagnosticsPageSteps(this.page);
    await this.page.click('//div[contains(@class,"smart-choice")]//button | //img[contains(@alt,"Smart Choice")]');
});

When('click the smart choice banner search again', async function () {
    await this.page.click('//div[contains(@class,"smart-choice")]//button | //img[contains(@alt,"Smart Choice")]');
});

When('click the smart choice  banner search', async function () {
    await this.page.click('//div[contains(@class,"smart-choice")]//button | //img[contains(@alt,"Smart Choice")]');
});

When('select the home location', async function () {
    console.log("📍 Selecting home location...");

    // If an overlay/backdrop is present, it can block clicks.
    try {
        await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 8000 });
    } catch (e) {}

    // UI has multiple variants; support both.
    const selectLocationBtn = this.page
        .locator('//input[@placeholder="Search Locations..."]')
        .first();

    await selectLocationBtn.waitFor({ state: 'visible', timeout: 15000 });
    try {
        await selectLocationBtn.click({ timeout: 5000 });
    } catch (e) {
        await selectLocationBtn.click({ force: true });
    }

    // Pick the first location option.
    const firstResult = this.page.locator('//div[contains(@class,"cursor-pointer border-cartItemsBdr")]').first();
    await firstResult.waitFor({ state: 'visible', timeout: 15000 });
    await firstResult.click({ force: true });

    await this.page.waitForTimeout(2000); // small settle wait
    const proceed = this.page.locator('//button[contains(@class,"bg-primary") and normalize-space()="Proceed"]').first();

    // If a backdrop overlay exists, wait for it to hide so it doesn't intercept clicks.
    try {
        await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 8000 });
    } catch (e) {}

    const hardClick = async (locator, { tries = 8, delayMs = 400 } = {}) => {
        let lastErr;
        for (let i = 1; i <= tries; i++) {
            // If overlay/backdrop intercepts clicks, give it a chance to disappear.
            try {
                await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 1500 });
            } catch (e) {}

            try {
                await locator.scrollIntoViewIfNeeded();
            } catch (e) {}

            try {
                // Extra stability: small wait for animations
                await this.page.waitForTimeout(100);
                await locator.click({ trial: true, timeout: 1500 }).catch(() => {});

                await locator.click({ timeout: 2000 });
                return;
            } catch (e) {
                lastErr = e;
            }

            try {
                await locator.click({ force: true, timeout: 2000 });
                return;
            } catch (e) {
                lastErr = e;
            }

            try {
                await locator.evaluate((el) => el.click());
                return;
            } catch (e) {
                lastErr = e;
            }

            await this.page.waitForTimeout(delayMs);
        }
        throw lastErr ?? new Error('hardClick failed');
    };

    if (await proceed.isVisible().catch(() => false)) {
        await proceed.waitFor({ state: 'visible', timeout: 15000 });
        await hardClick(proceed);
    } else {
        await proceedFallback.waitFor({ state: 'visible', timeout: 15000 });
        await hardClick(proceedFallback);
    }

    await this.page.waitForTimeout(2000); // small settle wait
    console.log("✅ Home location selected.");
});

When('select a random test package', async function () {
    await this.page.click('(//button[contains(@class,"addtocartButton")])[1]');
    console.log("✅ Random test package selected.");
});

When('select a random test package', async function () {
    await this.page.click('(//button[contains(@class,"addtocartButton")])[1]');
    console.log("✅ Random test package selected.");
});

When('click Add to cart for the selected package', async function () {
    // Already clicked in 'select a random test package' or handle here
});

Then('verify the package is added to cart successfully', async function () {
    const cartCount = await this.page.locator('//span[contains(@class,"cart-count")]').innerText();
    expect(parseInt(cartCount)).toBeGreaterThan(0);
});

When('click the global search', async function () {
    diagnosticsPage = new DiagnosticsPageSteps(this.page);
    await diagnosticsPage.searchTestField.click();
});

When('select the location', async function () {
    homePage = new HomePageSteps(this.page);
    console.log("📍 Starting location selection...");
    // Sometimes a loader backdrop-blur-xs appears. Wait for it to disappear if it exists.
    try {
        await this.page.waitForSelector('.backdrop-blur-xs', { state: 'hidden', timeout: 5000 });
    } catch (e) {
        console.log("⚠️ Backdrop still visible or not found, proceeding with caution...");
    }

    const locBtn = this.page.locator('//p[text()="Select Location"]').first();
    console.log("📍 Waiting for location button to be visible...");
    await locBtn.waitFor({ state: 'visible', timeout: 10000 });
    console.log("📍 Clicking location button...");
    await locBtn.click({ force: true });
    
    // Type "madhapur" into the search field as per original Selenium logic
    const searchInput = this.page.locator('//input[@placeholder="Search Lab Locations..." or @placeholder="Search Locations..." or @placeholder="Search for Lab Locations..."]');
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('madhapur');
    await this.page.waitForTimeout(2000); // Wait for the list to filter
    
    // Wait for the result and select it (first result after search)
    // Looking for a more specific result item if possible, or just click the first relative div
    const resultItem = this.page.locator('.border.rounded-xl').first();
    await resultItem.waitFor({ state: 'visible', timeout: 10000 });
    await resultItem.click({ force: true });
    
    console.log("📍 Result clicked. Waiting for any loaders and for Proceed button...");
    await this.page.waitForTimeout(2000);

    // Click Proceed
    const proceedBtn = this.page.locator('//button[contains(@class,"addtocartButton") and normalize-space()="Proceed"]').first();
    
    // Check if there is another backdrop after selection
    try {
        await this.page.waitForSelector('.backdrop-blur-xs', { state: 'hidden', timeout: 3000 });
    } catch (e) {}

    await proceedBtn.waitFor({ state: 'visible', timeout: 10000 });
    await proceedBtn.click({ force: true });
    console.log('📍 Location selection completed.');
});

When('select the slot', async function () {
    homePage = new HomePageSteps(this.page);
    console.log("⏰ Starting slot selection...");
    await this.page.waitForTimeout(1500);

    const hardClick = async (locator, { tries = 8, delayMs = 350 } = {}) => {
        let lastErr;
        for (let i = 1; i <= tries; i++) {
            try {
                await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 1500 });
            } catch (e) {}
            try {
                await locator.scrollIntoViewIfNeeded();
            } catch (e) {}
            try {
                await locator.waitFor({ state: 'visible', timeout: 3000 });
            } catch (e) {
                lastErr = e;
                await this.page.waitForTimeout(delayMs);
                continue;
            }

            try {
                await locator.click({ trial: true, timeout: 1500 }).catch(() => {});
                await locator.click({ timeout: 2000 });
                return;
            } catch (e) {
                lastErr = e;
            }
            try {
                await locator.click({ force: true, timeout: 2000 });
                return;
            } catch (e) {
                lastErr = e;
            }
            try {
                await locator.evaluate((el) => el.click());
                return;
            } catch (e) {
                lastErr = e;
            }
            await this.page.waitForTimeout(delayMs);
        }
        throw lastErr ?? new Error('hardClick failed');
    };
    
    // Strict slot panel from provided DOM.
    const slotPanel = this.page
        .locator('div.flex-1.overflow-y-auto.px-2')
        .filter({ has: this.page.locator('h2:has-text("Select Time Slot")') })
        .first();
    await slotPanel.waitFor({ state: 'visible', timeout: 15000 });

    // Wait for any network/loader to settle a bit.
    try {
        await this.page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 8000 });
    } catch (e) {}

    const dates = slotPanel
        .locator('div.swiper-wrapper div.swiper-slide button')
        .filter({ visible: true });

    await dates.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
        console.log("⚠️ Date bubbles not found in swiper.");
    });

    const dateCount = await dates.count();
    console.log(`📅 Found ${dateCount} date elements in slot swiper.`);

    if (dateCount === 0) {
        // Attach diagnostics so we can tune selectors quickly.
        try {
            const shot = await this.page.screenshot({ fullPage: true });
            await this.attach(shot, 'image/png');
        } catch (e) {}
        try {
            const html = await this.page.content();
            await this.attach(html, 'text/html');
        } catch (e) {}
        throw new Error('❌ No date elements found on slot screen (can\'t select slots).');
    }

    const maxDatesToTry = Math.min(dateCount, 7);

    // Quick debug: print a few date candidate texts so we can tune selectors.
    try {
        const sample = Math.min(dateCount, 10);
        for (let k = 0; k < sample; k++) {
            const t = ((await dates.nth(k).innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
            if (t) console.log(`   📌 date[${k}]: ${t}`);
        }
    } catch (e) {}
    for (let i = 0; i < maxDatesToTry; i++) {
        const date = dates.nth(i);
        const dateTextRaw = await date.innerText().catch(() => "");
        const dateText = (dateTextRaw || '').replace(/\s+/g, ' ').trim();

        // Skip non-date buttons (empty text, nav, or very long labels)
        if (!dateText) continue;
        if (/^(home|cart|proceed|confirm|book)$/i.test(dateText)) continue;
        if (dateText.length > 40) continue;

        // Prefer real-looking day/date chips (e.g. "Thu 20", "20 Feb", "20")
        const looksLikeDate =
            /\b(mon|tue|wed|thu|fri|sat|sun)\b/i.test(dateText) ||
            /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(dateText) ||
            /\b\d{1,2}\b/.test(dateText);
        if (!looksLikeDate) continue;
        
        console.log(`👉 Checking date: ${dateText.replace(/\n/g, ' ')}`);
        
        await hardClick(date);
        await this.page.waitForTimeout(800);

        // Strict slot grid from provided DOM.
        const slotButtons = slotPanel
            .locator('div.grid.grid-cols-2.lg\\:grid-cols-3.gap-3.mt-2 > button')
            .filter({ visible: true });

        // Give the slot grid a moment to render for this date.
        await this.page.waitForTimeout(700);
        const slotCount = await slotButtons.count();

        // Debug: print some slot candidate texts after selecting the date.
        try {
            const sampleSlots = Math.min(slotCount, 12);
            for (let k = 0; k < sampleSlots; k++) {
                const t = ((await slotButtons.nth(k).innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
                if (t) console.log(`   🕒 slot[${k}]: ${t}`);
            }
        } catch (e) {}

        if (slotCount === 0) {
            // Attach early diagnostics for this date.
            try {
                const shot = await this.page.screenshot({ fullPage: true });
                await this.attach(shot, 'image/png');
            } catch (e) {}
            try {
                const html = await this.page.content();
                await this.attach(html, 'text/html');
            } catch (e) {}
        }
        if (slotCount > 0) {
            // Pick the first available slot (skip completed/disabled)
            let selectedSlot = null;
            for (let j = 0; j < slotCount; j++) {
                const s = slotButtons.nth(j);
                const text = ((await s.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
                const isTimeLike = /^\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)$/i.test(text);
                if (!isTimeLike) continue;

                // Detect disabled slots
                const isDisabled = await s.isDisabled().catch(() => false);
                const ariaDisabled = await s.getAttribute('aria-disabled').catch(() => null);
                const looksDisabled = await s.evaluate((el) => {
                    const style = window.getComputedStyle(el);
                    const cls = (el.getAttribute('class') || '').toLowerCase();
                    const cursor = (style.cursor || '').toLowerCase();
                    const pointerEvents = (style.pointerEvents || '').toLowerCase();
                    return (
                        el.hasAttribute('disabled') ||
                        el.getAttribute('aria-disabled') === 'true' ||
                        cursor.includes('not-allowed') ||
                        pointerEvents === 'none' ||
                        cls.includes('disabled') ||
                        cls.includes('pointer-events-none')
                    );
                }).catch(() => false);

                if (isDisabled || ariaDisabled === 'true' || looksDisabled) continue;

                const isEnabled = await s.isEnabled().catch(() => true);
                if (!isEnabled) continue;

                selectedSlot = s;
                break;
            }

            if (selectedSlot) {
                const slotText = ((await selectedSlot.innerText().catch(() => '')) || '').trim();
                console.log(`✅ Selected Slot: ${slotText}`);

                // Click until it *sticks* (UI usually changes border/bg when selected).
                const wasSelected = async () => {
                    return await selectedSlot.evaluate((el) => {
                        const cls = (el.getAttribute('class') || '').toLowerCase();
                        const pressed = el.getAttribute('aria-pressed');
                        const selected = el.getAttribute('data-selected');
                        const style = window.getComputedStyle(el);
                        // heuristics: many UIs toggle bg/border on selection
                        return (
                            pressed === 'true' ||
                            selected === 'true' ||
                            cls.includes('bg-') ||
                            cls.includes('border-primary') ||
                            cls.includes('border-[#03c1364d]') ||
                            style.backgroundColor !== 'rgba(0, 0, 0, 0)'
                        );
                    }).catch(() => false);
                };

                for (let attempt = 1; attempt <= 3; attempt++) {
                    await hardClick(selectedSlot);
                    await this.page.waitForTimeout(400);
                    if (await wasSelected()) break;
                    if (attempt === 3) {
                        console.log('⚠️ Slot click did not show selected state; continuing anyway.');
                    }
                }
				
                await this.page.waitForTimeout(800);
				
                // Proceed/Confirm button
                const slotProceed = this.page
                    .getByRole('button', { name: /Proceed|Confirm|Book/i })
                    .filter({ hasNotText: /Add to cart/i })
                    .last();
                await slotProceed.waitFor({ state: 'visible', timeout: 10000 });
                await hardClick(slotProceed);
                console.log("✅ Slot selection confirmed.");
                return;
            }
        }
        console.log("   No available (enabled) slots found for this date. Moving to next date...");

        // If we're at the last date, attach diagnostics before failing.
        if (i === maxDatesToTry - 1) {
            try {
                const shot = await this.page.screenshot({ fullPage: true });
                await this.attach(shot, 'image/png');
            } catch (e) {}
            try {
                const html = await this.page.content();
                await this.attach(html, 'text/html');
            } catch (e) {}
        }
    }
    throw new Error("❌ No available slots found in the next 7 days!");
    await this.page.locator("//button[contains(@class,'bg-primary') and normalize-space()='Proceed']").click();
    console.log("✅ Slot selection completed.");
});

When('the user clicks on the profile icon', async function () {
    await this.page.click('//button[contains(@class, "profile")] | //div[contains(@class, "profile")]');
});
