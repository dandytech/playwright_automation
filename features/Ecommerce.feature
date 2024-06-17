Feature: Ecommerce validations

Scenario: Placing the Order
Given a login to Ecommerce application with "dandyfloodouts.com" and "Dandytech@2022"
When Add "ADIDAS ORIGINAL"
Then Verify "ADIDAS ORIGINAL" is displayed in the Cart
Then Verify order is present in the OrderHistory