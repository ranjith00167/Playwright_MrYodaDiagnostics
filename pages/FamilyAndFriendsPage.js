const { expect } = require('@playwright/test');

class FamilyAndFriendsPage {
    constructor(page) {
        this.page = page;
        this.profileIcon = page.locator("//img[@alt='Profile Registration']//following::p[1]"); // Based on usage in steps
        this.addNewMember_Button = page.locator("//img[@alt='add member']");
        this.title_Dropdown = page.locator("//select[@id='title']");
        this.title_Option_Mr = page.locator("//option[@value='Mr.']");
        this.firstName_Input = page.locator("//input[@id='first_name']");
        this.middleName_Input = page.locator("//input[@id='middle_name']");
        this.lastName_Input = page.locator("//input[@id='last_name']");
        this.mobileNumber_Input = page.locator("//input[@id='mobile']");
        this.dateOfBirth_Input = page.locator("//input[@id='dob']");
        this.male_GenderImage = page.locator("//img[@alt='Male']");
        this.female_GenderImage = page.locator("//img[@alt='Female']");
        this.selectRelation = page.locator("//*[text()='Relation *']/following::select[1]");
        this.relation_Dropdown = page.locator("//option[@value='Friend']");
        this.save_Button = page.locator("//button[text()='Save']");
        this.email_Input = page.locator("//input[@id='email']");
        this.cancel_Button = page.locator("//button[text()='Cancel']");
        this.seeAll_Link = page.locator("//a[text()='See All']");
        
        // --- 👤 PROFILE REGISTRATION & ACCOUNT ---
        this.profile_RegistrationImage = page.locator("//img[@alt='Profile Registration']");
        this.welcomeText = page.locator("//img[contains(@src,'registerprofile')]//following::p[1]");
        this.firstNameInputProfilePage = page.locator("//input[@placeholder='Enter first name']");
        this.middleNameInputProfilePage = page.locator("//input[@placeholder='Enter middle name']");
        this.lastnameInputProfilePage = page.locator("//input[@placeholder='Enter last name']");
        this.DOBProfilePage = page.locator("//input[@placeholder='Select date']");
        this.termsAndConditions_Checkbox = page.locator("//input[@name='termsAccepted']");
        this.homeButton = page.locator("//p[text()='Home']");
        this.mrYodaLogo_Image = page.locator("//img[@alt='Mr. Yoda Logo']");
        this.globalSearch_Input = page.locator("//input[@placeholder='Search test, symptom, organ etc']");

        // --- 🏢 PROFILE VIEW & VALIDATION ---
        this.nameElement = page.locator("//div[contains(@class,'profile-name')]");
        this.genderElement = page.locator("//p[contains(@class,'gender')] | //div[contains(@class,'gender')]");
        this.ageGenderMobileRow = page.locator("//div[contains(@class,'profile')]//p[contains(.,'Male') or contains(.,'Female')]");
        this.mobileElement = page.locator("//p[contains(@class,'mobile')] | //div[contains(@class,'mobile')]");
        this.editProfileButton = page.locator("//button[text()='Edit'] | //button[text()='Edit Profile'] | //img[contains(@src,'edit')]");
        this.saveProfileButton = page.locator("//button[text()='Save'] | //button[contains(text(),'Update')]");

        // --- 🏠 ADDRESS MANAGEMENT ---
        this.addAddressButton_InProfile = page.locator("//button[contains(text(),'Add Address')] | //button[contains(text(),'Add New Address')]");
        this.locateMe_Button = page.locator("//p[text()='Locate me'] | //button[contains(.,'Locate')]");
        this.confirmLocation_Button = page.locator("//button[text()='Confirm location']");
        this.receiverNameInput = page.locator("//input[@placeholder='Receiver Name'] | //input[contains(@placeholder,'Name')]");
        this.roadAreaInput = page.locator("//input[@placeholder='House No / Road / Area'] | //input[contains(@placeholder,'Road')]");
        this.homeAddressButton = page.locator("//span[text()='Home'] | //button[text()='Home']");
        this.saveAddressButton_InForm = page.locator("//button[text()='Save'] | //button[contains(text(),'Add Address')]");
        this.addressListItems = page.locator("//div[contains(@class,'address-card')] | //div[contains(@class,'address-list')]");
    }
}

module.exports = { FamilyAndFriendsPage };
