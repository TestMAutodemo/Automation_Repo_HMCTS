import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import {
  clickElement,
  containsExactMatch,
  getAttributeText,
  getElementText,
  getElements,
  getList,
  getLists,
  getText,
  getValue,
  getValueGroupedText,
  getValueGroupedTextfield,
  getVisibleText,
  groupedTextfield,
  verifySelectOptionByText,
} from "../../support/html-behaviour";
import { waitFor, waitForSelector } from "../../support/wait-for-behaviour";
import { logger } from "../../logger";
import { expect } from 'playwright/test';;
import { verifyElementLocator } from "../../support/web-elements-helper";
import { VerifyTextOnMetricCard } from "../../../models/cards";



Then(
  /^the "([^"]*)" metric card should contain the text "([^"]*)" for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    textToSearch: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `the ${elementKey} metric card should contain the text ${textToSearch} for ${card}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    const elementStable = await waitForSelector(page, elementIdentifier);
    let result;
    if (elementStable) {
      result = await VerifyTextOnMetricCard(
        page,
        elementIdentifier,
        textToSearch,
        card
      );
      logger.log(result);
    }
    // try {
    expect(result).toEqual(textToSearch);
    // } catch (error) {
    //   // If the expectation fails, log the error and continue the test.
    //   console.warn(`Soft Assertion: ${(error as Error).message}`);
    // }
  }
);

Then(
  /^the "([^"]*)" metric card should contain the text "([^"]*)" for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    textToSearch: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `the ${elementKey} metric card should contain the text ${textToSearch} for ${card}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    const elementStable = await waitForSelector(page, elementIdentifier);
    let result;
    if (elementStable) {
      result = await VerifyTextOnMetricCard(
        page,
        elementIdentifier,
        textToSearch,
        card
      );
      logger.log(result);
    }
    // try {
    expect(result).toEqual(textToSearch);
    // } catch (error) {
    //   // If the expectation fails, log the error and continue the test.
    //   console.warn(`Soft Assertion: ${(error as Error).message}`);
    // }
  }
);

Then(
  /^the "([^"]*)" list should contain the "([^"]*)" (?:text|value|link), on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    elementKey: ElementKey,
    elementValue: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    if (globalVariables[elementValue]) {
      let value = globalVariables[elementValue];
      elementValue = value;
      logger.log("input is : " + elementValue);
    }

    logger.log(
      `the ${elementKey} list should contain the ${elementValue} value, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    var result = await getList(page, elementIdentifier, elementValue);

    return expect(result).toBeTruthy();
  }
);

Then(
  /^the "([^"]*)" elements should contain the "([^"]*)" (?:text|value|link), on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    elementKey: ElementKey,
    elementValue: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    if (globalVariables[elementValue]) {
      let value = globalVariables[elementValue];
      elementValue = value;
      logger.log("input is : " + elementValue);
    }

    logger.log(
      `the ${elementKey} list should contain the ${elementValue} value, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    var result = await getElements(page, elementIdentifier, elementValue);

    return expect(result).toBeTruthy();
  }
);

Then(
  /^the "([^"]*)" should exactly contain the text "([^"]*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementValue: string,
    fileName: string
  ) {
    const { screen: { page }, globalConfig } = this;

    logger.log(
      `the '${elementKey}' should exactly contain '${elementValue}', on the '${fileName}'`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    if (!elementIdentifier) {
      throw new Error(
        `❌ Locator not found for element '${elementKey}' on page '${fileName}'`
      );
    }

    logger.log(`✔️ element identifier : ${elementIdentifier}`);

    const result = await containsExactMatch(
      page,
      elementIdentifier,
      elementValue
    );

    logger.log(`The outcome is: ${result}`);

    expect(
      result,
      `Expected '${elementKey}' to exactly contain '${elementValue}' on '${fileName}', but it did not`
    ).toBeTruthy();
  }
);




Then(
  /^the "([^"]*)" should( not)? equal the input value "([^"]*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should ${negate ? "not " : ""}equal the ${
        negate ? "input value" : ""
      } ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    const elementStable = await waitForSelector(page, elementIdentifier);

    if (elementStable) {
      const elementAttribute = await getValue(page, elementIdentifier);

      let actual = elementAttribute.replace(/\s/g, "");
      let expected = expectedElementText.replace(/\s/g, "");
      console.log(`actual text is ${actual} and expected text is ${expected}`);

      if (!negate) {
        return expect(actual).toBe(expected);
      } else {
        return expect(actual).not.toBe(expected);
      }
    } else {
      return elementStable;
    }
  }
);

