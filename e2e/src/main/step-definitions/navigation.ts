import { Given, Then, When } from "@cucumber/cucumber";
import { ElementKey, PageId } from "../env/global";
import {
  navigateToPage,
  currentPathMatchesPageId,
  getCurrentPageId,
} from "../support/navigation-behaviour";
import { ScenarioWorld } from "./setup/world";
import { waitFor } from "../support/wait-for-behaviour";
import { logger } from "../logger";
import { verifyElementLocator } from "../support/web-elements-helper";
import { expect } from 'playwright/test';;

Given(
  /^user is on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const { screen: { page }, globalConfig } = this;

    logger.log(`user is on the "${pageId}" page`);

    await navigateToPage(page, pageId, globalConfig);

    logger.log(`Current URL after navigation: ${page.url()}`);

    try {
      await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig));
    } catch (err) {
      throw new Error(
        `Failed to confirm navigation to pageId="${pageId}". Current URL="${page.url()}". ` +
        `Original error: ${(err as Error).message}`
      );
    }
  }
);
Given(
  /^user is directed to the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const { screen: { page } } = this;

    const currentUrl = page.url();

    logger.log(`user is directed to the "${pageId}" page`);
    logger.log(`Current URL: ${currentUrl}`);

    expect(
      currentUrl,
      `Expected URL to contain "${pageId}" but got "${currentUrl}"`
    ).toContain(pageId);
  }
);

When(
  /^user navigates to "([^"]*)", on "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`user navigates to ${elementKey}, on ${fileName}`);

    const newUrl = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag1 = true;
    if (newUrl === undefined) {
      flag1 = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag1).toBeTruthy();

    await page.goto(newUrl, { waitUntil: "domcontentloaded" });
  }
);

Given(
  /^user is directed to the "([^"]*)" page on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab$/,
  async function (
    this: ScenarioWorld,
    pageId: PageId,
    elementPosition: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `user is directed to the ${pageId} page on the ${elementPosition} tab`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;
    let pages = context.pages();
    globalVariables["pageIndex"] = String(pageIndex);
    await waitFor(() =>
      currentPathMatchesPageId(pages[pageIndex], pageId, globalConfig)
    );
  }
);

Then(/^user performs a page refresh$/, async function (this: ScenarioWorld) {
  const {
    screen: { browser, context, page },
  } = this;

  // Close the current page and context
  await page.close();
  await context.close();

  // Create a new context and page within the same browser
  const newContext = await browser.newContext();
  const newPage = await newContext.newPage();

  // Update the 'screen' property with the new context and page
  this.screen = { browser, context: newContext, page: newPage };
});

Then(
  /^user opens a new page with URL "([^"]*)"$/,
  async function (this: ScenarioWorld, url: string) {
    const {
      screen: { browser, context },
    } = this;

    // Create a new page within the same context
    const newPage = await context.newPage();

    // Navigate to the specified URL
    await newPage.goto(url);

    // Update the 'screen' property with the new page
    this.screen.page = newPage;
  }
);
function someAsyncFunction() {
  throw new Error("Function not implemented.");
}



When(/^the user logs the current page URL$/, async function (this: ScenarioWorld) {
  
  if (!this.page) {
  throw new Error('🚫 this.page is not initialized. Did you forget to call this.init()?');
}
  const url = await this.page?.url();
  console.log(`🌐 Current Page URL: ${url}`);

  if (this.attach && url) {
    await this.attach(`Current Page URL: ${url}`);
  }
});