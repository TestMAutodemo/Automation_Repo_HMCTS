import { Then } from "@cucumber/cucumber";
import { waitFor } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([^"]*)" should( not)? be editable, on the "([^"]*)" (?:page|bar|tab)$/,
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
      }be editable, on the ${fileName}`
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
      const isElementVisible = await page.isEditable(elementIdentifier);

      return isElementVisible === !negate;
    });
  }
);