Then(
  /^the "([^"]*)" (should|should not) equal the text "([^"]*)", on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    elementKey: ElementKey,
    negate: "should" | "should not",
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should equal the ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    // await waitForSelector(page, elementIdentifier);

    const actualText = (await getText(page, elementIdentifier))
      .replace(/\s*,\s*/g, ",") // Replace multiple spaces with a single space
      .replace(/\n/g, " ") // Replace line breaks with spaces
      .trim();
    let expected = expectedElementText.replace(/\s*,\s*/g, ",").trim();

    console.log(`Actual: ${actualText}`);
    console.log(`Expect: ${expected}`);

    if (negate === "should") {
      return expect(expected).toBe(actualText);
    } else if (negate === "should not") {
      return expect(expected).not.toBe(actualText);
    }
  }
);

Then(
  /^the "([^"]*)" if present (should|should not) equal the text "([^"]*)", on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    elementKey: ElementKey,
    negate: "should" | "should not",
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should equal the ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    // await waitForSelector(page, elementIdentifier);

    const actualText = (await getVisibleText(page, elementIdentifier))
      .replace(/\s*,\s*/g, ",") // Replace multiple spaces with a single space
      .replace(/\n/g, " ") // Replace line breaks with spaces
      .trim();
    let expected = expectedElementText.replace(/\s*,\s*/g, ",").trim();

    console.log(`Actual: ${actualText}`);
    console.log(`Expect: ${expected}`);

    if (negate === "should") {
      return expect(expected).toBe(actualText);
    } else if (negate === "should not") {
      return expect(expected).not.toBe(actualText);
    }
  }
);

Then(
  /^the "([^"]*)" with "([^"]*)" attribute should( not)? contain the text "(.*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    attribute: string,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} with ${attribute} attribute should ${
        negate ? "not " : ""
      }contain the text ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    const actual = await getAttributeText(page, elementIdentifier, attribute);
    console.log(`the attribute is seen: ${actual}`);

    let result = actual;
    if (actual === null) {
      result = "";
    }

    if (!negate) {
      return expect(attribute).toEqual(result);
    } else {
      return expect(attribute).not.toEqual(result);
    }
  }
);

Then(
  /^the "([^"]*)" class should( not)? contain the text "([^"]*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} class should ${
        negate ? "not " : ""
      }contain the text ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    console.log(
      `element key is ${elementKey} & element value is ${elementIdentifier}`
    );

    let tag = "*";
    let XPath = `//${tag}[contains(@class, '${elementIdentifier}') and normalize-space(text()) = '${expectedElementText}']`;
    var element = page.locator(XPath);

    if (await element.isVisible()) {
      let actual = (await element.innerText()).trim().toLowerCase();

      let expected = expectedElementText.trim().toLowerCase();
      console.log(`actual is ${actual} & expected is ${expected}`);
      var result = false;
      if (actual === expected) {
        result = true;
      }

      if (!negate) {
        return expect(result).toBeTruthy();
      } else {
        return expect(result).not.toBeTruthy();
      }
    } else {
      console.log(`element is not visible`);
    }
  }
);

Then(
  /^the selected option for "([^"]*)" should( not)? be "([^"]*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the selected option for ${elementKey} should ${
        negate ? "not " : ""
      }be ${expectedElementText}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    console.log(
      `element key is ${elementKey} & element value is ${elementIdentifier}`
    );

    const elementStable = await waitForSelector(page, elementIdentifier);

    if (elementStable) {
      logger.log("element is stable : " + elementStable);
      var actualText = await verifySelectOptionByText(page, elementIdentifier);
      let expected = expectedElementText.trim().toLowerCase();
      let actual = actualText?.trim().toLowerCase();
      console.log(`actual is ${actual} & expected is ${expected}`);
      var result = false;
      if (actual === expected) {
        result = true;
      }

      if (!negate) {
        return expect(result).toBeTruthy();
      } else {
        return expect(result).not.toBeTruthy();
      }
    } else {
      logger.log("element is stable : " + elementStable);
    }
  }
);

