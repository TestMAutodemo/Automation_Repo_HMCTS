
Feature: Booking Send Message API-Send Message to BB

@api
Scenario: Submit contact message with valid details
  When the user submits a contact message with:
    | name        | Trogenwarrior |
    | email       | warrior7@gmail.com |
    | phone       | 1239876543219 |
    | subject     | Invalid subject |
    | description | This is valid message text of required length. |
  Then the message should be sent successfully

  @api
  Scenario: Submit contact message with invalid email and subject less than 5 charecters(5to 12 characters allowed for subject line)
  When the user submits a contact message with:
    | name        | Alice |
    | email       | not-an-email |
    | phone       | 01234567890 |
    | subject     | Help |
    | description | This is a valid description with enough characters. |
  Then the message should be rejected with status 400