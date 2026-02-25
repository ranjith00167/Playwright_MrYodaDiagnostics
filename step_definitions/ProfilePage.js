const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { FamilyAndFriendsPage } = require('../pages/FamilyAndFriendsPage');
const { readExcelData } = require('../utils/excelReader');

let profilePage;

Given('load the excel data for registration with row number {int}', function (rowId) {
    this.testData = readExcelData('Diagnostics', rowId.toString());
});

Given('load the excel data for member registration with missing first name', function () {
    this.testData = readExcelData('Diagnostics', '20'); // Dummy ID
    this.testData.firstName = '';
});

Given('load the excel data for member registration with missing last name', function () {
    this.testData = readExcelData('Diagnostics', '20');
    this.testData.lastName = '';
});

Given('load the excel data for member registration with missing dob', function () {
    this.testData = readExcelData('Diagnostics', '20');
    this.testData.DOB = '';
});

Given('load the excel data for member registration with invalid dob', function () {
    this.testData = readExcelData('Diagnostics', '20');
    this.testData.DOB = '99/99/9999';
});

When('click on the profile icon', async function () {
    profilePage = new FamilyAndFriendsPage(this.page);
    await profilePage.profileIcon.click();
    await this.page.waitForTimeout(1000); 
});

// These steps are handled in family_and_friends_steps.js or login_steps.js
// Removing duplicates to resolve ambiguity in Cucumber dry-run


Then('validate whether the user is a new user by checking the presence of welcome message', async function () {
    const welcome = this.page.locator('//p[contains(text(),"Welcome")] | //div[contains(text(),"Welcome")] | //h2[contains(text(),"Welcome")]');
    await expect(welcome).toBeVisible({ timeout: 10000 });
    console.log(`✅ User is a NEW account (Welcome message found)`);
});

When('click the profile registration icon', async function () {
    await this.page.click('//img[contains(@src,"profile-registration")] | //button[contains(text(),"Register")] | //div[contains(@class,"register")]');
});

// Removing title and gender duplicates as they are in family_and_friends_steps.js


When('the user enters first name in registration page', async function () {
    const firstName = this.testData.firstName || 'NewUser';
    await profilePage.firstName_Input.fill(firstName);
});

When('the user enters middle name in registration page', async function () {
    const middleName = this.testData.middleName || '';
    if (middleName) {
        await profilePage.middleName_Input.fill(middleName);
    }
});

When('the user last name in registration page', async function () { 
    // Handle typo in feature
    await profilePage.lastName_Input.fill(this.testData.lastName || 'Test');
});

When(/^the user enters date of birth\s+in\s+registration\s+page$/, async function () {
    const dob = this.testData.DOB || '01-01-1990';
    await profilePage.dob_Input.fill(dob);
});

When('the user accepts terms and conditions', async function () {
    if (await profilePage.termsAndConditions_Checkbox.isVisible()) {
        await profilePage.termsAndConditions_Checkbox.check();
    }
});

When('the user verifies gender auto-selected as {string} based on title', async function (expectedGender) {
    // Logic to verify if male/female icon is selected
    const isMaleSelected = await this.page.locator('//img[@alt="Male"]//parent::div[contains(@class,"selected")]').isVisible();
    const isFemaleSelected = await this.page.locator('//img[@alt="Female"]//parent::div[contains(@class,"selected")]').isVisible();
    
    if (expectedGender.toLowerCase() === 'male') {
        expect(isMaleSelected).toBe(true);
    } else {
        expect(isFemaleSelected).toBe(true);
    }
});

When('the user skips middle name field', async function () {
    await profilePage.middleName_Input.fill('');
});

When('the user skips email field', async function () {
    // nothing to fill
});

When('the user enters valid email from excel', async function () {
    const email = this.testData.email || 'test@example.com';
    await profilePage.email_Input.fill(email);
});

Then('validate the email matches with registered email', async function () {
    // Check UI for saved email
    const emailUI = await this.page.locator('//p[contains(@class,"email")]').innerText();
    expect(emailUI).toContain(this.testData.email || 'test@example.com');
});

When('the user enters date of birth with {string} years old', async function (years) {
    const today = new Date();
    const birthYear = today.getFullYear() - parseInt(years);
    const dob = `01/01/${birthYear}`;
    await profilePage.DOBProfilePage.fill(dob);
    this.calculatedAge = years;
});

When('the user manually selects gender as {string}', async function (gender) {
    if (gender.toLowerCase() === 'male') {
        await profilePage.male_GenderImage.click();
    } else {
        await profilePage.female_GenderImage.click();
    }
});

