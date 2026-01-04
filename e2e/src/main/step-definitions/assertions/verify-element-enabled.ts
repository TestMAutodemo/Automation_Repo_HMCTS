import { Then } from "@cucumber/cucumber";
import { elementEnabled } from "../../support/html-behaviour";
import { waitFor, waitForSelector } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([^"]*)" should( not)? be enabled, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: boolean,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should ${
        negate ? "not " : ""
      }be enabled, on the ${fileName}`
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

    const isElementEnabled = await elementEnabled(page, elementIdentifier);
    console.log(`element is enabled ${isElementEnabled}`);
    let result = isElementEnabled;

    if (!negate) {
      return expect(isElementEnabled).toBeTruthy();
    } else {
      return expect(isElementEnabled).not.toBeTruthy();
    }
  }
);
