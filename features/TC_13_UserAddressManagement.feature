@diagnostics @profile @user_address
Feature: User Address Management in Profile Page

  Background:
    Given the user is on the login page

  # ============================================
  # NEW USER REGISTRATION & ADDRESS ADDITION
  # ============================================
  @NewUserRegistration @registration_with_address @comprehensive_validation
  Scenario: Place a lab visit for a single member with comprehensive registration validation
    # Step 1: Create new account
    Given load the excel data for single member and lab visit for a new user
    When create an account with random mobile number
    And click on the submit button
    And find whether the account holder is member or non member
    And click on the profile icon
    Then validate whether the user is a new user by checking the presence of welcome message
    
    # Step 2: Profile Registration with Comprehensive Validation
    When click the profile registration icon
    And the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name  in registration page
    And the user selects gender
    And the user enters date of birth  in registration page
    
    # DOB Field Validations
    Then validate DOB field accepts the entered date
    And validate DOB field is not empty
    And validate DOB matches the value entered from Excel
    And validate DOB field shows correct date format
    And validate the calculated age is correct for the DOB entered
    
    # Form Completeness Validations
    And validate all mandatory registration fields are filled
    And validate submit button is enabled
    And validate terms and conditions checkbox can be selected
    
    # Submit Registration
    When the user clicks on submit button
    Then the new member should be added successfully
    
    # Profile Display Validations
    And validate the profile name matches with the registered name
    And validate the age should be correct based on DOB entered
    And validate the gender should be correct based on selection
    And validate the mobile number should be correct based on registration
    # And validate complete profile information is displayed correctly
    
    # Step 3: Add address for newly registered user (Required for lab visit booking)
    When the user clicks on the profile icon
    And the user navigates to view profile page
    When the user clicks on add address button in profile
    And the user enters complete address
    When the user clicks save button for address
    Then validate success message appears for address save
    And validate address is displayed in profile address list

    # ============================================
  @user_address_positive @add_single_address
  Scenario: Add single address in user profile successfully
    Given load the excel data for user address with single address
    When the user enters otp
    And click on the submit button
    When the user clicks on the profile icon
    And the user navigates to view profile page
    And the user clicks on add address button in profile
    And the user enters complete address from excel data
    When the user clicks save button for address
    Then validate success message appears for address save
    And validate address is displayed in profile address list