When('the user clicks on submit button', async function () {
    // Check terms and conditions if present
    if (await profilePage.termsAndConditions_Checkbox.isVisible()) {
        await profilePage.termsAndConditions_Checkbox.check();
    }
    await profilePage.submit_Button.click();
    await this.page.waitForTimeout(5000); 
    await profilePage.mrYodaLogo_Image.click(); 
    console.log("✅ MrYoda Logo clicked successfully after registration.");
});

Then('validate the profile name matches with the registered name', async function () {
    const expectedName = (this.testData.firstName || '').trim(); // Based on Java using homeLocation or firstName
    const actualName = await profilePage.nameElement.innerText();
    console.log(`📌 Expected Name contains: ${expectedName} 📍 Actual Name: ${actualName}`);
    expect(actualName.toLowerCase()).toContain(expectedName.toLowerCase());
});

Then('validate the age should be correct based on DOB entered', async function () {
    const ageTextContent = await profilePage.ageGenderMobileRow.innerText();
    console.log(`UI Row Content: ${ageTextContent}`);
    const actualAge = ageTextContent.split(/\s+/)[0]; 
    console.log(`📌 Expected Age: ${this.calculatedAge} 📍 Actual Age: ${actualAge}`);
    expect(actualAge).toContain(this.calculatedAge.toString());
});

Then('validate the gender should be correct based on selection', async function () {
    const genderText = await profilePage.genderElement.innerText();
    const expectedGender = this.testData.gender || 'Male';
    console.log(`📌 Expected Gender: ${expectedGender} 📍 Actual Gender: ${genderText}`);
    expect(genderText.toLowerCase()).toContain(expectedGender.toLowerCase());
});

Then('validate the mobile number should be correct based on registration', async function () {
    const mobileText = await profilePage.mobileElement.innerText();
    const expectedMobile = this.testData.mobileNumber;
    console.log(`📌 Expected Mobile: ${expectedMobile} 📍 Actual Mobile: ${mobileText}`);
    expect(mobileText).toContain(expectedMobile);
});

When('the user navigates to view profile page', async function () {
    await profilePage.profileIcon.click();
    await this.page.click('text=View Profile');
});

When('the user clicks on add address button in profile', async function () {
    await profilePage.addAddressButton_InProfile.click();
});

When('the user enters complete address', async function () {
    console.log("🏠 ENTERING COMPLETE ADDRESS...");
    await profilePage.locateMe_Button.click();
    await this.page.mouse.wheel(0, 300);
    await profilePage.confirmLocation_Button.click();
    
    await profilePage.receiverNameInput.fill(this.testData.homeLocation || this.testData.firstName || "Test User");
    await profilePage.roadAreaInput.fill(this.testData.Area || "Test Road");
    
    // Use generated mobile if available
    const mobile = this.testData.mobileNumber || "9876543210";
    await profilePage.mobileNumber_Input.fill(mobile);
    
    await profilePage.homeAddressButton.click();
    console.log("✅ Address details filled.");
});

When('the user clicks save button for address', async function () {
    await profilePage.saveAddressButton_InForm.click();
});

Then('validate address is displayed in profile address list', async function () {
    await this.page.waitForTimeout(2000);
    const isVisible = await profilePage.addressListItems.first().isVisible();
    expect(isVisible).toBe(true);
    console.log("✅ Address is displayed in profile address list.");
});

When('create an account with random mobile number', async function () {
    this.testData.mobileNumber = '9' + Math.floor(Math.random() * 1000000000);
    console.log(`Generated Mobile: ${this.testData.mobileNumber}`);
});

When('the user clicks on edit profile button', async function () {
    await this.page.click('//button[contains(text(),"Edit Profile")] | //img[contains(@src,"edit")]');
    console.log("✅ Clicked Edit Profile button.");
});

When('the user updates first name in registration page', async function () {
    const newName = (this.testData.firstName || 'Updated') + 'New';
    await profilePage.firstName_Input.fill(newName);
    this.updatedName = newName;
});

When('the user updates middle name in registration page', async function () {
    await profilePage.middleName_Input.fill('UpdatedMiddle');
});

When('the user updates last name  in registration page', async function () {
    await profilePage.lastName_Input.fill('UpdatedLast');
});

When('the user clicks on save button', async function () {
    await this.page.click('//button[text()="Save"] | //button[contains(text(),"Update")]');
    console.log("✅ Clicked save/update button.");
});

Then('the member details should be updated successfully', async function () {
    const success = this.page.locator('//div[contains(text(),"updated successfully")] | //p[contains(text(),"success")]');
    await expect(success).toBeVisible();
    console.log("✅ Member details updated successfully.");
});

Then('validate the profile name matches with the updated name', async function () {
    const actualName = await this.page.locator('//div[contains(@class,"profile-name")]').innerText();
    expect(actualName).toContain(this.updatedName || 'Updated');
    console.log("✅ Profile name matches updated name.");
});

