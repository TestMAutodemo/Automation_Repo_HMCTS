import { When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { ScenarioWorld } from "./setup/world";
import { logger } from "../logger";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { selectDateOnCalendar } from "../support/calendar-helper";
import { expect } from 'playwright/test';;

When(
  /^on the "([^"]*)" calendar, user selects the "([^"]*)" day, "([^"]*)" month, "([^"]*)" year, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    day: string,
    month: string,
    year: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `on the ${elementKey} calendar, user selects the ${day} day, ${month}, ${year}, on the ${fileName} page`
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

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await selectDateOnCalendar(
          page,
          elementIdentifier,
          day.trim(),
          month.trim(),
          year.trim()
        );
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);
