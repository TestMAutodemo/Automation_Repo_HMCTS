Feature:Admin: Verify Login Admin page accessibility

    Description:
    Accessibility tesing on Admin page using axe-playwright tool

Background: 
Given user is on the "home" page
@a11y
Scenario: Verify Admin page accessibility

And user clicks the "Adminlink" button, on the "Admin" page
And user is directed to the "admin" page
And I inject axe accessibility engine
Then I generate full version accessibility analysis report