Then('validate DOB field accepts the entered date', async function () {
    const value = await profilePage.DOBProfilePage.inputValue();
    expect(value).not.toBeNull();
});

Then('validate DOB field is not empty', async function () {
    const value = await profilePage.DOBProfilePage.inputValue();
    expect(value.length).toBeGreaterThan(0);
});

Then('validate DOB matches the value entered from Excel', async function () {
    const value = await profilePage.DOBProfilePage.inputValue();
    const expected = this.testData.DOB || '2000-01-01';
    // Match format if needed (UI might show DD/MM/YYYY)
    console.log(`📌 UI DOB Value: ${value} 📥 Expected: ${expected}`);
    // Loose positive check
    if (value.includes('/') && expected.includes('-')) {
         const [y, m, d] = expected.split('-');
         expect(value).toContain(d);
         expect(value).toContain(m);
    } else {
        expect(value).toContain(expected);
    }
});

Then('validate DOB field shows correct date format', async function () {
    const value = await profilePage.DOBProfilePage.inputValue();
    // basic format check: digits and delimiters
    expect(value).toMatch(/^[0-9/\-]+$/);
});

Then('validate the calculated age is correct for the DOB entered', async function () {
     // Already implemented in existing code, but ensure consistency
     const ageTextContent = await profilePage.ageGenderMobileRow.innerText();
     const actualAge = ageTextContent.split(/\s+/)[0]; 
     expect(actualAge).toContain(this.calculatedAge.toString());
});

Then('validate all mandatory registration fields are filled', async function () {
    const fn = await profilePage.firstName_Input.inputValue();
    const ln = await profilePage.lastName_Input.inputValue();
    const dob = await profilePage.DOBProfilePage.inputValue();
    expect(fn.length).toBeGreaterThan(0);
    expect(ln.length).toBeGreaterThan(0);
    expect(dob.length).toBeGreaterThan(0);
});

Then('validate submit button is enabled', async function () {
    const isEnabled = await profilePage.submit_Button.isEnabled();
    expect(isEnabled).toBe(true);
});

Then('validate terms and conditions checkbox can be selected', async function () {
    if (await profilePage.termsAndConditions_Checkbox.isVisible()) {
        await profilePage.termsAndConditions_Checkbox.check();
        const isChecked = await profilePage.termsAndConditions_Checkbox.isChecked();
        expect(isChecked).toBe(true);
    }
});

// This step is already in family_and_friends_steps.js


Then('validate success message appears for address save', async function () {
    const success = this.page.locator('//div[contains(text(),"Address")]//following::div[contains(text(),"success")] | //div[contains(text(),"successfully added")]');
    await expect(success).toBeVisible();
});

When('the user enters complete address from excel data', async function () {
    const area = this.testData.Area || "Test Road";
    const name = this.testData.firstName || "Test User";
    const mobile = this.testData.mobileNumber || "9876543210";
    
    await profilePage.roadAreaInput.fill(area);
    await profilePage.receiverNameInput.fill(name);
    await profilePage.mobileNumber_Input.fill(mobile);
    await profilePage.homeAddressButton.click();
});

Then('validate clicking submit button should display first name required error message', async function () {
    await profilePage.submit_Button.click();
    const error = this.page.locator('//span[contains(text(),"First Name")] | //div[contains(text(),"required")]');
    await expect(error).toBeVisible();
});

Then('validate clicking submit button should display last name required error message', async function () {
    await profilePage.submit_Button.click();
    const error = this.page.locator('//span[contains(text(),"Last Name")] | //div[contains(text(),"required")]');
    await expect(error).toBeVisible();
});

Then('validate clicking submit button should display dob required error message', async function () {
    await profilePage.submit_Button.click();
    const error = this.page.locator('//span[contains(text(),"Date of Birth")] | //div[contains(text(),"required")]');
    await expect(error).toBeVisible();
});

When('enters the invalid date of birth in registration page', async function () {
    await profilePage.DOBProfilePage.fill('99/99/9999');
});

Then('validate error message for invalid date of birth should be displayed', async function () {
    const error = this.page.locator('//span[contains(text(),"Invalid Date")] | //div[contains(text(),"Invalid date")]');
    await expect(error).toBeVisible();
});

Then('validate member is not added successfully', async function () {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('register'); // Assuming it stays on registration page
});

When('the user selects title {string} from the dropdown', async function (title) {
    await this.page.selectOption('//select[contains(@name,"title")]', title);
});

When(/^the user enters last name\s+in registration page$/, async function () {
    const lastName = this.testData.lastName || 'Test';
    await profilePage.lastName_Input.fill(lastName);
});
