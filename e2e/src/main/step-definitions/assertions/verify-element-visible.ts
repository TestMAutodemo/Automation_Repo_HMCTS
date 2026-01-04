import { Then } from "@cucumber/cucumber";
import { waitFor } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([^"]*)" (should|should not) be displayed, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    argType: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`the ${elementKey} ${argType} be displayed, on the ${fileName}`);

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

    console.log("element identifier is: " + elementIdentifier);
    await page.waitForTimeout(parseInt("3", 10) * 1000);
    const isElementVisible = await page.isVisible(elementIdentifier);

    if (argType === "should") {
      await page.locator(elementIdentifier).highlight();
      return expect(isElementVisible).toBeTruthy();
    } else if (argType === "should not") {
      return expect(isElementVisible).toBeFalsy();
    }
  }
);

Then(
  /^the "([^"]*)" (should|should not) be a link, on the "([^"]*)" (?:page|menu|tab|sub menu)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementType: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should ${elementType}be a link, on the ${fileName}`
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
      const locator = page.locator(elementIdentifier);

      if (elementType == "should") {
        expect(locator.innerHTML()).toContain("a");
      } else if (elementType == "should not") {
        expect(locator.innerHTML()).not.toContain("a");
      }
    });
  }
);

Then(
  /^the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" "([^"]*)" should( not)? be displayed, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    elementKey: ElementKey,
    negate: boolean,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementPosition} ${elementKey} should ${
        negate ? "not" : ""
      }be displayed, on the ${fileName}`
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
    const index = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    await waitFor(async () => {
      const isElementVisible =
        (await page.$(`${elementIdentifier}>>nth=${index}`)) != null;
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^user should( not)? see "(\d*)" "([^"]*)" displayed, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    negate: boolean,
    count: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user should ${
        negate ? "not " : ""
      }see ${count} ${elementKey} displayed, on the ${fileName}`
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
      const element = await page.$$(elementIdentifier);
      return (Number(count) === element.length) === !negate;
    });
  }
);
