Feature: Admin Login:Application rejects SQL injection attempts on Password datafield
Background: 
Given user is on the "home" page
@smoke
Scenario Outline:  SQL injection protection Password datafield
And user clicks the "Adminlink" button, on the "Admin" page
And user is directed to the "admin" page
Then user types "admin" into "AdminUser" input, on the "Login" page
Then user types "<PayloadPassword>" into "AdminPassword" input, on the "Login" page
And user clicks the "Login" button, on the "Admin" page
And user waits for "Invalidcredentials" element to load, on the "Admin" page
And the "Invalidcredentials" should exactly contain the text "Invalid credentials", on the "Admin" page

Examples:
  | Payloadpassword   |
  | ' OR '1'='1         |
  | admin'--            |
  | ' OR 1=1 --         |