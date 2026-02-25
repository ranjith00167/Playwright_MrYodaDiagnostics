@diagnostics @profile @user_registration @negative_tests
Feature: User Registration Negative Scenarios

  Background:
    Given the user is on the login page
    And create an account with random mobile number
    And click on the submit button
    And find whether the account holder is member or non member
    And click the profile registration icon

  # ============================================
  # NEGATIVE REGISTRATION SCENARIOS (MISSING INFO)
  # ============================================
  @registration_missing_first_name
  Scenario: Validate registration fails when first name is missing
    Given load the excel data for member registration with missing first name
    When the user selects title from the dropdown
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    Then validate clicking submit button should display first name required error message
    And validate member is not added successfully

  @registration_missing_last_name
  Scenario: Validate registration fails when last name is missing
    Given load the excel data for member registration with missing last name
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    Then validate clicking submit button should display last name required error message
    And validate member is not added successfully

  @registration_missing_dob
  Scenario: Validate registration fails when date of birth is missing
    Given load the excel data for member registration with missing dob
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user selects gender
    Then validate clicking submit button should display dob required error message
    And validate member is not added successfully

  @registration_invalid_dob
  Scenario: Validate registration fails when date of birth is invalid
    Given load the excel data for member registration with invalid dob
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user selects gender
    And enters the invalid date of birth in registration page
    Then validate error message for invalid date of birth should be displayed
    And validate member is not added successfully
