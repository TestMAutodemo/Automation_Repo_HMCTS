import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import {
  checkElement,
  isCheckElement,
  uncheckElement,
} from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { verifyElementLocator } from "../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^I uncheck the "([^"]*)" (?:checkbox|radio button|switch), on the "([^"]*)" page$/,
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

    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await uncheckElement(page, elementIdentifier);
      }
      return elementStable;
    });
  }
);

Then(
  /^user checks the the "([^"]*)" checkbox, on the "([^"]*)" page$/,
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
      `user checks the the ${elementKey} checkbox|radio button|switch, on the ${fileName} page`
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
        await checkElement(page, elementIdentifier);
      }
      return elementStable;
    });
  }
);
