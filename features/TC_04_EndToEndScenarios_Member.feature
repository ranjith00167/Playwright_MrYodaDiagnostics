  @completescenario
Feature: Place lab orders and pay online for multiple scenarios of members and tests

  Background:
    Given the user is on the login page

  @enrollmentWithMembership
  Scenario: User logs into the application
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button

  @location_detectWithMembership
  Scenario: Location Auto-Detect on Dashboard
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    Then the location should be auto-detected on the dashboard

  @membershipWithMembership
  Scenario: Identify membership type
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member

  @select_testsWithMembership
  Scenario: Select tests and capture individual prices
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully

  @cartWithMembership
  Scenario: Validating the visit type
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully
    When click on the cart icon
    And set the visit type from UI for lab visit

  @checkout_headerWithMembership
  Scenario: Validate checkout summary header values with individual prices
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully
    When click on the cart icon
    And set the visit type from UI for lab visit
    Then validate checkout summary header values

  @multi_memberWithMembership
  Scenario: Select the member for multi member scenario
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully
    When click on the cart icon
    And set the visit type from UI for lab visit
    Then validate checkout summary header values
    And select the member for multi member scenario

  @multi_member_totalWithMembership
  Scenario: Extract total amount for multi member scenario
    Given load the excel data for multi member and lab visit with memership
    When the user enters otp
    And click on the submit button
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully
    When click on the cart icon
    And set the visit type from UI for lab visit
    Then validate checkout summary header values
    And select the member for multi member scenario
    And extract the total amount during checkout for the multi-member scenario
