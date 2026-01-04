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

**Warning**: Node.js 18 LTS is used as newer LTS Node versions require Visual Studio C++ build tools that are not fully compatible with the currently available Visual Studio Community edition and may introduce issues when installing native dependencies.

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



&nbsp;   cd  Automation_Repo_HMCTS/e2e




6\. Install dependencies and Playwright browsers:



&nbsp;  npm install

&nbsp;  npx playwright install



--------------------------------------------------



RUNNING TESTS

-------------

NOTE: All commands must be run from the e2e directory from either powershell or doscommand or VisualCode terminal.



Smoke Tests:

./run_test.bat localhostt smoke

OR

npm run cucumber:localhost -- --tags "@smoke"



API Tests:

./run_test.bat localhost api

OR

npm run cucumber:localhost -- --tags "@api"



Accessibility Tests:

./run_test.bat localhost a11y

OR

npm run cucumber:localhost -- --tags "@a11y"



--------------------------------------------------



ENVIRONMENT VARIABLES (SECRETS)
This framework uses environment variables to manage sensitive values such as admin credentials, OTP secrets, and API keys. Feature files reference these values using tokens, for example:

env:ADMIN_USERNAME

env:ADMIN_PASSWORD

env:ADMIN_OTP_SECRET

Environment values are resolved at runtime from environment-specific configuration files.

Note:
For demonstration purposes, this repository includes a preconfigured localhost.env file to support local execution against a public test application. No additional setup is required to run the tests locally.

In real-world projects:

Environment files such as localhost.env must not be committed to source control

Only template files (for example localhost.env.example) with placeholder values should be committed

Sensitive values should be supplied via secure environment configuration or CI/CD secret management solutions

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



