import { When } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";

When(
  /^user sets the "([^"]*)" slider values to "([^"]*)", on the "([^"]*)" (?:page|filters)$/,
  async function (
    this: ScenarioWorld,
    element: ElementKey,
    inputString: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I sets the ${element} slider values to ${inputString}, on the ${fileName} page`
    );

    const elementIdentifier1 = verifyElementLocator(
      page,
      element,
      globalConfig,
      fileName
    ); //? check pages

    var flag = true;
    if (elementIdentifier1 === undefined) {
      flag = false;
      logger.log("❌ element identifier not found.");
    }

    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier : " + elementIdentifier1);

    logger.log("locator 1 is " + elementIdentifier1);
    await waitFor(async () => {
      const elementStable1 = await waitForSelector(page, elementIdentifier1);
      if (elementStable1) {
        // Get the slider handle element
        const startSliderHandle = await page.locator(elementIdentifier1);

        // Move from low to high
        await startSliderHandle.fill(inputString); // Set to the minimum value
      } else {
        console.error("The 'min' attribute is not found on the element.");
      }
      return elementStable1;
    });
  }
);

When(
  /^user sets the slider values, from "([^"]*)" with "([^"]*)" input to "([^"]*)" with "([^"]*)" input, on the "([^"]*)" (?:page|filters)$/,
  async function (
    this: ScenarioWorld,
    start: ElementKey,
    startInput: string,
    stop: ElementKey,
    stopInput: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I set the slider values, from ${start} with ${startInput} to ${stop} with ${stopInput}, on the ${fileName} page`
    );

    const elementIdentifier1 = verifyElementLocator(
      page,
      start,
      globalConfig,
      fileName
    ); //? check pages

    const elementIdentifier2 = verifyElementLocator(
      page,
      stop,
      globalConfig,
      fileName
    ); //? check pages
    var flag = true;
    if (elementIdentifier1 === undefined) {
      flag = false;
      logger.log("❌ element identifier 1 not found.");
    }

    if (elementIdentifier2 === undefined) {
      flag = false;
      logger.log("❌ element identifier 2 not found.");
    }
    expect(flag).toBeTruthy();

    logger.log("✔️ element identifier 1 : " + elementIdentifier1);
    logger.log("✔️ element identifier 2 : " + elementIdentifier2);

    logger.log("locator 1 is " + elementIdentifier1);
    logger.log("locator 2 is " + elementIdentifier2);
    await waitFor(async () => {
      const elementStable1 = await waitForSelector(page, elementIdentifier1);
      const elementStable2 = await waitForSelector(page, elementIdentifier2);
      if (elementStable1 && elementIdentifier2) {
        // Get the slider handle element
        const startSliderHandle = await page.locator(elementIdentifier1);
        const endSliderHandle = await page.locator(elementIdentifier2);

        // Move from low to high
        await startSliderHandle.fill(startInput); // Set to the minimum value
        await endSliderHandle.fill(stopInput); // Set to the minimum value
      } else {
        console.error("The 'min' attribute is not found on the element.");
      }
      return elementStable1 && elementStable2;
    });
  }
);
