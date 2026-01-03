import { Then } from "@cucumber/cucumber";
import { waitFor, waitForSelector } from "../../support/wait-for-behaviour";
import {
  checkElement,
  elementChecked,
  isCheckElement,
} from "../../support/html-behaviour";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

// Then(
//   /^the "([^"]*)" (?:checkbox|radio button|switch) should( not)? be checked, on the "([^"]*)" (?:page|bar|tab)$/,
//   async function (
//     this: ScenarioWorld,
//     elementKey: ElementKey,
//     negate: boolean,
//     fileName: string
//   ) {
//     const {
//       screen: { page },
//       globalConfig,
//     } = this;

//     logger.log(
//       `the ${elementKey} check box|radio button should ${
//         negate ? "not " : ""
//       }be checked, on the ${fileName}`
//     );

//     const elementIdentifier = verifyElementLocator(
//       page,
//       elementKey,
//       globalConfig,
//       fileName
//     ); //? check pages
//     var flag = true;
//     if (elementIdentifier === undefined) {
//       flag = false;
//       logger.log("❌ element identifier not found.");
//     }
//     expect(flag).toBeTruthy();

//     logger.log("✔️ element identifier : " + elementIdentifier);

//     await waitFor(async () => {
//       const elementStable = await waitForSelector(page, elementIdentifier);

//       if (elementStable) {
//         const isElementChecked = await elementChecked(page, elementIdentifier);
//         return isElementChecked === !negate;
//       } else {
//         return elementStable;
//       }
//     });
//   }
// );

Then(
  /^the "([^"]*)" checkbox is checked, on the "([^"]*)" page$/,
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
      `I uncheck the ${elementKey} checkbox|radio button|switch, on the ${fileName} page`
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

    const isChecked = await isCheckElement(page, elementIdentifier);
    return expect(isChecked).toBeTruthy();
  }
);

Then(
  /^the "([^"]*)" checkbox should be checked, on the "([^"]*)" page$/,
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
      `I uncheck the ${elementKey} checkbox should be checked, on the ${fileName} page`
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

    const isChecked = await isCheckElement(page, elementIdentifier);
    if (!isChecked) {
      await checkElement(page, elementIdentifier);
    }
    return expect(isChecked).toBeTruthy();
  }
);

Then(
  /^the "([^"]*)" checkbox should be unchecked, on the "([^"]*)" page$/,
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
      `I uncheck the ${elementKey} checkbox should be unchecked, on the ${fileName} page`
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

    const isChecked = await isCheckElement(page, elementIdentifier);

    if (isChecked) {
      await checkElement(page, elementIdentifier);
    }
    return expect(isChecked).toBeFalsy();
  }
);
