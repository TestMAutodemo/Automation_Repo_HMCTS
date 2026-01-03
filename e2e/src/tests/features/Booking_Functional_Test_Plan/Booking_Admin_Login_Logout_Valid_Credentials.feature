Feature: Admin Login:Verify Successfuly Login and Logout with valid(Username and Password) 

Background: 
Given user is on the "home" page
@smoke
Scenario: Verify Successfuly Login and Logout with valid(Username and Password) 
And user clicks the "Adminlink" button, on the "Admin" page
And user is directed to the "admin" page
Then user types "env:ADMIN_USERNAME" into "AdminUser" input, on the "Login" page
Then user types "env:ADMIN_PASSWORD" into "AdminPassword" input, on the "Login" page
And user clicks the "Login" button, on the "Admin" page
And user is directed to the "rooms" page
And user waits for "RestfulBookerPlatformDemo" element to load, on the "Admin" page
And user clicks the "Branding" link, on the "Admin" page
And user waits for "B&BDetails" element to load, on the "Admin" page
And user is directed to the "branding" page
And the "RestfulBooking" should exactly contain the text "Restful Booker Platform Demo", on the "Admin" page
And user clicks the "Logout" button, on the "Admin" page