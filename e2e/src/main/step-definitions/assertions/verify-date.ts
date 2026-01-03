import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { getFormattedDate } from "../../support/html-behaviour";
import { expect } from 'playwright/test';;
import { logger } from "../../logger";

Then(
  /^the "([^"]*)" should contain today date, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    let today = getFormattedDate();

    console.log(
      `the ${elementKey} should contain today's date as ${today} , on the ${fileName}`
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

    let element = page.locator(elementIdentifier);
    const date = (await element.innerText()).trim();

    return expect(date).toEqual(today);
  }
);
