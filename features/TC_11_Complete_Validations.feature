# Complete login flow with comprehensive validations
@diagnostics @loginValidation
Feature: Place lab orders with complete validation coverage

  Background:
    Given the user is on the login page

  @validateLoginFlow
  Scenario: Complete login flow with all validations
    # LOAD DATA
    Given load the excel data for single member and lab visit
    
    # VALIDATE LOGIN PAGE
    Then validate login page loaded correctly
    
    # ENTER MOBILE
    When the user enters otp
    Then validate mobile number entry and format
    
    # SUBMIT LOGIN
    And click on the submit button
    Then validate OTP submission and login success
    Then validate user membership status
    Then validate auto-detected location
    
    # EXISTING FLOW CONTINUES
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    And load test names from Excel
    And select tests and capture individual prices
    Then All tests should complete successfully
    When click on the cart icon
    And set the visit type from UI for lab visit
    Then validate checkout summary header values
    And select the member
    And select the location
    And select the slot
    And validate the actual price against the checkout price
    When the user extract the member names from the page
    When the user extracts the member names from the excel sheet
    Then the member names on the page should match the excel
    And validate final amount to pay
    Then capture amount to pay
    Then calculate expected final amount
    Then validate cart amount to pay
    When click pay online button
    Then extract razorpay amount
    Then validate razorpay amount against expected amount
    Then validate Razorpay payment options based on amount
    Then initiate upi payment if allowed
    And click the go to orders button
    And click the view button in orders page

  @validateProductSelection
  Scenario: Product selection with validations
    Given load the excel data for single member and lab visit
    When the user enters otp
    And click on the submit button
    
    # VALIDATE BEST SELLER SECTION
    Then validate Best Seller section visible and clickable
    When click the Best Seller View All button
    Then validate product list loaded after clicking View All
    
    And load test names from Excel
    Then validate Add to Cart button visible and clickable
    And select tests and capture individual prices
    Then All tests should complete successfully
    Then validate product successfully added to cart

  @validateCartCheckout
  Scenario: Cart and checkout with validations - Complete flow
    # STEP 1: LOAD DATA
    Given load the excel data for single member and lab visit
    
    # STEP 2: LOGIN
    When the user enters otp
    And click on the submit button
    
    # STEP 3: NAVIGATE TO PRODUCTS
    And find whether the account holder is member or non member
    And click the Best Seller View All button
    
    # STEP 4: SELECT TESTS
    And load test names from Excel
    Then validate Add to Cart button visible and clickable
    And select tests and capture individual prices
    Then All tests should complete successfully
    Then validate product successfully added to cart
    
    # STEP 5: GO TO CART
    When click on the cart icon
    Then validate checkout summary header values
    
    # STEP 6: SELECT VISIT TYPE (MANDATORY - SYNCHRONOUS)
    And set the visit type from UI for lab visit
    
    # STEP 7: SELECT MEMBER (MANDATORY - SYNCHRONOUS)
    And select the member
    
    # STEP 8: SELECT LOCATION (MANDATORY - SYNCHRONOUS)
    And select the location
    
    # STEP 9: SELECT SLOT (MANDATORY - SYNCHRONOUS)
    And select the slot
    
    # STEP 10: VALIDATE PRICES (MANDATORY - SYNCHRONOUS)
    Then validate the actual price against the checkout price
    
    # STEP 11: VALIDATE FINAL AMOUNT (MANDATORY - SYNCHRONOUS)
    When validate final amount to pay
    
    # STEP 12: PROCEED TO PAYMENT
    When click pay online button
    
    # STEP 13: EXTRACT AND VALIDATE RAZORPAY AMOUNT
    Then extract razorpay amount
    Then validate razorpay amount against expected amount
    
    # STEP 14: PROCESS PAYMENT AND COMPLETE ORDER
    Then validate Razorpay payment options based on amount
    Then initiate upi payment if allowed
    And click the go to orders button
    And click the view button in orders page
