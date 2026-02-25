@diagnostics @registration @extended_scenarios
Feature: User Profile Registration - Comprehensive Test Coverage

  Background:
    Given the user is on the login page

  # ============================================
  # POSITIVE TEST SCENARIOS
  # ============================================

  @positive @registration_valid_male_user
  Scenario: Register new male user with all mandatory fields - Mr. title
    Given load the excel data for registration with row number 11
    When create an account with random mobile number
    And click on the submit button
    And find whether the account holder is member or non member
    And click on the profile icon
    Then validate whether the user is a new user by checking the presence of welcome message
    When click the profile registration icon
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully
    When the user clicks on the profile icon
    Then validate the profile name matches with the registered name
    Then validate the age should be correct based on DOB entered
    Then validate the gender should be correct based on selection
    Then validate the mobile number should be correct based on registration

  @positive @registration_valid_female_user
  Scenario: Register new female user with all mandatory fields - Mrs. title
    Given load the excel data for registration with row number 2
    When create an account with random mobile number
    And click on the submit button
    And find whether the account holder is member or non member
    And click on the profile icon
    Then validate whether the user is a new user by checking the presence of welcome message
    When click the profile registration icon
    When the user selects title "Mrs." from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user verifies gender auto-selected as "Female" based on title
    And the user enters date of birth in registration page
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully
    Then validate the profile name matches with the registered name
    Then validate the age should be correct based on DOB entered
    Then validate the gender should be correct based on selection

  @positive @registration_valid_female_miss
  Scenario: Register new female user with Miss title
    Given load the excel data for registration with row number 3
    When create an account with random mobile number
    And click on the submit button
    And find whether the account holder is member or non member
    And click on the profile icon
    When click the profile registration icon
    When the user selects title "Miss." from the dropdown
    And the user enters first name in registration page
    And the user enters last name in registration page
    And the user verifies gender auto-selected as "Female" based on title
    And the user enters date of birth in registration page
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

  @positive @registration_without_middle_name
  Scenario: Register user without middle name (optional field)
    Given load the excel data for registration with row number 4
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user skips middle name field
    And the user enters last name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

  @positive @registration_without_email
  Scenario: Register user without email (optional field)
    Given load the excel data for registration with row number 5
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters middle name in registration page
    And the user enters last name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    And the user skips email field
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

  @positive @registration_with_valid_email
  Scenario: Register user with valid email address
    Given load the excel data for registration with row number 6
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user last name in registration page
    And the user selects gender
    And the user enters date of birth in registration page
    And the user enters valid email from excel
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully
    Then validate the email matches with registered email

  @positive @registration_minimum_age
  Scenario: Register user with minimum valid age (newborn - 0 years)
    Given load the excel data for registration with row number 7
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title "Baby" from the dropdown
    And the user enters first name in registration page
    And the user enters last name in registration page
    And the user enters date of birth with "0" years old
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

  @positive @registration_maximum_age
  Scenario: Register user with maximum valid age (120 years old)
    Given load the excel data for registration with row number 8
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title from the dropdown
    And the user enters first name in registration page
    And the user enters last name in registration page
    And the user selects gender
    And the user enters date of birth with "120" years old
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

  @positive @registration_special_titles
  Scenario Outline: Register user with special titles (Dr., Prof., Master)
    Given load the excel data for registration with row number <row>
    When create an account with random mobile number
    And click on the submit button
    And click on the profile icon
    When click the profile registration icon
    When the user selects title "<title>" from the dropdown
    And the user enters first name in registration page
    And the user enters last name in registration page
    And the user manually selects gender as "<gender>"
    And the user enters date of birth in registration page
    And the user accepts terms and conditions
    And the user clicks on submit button
    Then the new member should be added successfully

    Examples:
      | row | title   | gender |
      | 9   | Dr.     | Male   |
      | 10  | Dr.     | Female |
      | 11  | Prof.   | Male   |
      | 12  | Master  | Male   |
