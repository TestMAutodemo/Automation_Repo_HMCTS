import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { waitFor } from "../../support/wait-for-behaviour";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { env } from "../../env/parseEnv";
import { currentDate, retryUntilVisible } from "../../support/html-behaviour";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window) should( not)? contain the title "(.*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    negate: boolean,
    expectedTitle: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
    } = this;

    console.log(
      `the ${elementPosition} tab should ${
        negate ? "not " : ""
      }contain the title ${expectedTitle}, on the ${fileName}`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    await page.waitForTimeout(1000);

    await waitFor(async () => {
      let pages = context.pages();
      const tabTitle = await pages[pageIndex].title();
      return tabTitle?.includes(expectedTitle) === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window) should( not)? be displayed, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    negate: boolean,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} on the ${elementPosition} tab|window should ${
        negate ? "not " : ""
      }be displayed, on the ${fileName}`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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
      let pages = context.pages();
      const isElementVisible =
        (await pages[pageIndex].$(elementIdentifier)) != null;
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window) should( not)? contain the text "(.*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} on the ${elementPosition} tab|window should ${
        negate ? "not " : ""
      }contain the text ${expectedElementText}, on the ${fileName}`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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
      let pages = context.pages();
      const elementText = await pages[pageIndex].textContent(elementIdentifier);
      return elementText?.includes(expectedElementText) === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window) should( not)? equal the text "(.*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} on the ${elementPosition} tab|window should ${
        negate ? "not " : ""
      }equal the text ${expectedElementText}, on the ${fileName}`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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
      let pages = context.pages();
      const elementText = await pages[pageIndex].textContent(elementIdentifier);
      return (elementText === expectedElementText) === !negate;
    });
  }
);
