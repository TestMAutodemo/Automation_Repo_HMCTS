import { Then, When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import {
  checkTextOnList,
  multiSelectTextFromList,
  selectOptionByText,
  selectTextFromList,
  unMultiSelectTextFromList,
} from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";
import { expect } from 'playwright/test';;

// selectOptionByText <option
Then(
  /^user selects the "([^"]*)" option from the "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    option: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user selects the ${option} option from the ${elementKey}, on the ${fileName} page`
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

    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        logger.log("element is stable : " + elementStable);
        await selectOptionByText(page, elementIdentifier, option);
      } else {
        logger.log("element is stable : " + elementStable);
      }
      return elementStable;
    });
  }
);

Then(
  /^user selects the "([^"]*)" option$/,
  async function (this: ScenarioWorld, optionValue: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`user selects the ${optionValue} option`);

    await waitFor(async () => {
      return await page
        .getByRole("combobox")
        .selectOption({ label: optionValue });
    });
  }
);

Then(
  /^user selects the "([^"]*)" option from the "([^"]*)" list, on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    option: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user selects the ${option} option from the ${elementKey} list, on the ${fileName} page`
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
    console.log("value " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
        await selectTextFromList(page, elementIdentifier, option);
      } else {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
      }
      return elementStable;
    });
  }
);

Then(
  /^user selects the "([^"]*)" options from the "([^"]*)" list, on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    option: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user selects the ${option} option from the ${elementKey} list, on the ${fileName} page`
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
    console.log("value " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
        await multiSelectTextFromList(page, elementIdentifier, option);
      } else {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
      }
      return elementStable;
    });
  }
);

Then(
  /^the "([^"]*)" options (should|should not) be contained on the "([^"]*)" list, on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    option: string,
    condition: "should" | "should not",
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${option} options ${condition} be contained on the ${elementKey} list, on the ${fileName} page`
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
    console.log("value " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      let result;
      if (elementStable) {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
        result = await checkTextOnList(page, elementIdentifier, option);
        if (condition === "should") {
          logger.log(`✔️ element ${option} with ${result}`);
          expect(result).toBeTruthy();
        } else if (condition === "should not") {
          logger.log(`❌ element ${option} with ${result}`);
          expect(result).toBeFalsy();
        }
      } else {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
      }
      return result;
    });
  }
);

Then(
  /^I unselect the options from the "([^"]*)" list, on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I unselect the options from the ${elementKey} list, on the ${fileName} page`
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
    console.log("value " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
        await unMultiSelectTextFromList(page, elementIdentifier);
      } else {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
      }
      return elementStable;
    });
  }
);

Then(
  /^the following on the "([^"]*)" options are found on the "([^"]*)" list, on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    option: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the following on the ${option} options are found on the ${elementKey} list, on the ${fileName} page`
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

    console.log("value " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
        let element = page.locator(elementIdentifier).locator("button");
        let text = await element.textContent();
        console.log(`text content ${text}`);
      } else {
        logger.log(`element ${elementIdentifier} is stable : ` + elementStable);
      }
      return elementStable;
    });
  }
);
