// click link tag in table

import { When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { waitFor } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";
import {
  clickCellOperation,
  clickClassCellOperation,
  fillCellOperation,
  getBodyTextCellOperation,
  getFooterTextCellOperation,
  selectCellOperation,
} from "../support/table-helper";
import { expect } from 'playwright/test';;

//? Click Operation on Table
When(
  /^on the "([^"]*)" body, user clicks the "([^"]*)" (?:link|button|element) with reference "([^"]*)" at "([^"]*)" column, on the "([^"]*)" page$/,

  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    linkText: string,
    referenceText: string,
    columnHeader: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `On the ${elementKey} body, user clicks the ${linkText} (?:link|button|element) with reference ${referenceText} at ${columnHeader} column, on the ${fileName} on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );
    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (globalVariables[linkText]) {
      let value = globalVariables[linkText];
      linkText = value;
      logger.log("input is : " + linkText);
    }

    if (globalVariables[referenceText]) {
      let value = globalVariables[referenceText];
      referenceText = value;
      logger.log("input is : " + referenceText);
    }

    await waitFor(async () => {
      const elementStable = await page.waitForSelector(elementIdentifier, {
        state: "visible",
      });
      if (elementStable) {
        logger.log("element is stable : " + elementStable);
        await clickCellOperation(
          page,
          elementIdentifier,
          columnHeader,
          referenceText,
          linkText.trim()
        );
      } else {
        logger.log("element is stable : " + elementStable);
      }
      return elementStable;
    });
  }
);

//? Click operation on table with class attribute
When(
  /^on the "([^"]*)" body, user clicks the "([^"]*)" class attribute (?:link|button|element|icon) with reference "([^"]*)" at "([^"]*)" column, on the "([^"]*)" page$/,

  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    text: string,
    referenceText: string,
    columnHeader: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `On the ${elementKey} body, user clicks the ${text} (?:link|button|element) with reference ${referenceText} at ${columnHeader} column, on the ${fileName} on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );
    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (globalVariables[referenceText]) {
      let value = globalVariables[referenceText];
      referenceText = value;
      logger.log("input is : " + referenceText);
    }

    await waitFor(async () => {
      const elementStable = await page.waitForSelector(elementIdentifier, {
        state: "visible",
      });
      if (elementStable) {
        logger.log("element is stable : " + elementStable);
        await clickClassCellOperation(
          page,
          elementIdentifier,
          columnHeader,
          referenceText,
          text
        );
      } else {
        logger.log("element is stable : " + elementStable);
      }
      return elementStable;
    });
  }
);

//? fill input field
When(
  /^on the "([^"]*)" body, user fills the input with "([^"]*)" at row reference "([^"]*)" and column "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    inputValue: string,
    referenceText: string,
    columnHeader: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `On the table ${elementKey} body, user fills the input with ${inputValue} at row reference ${referenceText} and column ${columnHeader}, on the ${fileName}`
    );

    if (globalVariables[referenceText]) {
      let value = globalVariables[referenceText];
      referenceText = value;
      logger.log("input is : " + referenceText);
    }

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );
    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (elementIdentifier) {
      logger.log("element are stable : " + elementIdentifier);

      await fillCellOperation(
        page,
        elementIdentifier,
        columnHeader,
        referenceText,
        inputValue
      );
    } else {
      logger.log("element are stable : " + elementIdentifier);
    }
  }
);

//? get text from input field
When(
  /^on the "([^"]*)" footer, the value at row reference "([^"]*)" and column "([^"]*)" should be "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    referenceText: string,
    columnHeader: string,
    textToVerify: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `On the table ${elementKey} footer, the value at row reference ${referenceText} and column ${columnHeader} should be ${textToVerify}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );
    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (elementIdentifier) {
      logger.log("element are stable : " + elementIdentifier);

      let result = await getFooterTextCellOperation(
        page,
        elementIdentifier,
        columnHeader,
        referenceText
      );

      expect(result).toEqual(textToVerify);
    } else {
      logger.log("element are stable : " + elementIdentifier);
    }
  }
);

//? get text from table body
When(
  /^on the "([^"]*)" body, the text at row reference "([^"]*)" and column "([^"]*)" should be "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    referenceText: string,
    columnHeader: string,
    textToVerify: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    if (globalVariables[textToVerify]) {
      textToVerify = globalVariables[textToVerify];
      console.log(`Retrieved ${textToVerify} from global variables`);
    }

    logger.log(
      `On the table ${elementKey} body, the text at row reference ${referenceText} and column ${columnHeader} should be ${textToVerify}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (elementIdentifier) {
      logger.log("element are stable : " + elementIdentifier);

      let result = await getBodyTextCellOperation(
        page,
        elementIdentifier,
        columnHeader,
        referenceText
      );

      expect(result).toEqual(textToVerify);
    } else {
      logger.log("element are stable : " + elementIdentifier);
    }
  }
);

//? select
When(
  /^on the "([^"]*)" body, user selects the "([^"]*)" options at row reference "([^"]*)" and column "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    options: string,
    referenceText: string,
    columnHeader: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `On the table ${elementKey} body, user selects the ${options} options at row reference ${referenceText} and column ${columnHeader}, on the ${fileName}`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );
    //? check pages
    var flag = true;
    if (elementIdentifier === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier);

    if (elementIdentifier) {
      logger.log("element are stable : " + elementIdentifier);

      await selectCellOperation(
        page,
        elementIdentifier,
        columnHeader,
        referenceText,
        options
      );
    } else {
      logger.log("element are stable : " + elementIdentifier);
    }
  }
);
