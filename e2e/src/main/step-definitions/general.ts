import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { logger } from "../logger";
import { ElementKey } from "../env/global";
import { envNumber } from "../env/parseEnv";
import { verifyElementLocator } from "../support/web-elements-helper";
import {
  retryUntilVisible,
  waitForElementToDisappear,
} from "../support/html-behaviour";
import { waitForSelector, waitForSelectorOnPage } from "../support/wait-for-behaviour";
import { expect } from 'playwright/test';;
import { checkUpdateTime } from "../support/time-helper";

Then(
  /^user waits "([^"]*)" seconds?$/,
  async function (this: ScenarioWorld, waitSeconds: string) {
    const {
      screen: { page },
    } = this;

    logger.log(`user waits ${waitSeconds} seconds`);

    await page.waitForTimeout(parseInt(waitSeconds, 10) * 1000);
  }
);

Then(/^I reload page$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  await page.reload();
});

Then(
  /^user waits until "([^"]*)" changes, on "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`user waits until ${elementKey} changes, on ${fileName} page`);

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

    await checkUpdateTime(page, elementIdentifier);
  }
);

Then(
  /^user waits until "([^"]*)" stops loading, on "([^"]*)" page$/,
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
      `user waits until ${elementKey} stops loading, on ${fileName} page`
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
    const loaderElement = await page.waitForSelector(elementIdentifier);
    await loaderElement.waitForElementState("hidden");
  }
);

Then(
  /^user waits for dom content to load?$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
    } = this;

    logger.log(`user waits for dom content to load`);

    await page.waitForLoadState("domcontentloaded"); // Wait for the 'DOMContentLoaded' event.
  }
);

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab user waits for the content to load?$/,
  async function (this: ScenarioWorld, elementPosition: string) {
    const {
      screen: { page, context },
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementPosition} tab user waits for the content to load`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    globalVariables["pageIndex"] = String(pageIndex);

    await pages[pageIndex].waitForLoadState("domcontentloaded", {
      timeout: envNumber("PROCESS_TIMEOUT"),
    }); // Wait for the 'DOMContentLoaded' event.
  }
);

Then(
  /^user waits for the page to load?$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
    } = this;

    logger.log(`user waits for the page to load`);
    await page.waitForLoadState("load"); // consider operation to be finished when the load event is fired.
  }
);

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab user waits for the page to load?$/,
  async function (this: ScenarioWorld, elementPosition: string) {
    const {
      screen: { page, context },
      globalVariables,
    } = this;

    logger.log(`on the ${elementPosition} tab user waits for the page to load`);

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    globalVariables["pageIndex"] = String(pageIndex);

    await pages[pageIndex].waitForLoadState("load", {
      timeout: envNumber("PROCESS_TIMEOUT"),
    }); // consider operation to be finished when the load event is fired.
  }
);

Then(
  /^user waits for the page network to load?$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
    } = this;

    logger.log(`user waits for the page network to load`);

    await page.waitForLoadState("networkidle", {
      timeout: envNumber("PROCESS_TIMEOUT"),
    }); // consider operation to be finished when there are no network connections for at least 500 ms.
  }
);

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab user waits for the network to load?$/,
  async function (this: ScenarioWorld, elementPosition: string) {
    const {
      screen: { page, context },
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementPosition} tab user waits for the network to load`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    globalVariables["pageIndex"] = String(pageIndex);

    await pages[pageIndex].waitForLoadState("networkidle", {
      timeout: envNumber("PROCESS_TIMEOUT"),
    }); // consider operation to be finished when there are no network connections for at least 500 ms.
  }
);

Then(
  /^user waits for "([^"]*)" element to load, on the "([^"]*)" (?:tab|page)$/,
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
      `⏳ user waits for '${elementKey}' element to load, on the '${fileName}' page`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    if (
      !elementIdentifier ||
      typeof elementIdentifier !== "string" ||
      !elementIdentifier.trim()
    ) {
      throw new Error(
        `❌ Locator not found/invalid for element '${elementKey}' on page '${fileName}'`
      );
    }

try {
  await page.locator(elementIdentifier).waitFor({
    state: "visible",
    timeout: 60000,
  });
} catch (err) {
  throw new Error(
    `❌ Timed out waiting for element '${elementKey}' to be visible on '${fileName}'. ` +
    `locator='${elementIdentifier}'. Original error: ${(err as Error).message}`
  );
}

    logger.log(`✅ '${elementKey}' is visible on '${fileName}'`);
  }
);
Then(
  /^user waits for the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" text to display$/,
  async function (this: ScenarioWorld, elementPosition: string, text: string) {
    const {
      screen: { page },
    } = this;

    logger.log(`user waits for ${text} text to display`);

    const index = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let tag = "*";
    let element = `(//${tag}[text()='${text}'])[${index}]`;

    await retryUntilVisible(page, element, 5, 2000);
  }
);

Then(
  /^on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab user waits for "([^"]*)" element to load, on the "([^"]*)" page?$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementPosition} tab user waits for ${elementKey} element to load, on the ${fileName} page`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    let pages = context.pages();
    globalVariables["pageIndex"] = String(pageIndex);

    const elementIdentifier = verifyElementLocator(
      pages[pageIndex],
      elementKey,
      globalConfig,
      fileName
    );

    await pages[pageIndex].waitForSelector(elementIdentifier);
  }
);