Then(
  /^on the "([^"]*)" reference row, user should see the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" input value of the "([^"]*)" as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    referenceText: string,
    elementPosition: string,
    elementKey: ElementKey,
    valueToCompare: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const elementIndex = Number(elementPosition.match(/\d/g)?.join("")) + 1;

    logger.log(
      `on the ${referenceText} reference row, user fills the ${elementPosition} input of the ${elementKey}, on the ${fileName} page`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        let result = await getValueGroupedTextfield(
          page,
          elementIdentifier,
          referenceText,
          elementIndex
        );

        expect(result).toBe(valueToCompare);
      }
      return elementStable;
    });
  }
);

Then(
  /^on the "([^"]*)" reference row, user should see the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" text of the "([^"]*)" as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    referenceText: string,
    elementPosition: string,
    elementKey: ElementKey,
    valueToCompare: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const elementIndex = Number(elementPosition.match(/\d/g)?.join("")) + 1;

    logger.log(
      `on the ${referenceText} reference row, user fills the ${elementPosition} input of the ${elementKey}, on the ${fileName} page`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        let result = await getValueGroupedText(
          page,
          elementIdentifier,
          referenceText,
          elementIndex
        );

        expect(result).toBe(valueToCompare);
      }
      return elementStable;
    });
  }
);


Then(
  /^the "([^"]*)" should show either the success message "([^"]*)" or the failure message "([^"]*)" on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    elementKey: ElementKey,
    expectedSuccessMessage: string,
    expectedFailureMessage: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;


   const attachLog = (msg: string) => {
      if (this.attach) this.attach(msg);
      logger.log(msg);
    };


 
    logger.log(`🔍 Validating booking result on "${fileName}" using element "${elementKey}"`);

    const elementIdentifier = verifyElementLocator(page, elementKey, globalConfig, fileName);

    const normalize = (text: string) =>
      text.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();

    let actualSuccessText: string | null = null;

    try {
      // Try capturing text from success message element
      await page.waitForSelector(elementIdentifier, { timeout: 2000 });
      const rawText = await getText(page, elementIdentifier);
      actualSuccessText = normalize(rawText);
      logger.log(`🧾 Found success text: "${actualSuccessText}"`);
      attachLog(`🧾 Found success text: "${actualSuccessText}"`);

      if (actualSuccessText === normalize(expectedSuccessMessage)) {
        logger.log('✅ Hotel booking succeeded: Success message matched.');
         attachLog('✅ Hotel booking succeeded: Success message matched.');
         expect(actualSuccessText).toBe(normalize(expectedSuccessMessage));
        return;
      } else {
        logger.log(`ℹ️ Success message did not match expected. Proceeding to check failure case.`);
        attachLog(`⚠️ Success message did not match. Will check for failure message.`)
      }
    } catch (err) {
      logger.log(`⚠️ Could not read success element "${elementKey}". Proceeding to check failure case.`);
      attachLog(`⚠️ Could not read success element "${elementKey}": ${err}`);
    }

    try {
      const fallbackText = normalize(await page.textContent('body') || '');
      logger.log(`🧾 Page fallback text: "${fallbackText}"`);
      attachLog(`🧾 Page fallback text: "${fallbackText}"`);

      const failureMatched = fallbackText.includes(normalize(expectedFailureMessage));

      if (failureMatched) {
        logger.log('⚠️ Hotel booking failed due to technical difficulties on the website please try to booking directly emailing or calling the BB or try again later thanks for your patience: Failure message matched.');
        attachLog(`❌ Booking failed: "${expectedFailureMessage}" found on screen.`);
        expect(failureMatched).toBe(true);
        return;
      } else {
        logger.log(`❌ Failure message not found in fallback.`);
        attachLog(`⚠️ Failure message not matched in page text.`);
      }
    } catch (err) {
      logger.log(`❌ Could not read fallback failure message from page body: ${err}`);
      attachLog(`❌ Could not read fallback text: ${err}`)
    }

    // Final failure — neither message matched
    logger.log(`❌ Neither success nor failure message matched.`);
    logger.log(`Expected success: "${expectedSuccessMessage}"`);
    logger.log(`Expected failure: "${expectedFailureMessage}"`);
    logger.log(`Actual success text (if any): "${actualSuccessText}"`);
    attachLog('❌ Booking outcome could not be verified. No expected messages matched.');
    attachLog(`Expected success: "${expectedSuccessMessage}"`);
    attachLog(`Expected failure: "${expectedFailureMessage}"`);
    attachLog(`Actual success (if any): "${actualSuccessText}"`);

    

    throw new Error('❌ Booking outcome could not be verified. Expected success or failure message not found.');
  }
);