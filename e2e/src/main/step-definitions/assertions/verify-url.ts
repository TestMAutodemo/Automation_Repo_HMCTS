import { Given } from "@cucumber/cucumber";
import { logger } from "../../logger";
import { ScenarioWorld } from "../setup/world";
import { expect } from 'playwright/test';;
import { verifyElementLocator } from "../../support/web-elements-helper";
import { ElementKey } from "../../env/global";

Given(
  /^user should be navigated to the "([^"]*)" url, directed from "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    // Get the current URL
    const currentUrl = page.url();

    logger.log(
      `user should be navigated to the ${elementKey} url, directed from ${fileName} page`
    );

    const expectedUrl = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (expectedUrl === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag).toBeTruthy();

    // Verify the URL
    if (currentUrl === expectedUrl) {
      console.log("The URL is correct.");
    } else {
      console.error(`Unexpected URL: ${currentUrl}`);
    }

    return expect(currentUrl).toBe(expectedUrl);
  }
);
