class DNADecoder {
    constructor(page) {
        this.page = page;
        this.DNADecoder_TestImage = page.locator("//img[@alt='DNA Decoder'] | //img[contains(@src,'dna-decoder')]");
        this.DNADecoder_SearchField = page.locator("//input[@placeholder='Search for DNA Decoder tests']");
        this.pricetext_DNADecoder = page.locator("//p[@class='text-sm font-bold'] | //span[contains(@class,'dna-price')]");
        this.addToCartButton = page.locator("//button[text()='Add to cart'] | //button[contains(.,'Add to Cart')]");
        this.panelsAtAGlanceFilter = page.locator("//div[contains(text(),'Panels at a Glance')]");
    }
}

module.exports = { DNADecoder };
