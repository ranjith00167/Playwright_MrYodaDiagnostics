class BasePriceManager {
    constructor() {
        this.selectionPrices = [];
        this.checkoutPrices = [];
        this.testNames = [];
        this.totalAmount = 0;
        this.memberTestMap = new Map(); // firstName -> [testNames]
        this.unitPrices = new Map(); // testName -> price
    }

    reset() {
        this.selectionPrices = [];
        this.checkoutPrices = [];
        this.testNames = [];
        this.totalAmount = 0;
        this.memberTestMap.clear();
        this.unitPrices.clear();
    }

    resetCheckoutOnly() {
        this.checkoutPrices = [];
    }

    addSelectionPrice(testName, price) {
        this.testNames.push(testName);
        this.selectionPrices.push(this.cleanAndConvert(price));
    }

    addCheckoutTestPrice(testName, price) {
        this.checkoutPrices.push(this.cleanAndConvert(price));
    }

    cleanAndConvert(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        if (!priceStr) return 0;
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    }

    getSelectionPrices() {
        return this.selectionPrices;
    }

    getTotalSelectionAmount() {
        return this.selectionPrices.reduce((a, b) => a + b, 0);
    }

    // New methods for multi-member logic
    addMemberTest(firstName, testName) {
        if (!this.memberTestMap.has(firstName)) {
            this.memberTestMap.set(firstName, []);
        }
        this.memberTestMap.get(firstName).push(testName);
    }

    getMemberTests(firstName) {
        return this.memberTestMap.get(firstName) || [];
    }

    getAllMemberNames() {
        return Array.from(this.memberTestMap.keys());
    }

    addUnitPrice(testName, price) {
        this.unitPrices.set(testName, this.cleanAndConvert(price));
    }

    getUnitPrice(testName) {
        return this.unitPrices.get(testName) || 0;
    }

    getAllTestsUnique() {
        return Array.from(this.unitPrices.keys());
    }

    getTotalTestCount(testName) {
        let count = 0;
        for (let tests of this.memberTestMap.values()) {
            count += tests.filter(t => t.includes(testName)).length;
        }
        return count;
    }
}

module.exports = new BasePriceManager();
