# PlaywrightProject



AUTOMATED TESTING FRAMEWORK – HELP FILE

=================================



PURPOSE

-------

This repository contains an example end-to-end automated testing framework using

Playwright and Cucumber (BDD). It is intended to demonstrate modern test automation,

risk-based testing and quality assurance practices for public-facing digital services.



This repository is for demonstration purposes only.

No real data or credentials are stored in the repository.

Any required secrets are supplied at runtime via environment variables.



--------------------------------------------------



PREREQUISITES

-------------

\- Git

\- Node.js (Node.js 18 LTS)

\- Visual Studio Code



Optional VS Code Extensions:

\- Cucumber (Gherkin) Full Support

\- Feature Syntax and Snippets



--------------------------------------------------



INSTALLATION STEPS

------------------

1\. Navigate to the directory where you want to download the repository.

2\. Open Git Bash or a terminal in that directory.

3\. Clone the repository:



&nbsp;  git clone <repository\_url>

&nbsp;  ex: git clone https://github.com/TestMAutodemo/Automation_Repo_HMCTS.git



4\. Open the project in Visual Studio Code:



&nbsp;   You can do this in two ways:

&nbsp;   First Option:

&nbsp;   From PowerShell / command prompt:

&nbsp;   step 1:cd Automation_Repo_HMCTS

&nbsp;   step 2: code .



&nbsp;  Second Option:

&nbsp;  Or by manually opening VS Code and by selecting the folder Automation_Repo_HMCTS



&nbsp;  Note: After VS Code loads, you should see the e2e folder in the left-hand panel.



5\. Navigate to the e2e folder From PowerShell/command prompt/Visual Code Terminal :



&nbsp;   cd  Automation\_Repo\_HMCTS/Assignment/e2e




6\. Install dependencies and Playwright browsers:



&nbsp;  npm install

&nbsp;  npx playwright install



--------------------------------------------------



RUNNING TESTS

-------------

NOTE: All commands must be run from the e2e directory from either powershell or doscommand or VisualCode terminal.



Smoke Tests:

.\\run\_test.bat localhost smoke

OR

npm run cucumber:localhost -- --tags "@smoke"



API Tests:

.\\run\_test.bat localhost api

OR

npm run cucumber:localhost -- --tags "@api"



Accessibility Tests:

.\\run\_test.bat localhost a11y

OR

npm run cucumber:localhost -- --tags "@a11y"



--------------------------------------------------



ENVIRONMENT VARIABLES (SECRETS)

-------------------------------

This framework uses environment variables for any sensitive values (e.g. admin username,

password, OTP secret, API keys). Feature files reference these using tokens like:



&nbsp; env:ADMIN\_USERNAME

&nbsp; env:ADMIN\_PASSWORD

&nbsp; env:ADMIN\_OTP\_SECRET



Note:

The repository does not contain any valid usernames or passwords.

Valid login scenarios are included solely to demonstrate how secure

credential handling is implemented. Reviewers are not expected to

execute these scenarios and can run all other tests without secrets.



Local runs:

\- Create the file: e2e/src/main/env/localhost.env

\- Add values such as:

&nbsp;   ADMIN\_USERNAME=<value>

&nbsp;   ADMIN\_PASSWORD=<value>

&nbsp;   ADMIN\_OTP\_SECRET=<value>







IMPORTANT:

\- Do NOT commit localhost.env or any \*.env files containing secrets.

\- Only commit a template file (e.g. localhost.env.example) with blank values.



CI runs:

\- Secrets must be provided via GitHub Actions Secrets (or later Jenkins credentials) and mapped to env vars.

\- The env loader will not overwrite existing CI-provided values.





--------------------------------------------------



REPORTS \& LOGS

--------------

HTML Test Report:

e2e/reports/index.html



\*\*Accessibility Reports:

e2e/reports/accessibility



Execution Logs:

e2e/logs



--------------------------------------------------



PROJECT STRUCTURE

-----------------

Feature Files:

e2e/src/tests/features



Step Definitions:

e2e/src/main/step-definitions



Page Configuration:

e2e/src/test/config/pages



Environment Configuration:

e2e/src/test/config/host.json



Routing Configuration:

e2e/src/test/config/routes.json



Supporting Components:

\- Hooks: e2e/src/main/step-definitions/setup/hooks

\- Logging: e2e/src/main/logger

\- Reporting: e2e/src/main/reporter



--------------------------------------------------



DESIGN PRINCIPLES

-----------------

\- Behaviour-Driven Development (BDD) for readable, business-focused scenarios and data-driven testing using Examples

\- Page Object Model (POM) for managing page structure and element locators

\- Secure handling of sensitive data via environment variables, with masking in execution logs

\- Stable selector strategy (id, data-testid, accessibility locators)

\- Explicit waiting and Playwright auto-waiting combined with clear assertions to reduce flakiness

\- Reusable step definitions with consistent error handling and meaningful failure messages

\- Support for UI, API, accessibility and negative testing within a single framework

\- Evidence-based reporting and structured logging for traceability, assurance and governance



--------------------------------------------------



SECURITY \& DATA SAFETY

----------------------

\- No real credentials are stored in the repository; secrets are supplied via local env files (gitignored) or CI secret managers.

\- All URLs and test data are non-production examples

\- Suitable for public repositories



--------------------------------------------------



FUTURE ENHANCEMENTS Provided more time was available on hand

------------------------------------------------------------

\- Expanded API and negative test coverage

\- Security scanning using OWASP ZAP (passive mode)

\- Improved secrets management for CI pipelines

\- CI quality gates for accessibility and security

\- Unified dashboard for UI, API and non-functional results



--------------------------------------------------

END OF FILE



