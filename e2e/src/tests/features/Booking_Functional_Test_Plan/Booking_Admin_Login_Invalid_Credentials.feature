Feature: Admin Login:Verify validation errors on Admin Login page for incorrect user credentials and password
Background: 
Given user is on the "home" page
@smoke
Scenario Outline: Verify validation errors on Admin Login page for incorrect username and password
And user clicks the "Adminlink" button, on the "Admin" page
And user is directed to the "admin" page
Then user types "<username>" into "AdminUser" input, on the "Login" page
Then user types "<password>" into "AdminPassword" input, on the "Login" page
And user clicks the "Login" button, on the "Admin" page
And user waits for "Invalidcredentials" element to load, on the "Admin" page
And the "Invalidcredentials" should exactly contain the text "Invalid credentials", on the "Admin" page

   Examples:
    | username    | password     |
    |             |              |
    | wrongname   | wrongpassword|
    | user123     | 01234567890! |
    | user876%$   |pass*&^%|
    | King9876    | This is a invalid password description with enough characters.|