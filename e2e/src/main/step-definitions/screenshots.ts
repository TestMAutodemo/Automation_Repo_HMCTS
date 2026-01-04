import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { env } from "../env/parseEnv";
import { logger } from "../logger";
import { currentDate } from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { ScenarioWorld } from "./setup/world";
import { verifyElementLocator } from "../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window), I take a screenshot$/,
  async function (this: ScenarioWorld, elementPosition: string) {
    const {
      screen: { page, context },
      globalVariables,
    } = this;

    console.log(`on the ${elementPosition} tab, I take screenshot`);

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    // await page.evaluate(scrollTo, {direction: "down", speed: "slow"});
    await pages[pageIndex].waitForTimeout(1000);
    globalVariables["pageIndex"] = String(pageIndex);
    const screenshot = await pages[pageIndex].screenshot({
      path: `${env("SCREENSHOT_PATH")}${await currentDate()}.png`,
      fullPage: true,
    });
    await this.attach(screenshot, "image/png");
  }
);

Then(/^user should take a screenshot$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  console.log(`user should take screenshot`);

  // await page.evaluate(scrollTo, {direction: "down", speed: "slow"});
  await page.waitForTimeout(1000);

  const screenshot = await page.screenshot({
    path: `${env("SCREENSHOT_PATH")}${await currentDate()}.png`,
    fullPage: true,
  });
  await this.attach(screenshot, "image/png");
});

Then(
  /^user should take a screenshot of "([^"]*)" (?:text|graph|card|table|chart|element), on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `user should take a screenshot of ${elementKey} text|graph|card|table|chart, on the ${fileName}`
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
    // await page.evaluate(scrollTo, {direction: "down", speed: "slow"});
    await page.waitForTimeout(1000);
    const elementStable = await waitForSelector(page, elementIdentifier);
    if (elementStable) {
      logger.log(`element is stable : ` + elementStable);
      const screenshot = await page.locator(elementIdentifier).screenshot({
        path: `${env("SCREENSHOT_PATH")}${await currentDate()}.png`,
      });
      await this.attach(screenshot, "image/png");
    } else {
      logger.log(`element is stable : ` + elementStable);
      return elementStable;
    }
  }
);

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" (?:tab|window), I take a screenshot$/,
  async function (this: ScenarioWorld, elementPosition: string) {
    const {
      screen: { page, context },
      globalVariables,
    } = this;

    console.log(`on the ${elementPosition} tab, I take screenshot`);

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    await pages[pageIndex].waitForTimeout(1000);
    globalVariables["pageIndex"] = String(pageIndex); //store new count
    const screenshot = await pages[pageIndex].screenshot({
      path: `${env("SCREENSHOT_PATH")}${await currentDate()}.png`,
      fullPage: true,
    });
    await this.attach(screenshot, "image/png");
  }
);
