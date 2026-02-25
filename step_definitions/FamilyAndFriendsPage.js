const { Given, When, Then } = require('@cucumber/cucumber');
const { FamilyAndFriendsPage } = require('../pages/FamilyAndFriendsPage');

let familyPage;

Given('the user navigates to Family and Friends page', async function () {
    familyPage = new FamilyAndFriendsPage(this.page);
    await familyPage.profileIcon.click();
    await this.page.click('text=Family & Friends');
});

Given('the user clicks on Add New Member button', async function () {
    await familyPage.addNewMember_Button.click();
});

When('the user selects title from the dropdown', async function () {
    await familyPage.title_Dropdown.selectOption('Mr.');
});

When('the user enters first name', async function () {
    const firstName = this.testData?.firstName || 'AutoFirst';
    await familyPage.firstName_Input.fill(firstName);
});

When('the user enters middle name', async function () {
     const middleName = this.testData?.middleName || 'AutoMiddle';
     await familyPage.middleName_Input.fill(middleName);
});

When('the user enters last name', async function () {
    const lastName = this.testData?.lastName || 'AutoLast';
    await familyPage.lastName_Input.fill(lastName);
});

When('the user selects country code', async function () {
    // Implement if there's a specific container
});

When('the user enters mobile number', async function () {
    const mobileNumber = this.testData?.mobileNumber || '9876543210';
    await familyPage.mobileNumber_Input.fill(mobileNumber);
});

When('the user selects gender', async function () {
    await familyPage.male_GenderImage.click();
});

When('the user selects relation', async function () {
    familyPage = new FamilyAndFriendsPage(this.page);
    await familyPage.selectRelation.selectOption({ label: 'Friend' });
});

When('the user enters date of birth', async function () {
    const dob = this.testData?.DOB || '01/01/1995';
    await familyPage.dateOfBirth_Input.fill(dob);
});

When('the user enters email', async function () {
    const email = this.testData?.email || 'test@example.com';
    await familyPage.email_Input.fill(email);
});

When('the user clicks on Save button', async function () {
    await familyPage.save_Button.click();
});

Then('the new member should be added successfully', async function () {
    const successMsg = this.page.locator('//div[contains(text(),"Member added successfully")] | //p[contains(text(),"added")]');
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    console.log("✅ Member added successfully.");
});

Then('the user should see the member in the family list', async function () {
    const name = this.testData?.firstName || 'AutoFirst';
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
});

Then('a success message should be displayed', async function () {
    const successMsg = this.page.locator('//div[contains(@class,"toast")] | //div[contains(text(),"successfully")]');
    await expect(successMsg).toBeVisible();
});

When('the user uploads profile photo', async function () {
    // Implement photo upload logic
});

Then('the member card should display the profile photo', async function () {
    // Assert photo
});

Then('the user should see complete member details in the list', async function () {
    // Assert details
});

When('the user fills the form with randomly generated unique name', async function () {
    familyPage = new FamilyAndFriendsPage(this.page);
    const randomName = 'User' + Math.floor(Math.random() * 10000);
    await familyPage.firstName_Input.fill(randomName); 
    this.currentRandomName = randomName;
    console.log(`✅ Filled form with random name: ${randomName}`);
});

When('the user enters all mandatory fields with valid data', async function () {
    const randomMobile = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    await familyPage.lastName_Input.fill('AutoLast');
    await familyPage.mobileNumber_Input.fill(randomMobile);
    await familyPage.dateOfBirth_Input.fill('01/01/1990');
    await familyPage.male_GenderImage.click();
    await familyPage.relation_Dropdown.selectOption('Friend');
    console.log("✅ Entered all mandatory fields with valid data.");
});

Then('the user clicks on Add New Member button again', async function () {
    familyPage = new FamilyAndFriendsPage(this.page);
    await familyPage.addNewMember_Button.click();
});

When('the user fills all mandatory fields except mobile number', async function () {
    const randomName = 'User' + Math.floor(Math.random() * 10000);
    await familyPage.firstName_Input.fill(randomName);
    await familyPage.lastName_Input.fill('NoMobile');
    await familyPage.dateOfBirth_Input.fill('01/01/1990');
    await familyPage.male_GenderImage.click();
    await familyPage.relation_Dropdown.selectOption('Friend');
});

When('the user fills all mandatory fields', async function () {
    const randomName = 'User' + Math.floor(Math.random() * 10000);
    const randomMobile = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    await familyPage.firstName_Input.fill(randomName);
    await familyPage.lastName_Input.fill('AllFields');
    await familyPage.mobileNumber_Input.fill(randomMobile);
    await familyPage.dateOfBirth_Input.fill('01/01/1990');
    await familyPage.male_GenderImage.click();
    await familyPage.relation_Dropdown.selectOption('Friend');
});

When('the user fills the form with another randomly generated unique name', async function () {
    const randomName = 'User' + Math.floor(Math.random() * 10000);
    await familyPage.firstName_Input.fill(randomName);
    this.secondRandomName = randomName;
});

Then('the second member should be added successfully', async function () {
    // Assert second member
});

Then('both members should be visible in the family list', async function () {
    // Assert both members
});

When('the user leaves first name field empty', async function () {
    await familyPage.firstName_Input.fill('');
});

When('the user leaves last name field empty', async function () {
    await familyPage.lastName_Input.fill('');
});

Then('the form should not be submitted', async function () {
    // Assert we're still on the form
});

Then('validation error for first name should be displayed', async function () {
    // Assert validation error
});

Then('validation error for last name should be displayed', async function () {
    // Assert validation error
});

When('the user enters invalid mobile number', async function () {
    await familyPage.mobileNumber_Input.fill('123');
});

Then('validation error for mobile number should be displayed', async function () {
    // Assert mobile validation
});

When('the user enters invalid email', async function () {
    await familyPage.email_Input.fill('invalid-email');
});

Then('validation error for email should be displayed', async function () {
    // Assert email validation
});

When('the user clicks on Cancel button', async function () {
    await familyPage.cancel_Button.click();
});

Then('the add member form should be closed', async function () {
    // Assert form visibility
});

Then('the member should not be added to the list', async function () {
    // Assert member not in list
});

Then('the user should remain on Family and Friends page', async function () {
    // Assert URL or page header
});
