import { Then } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^the "([^"]*)" slider with "([^"]*)" attribute should( not)? contain the text "(.*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    attribute: string,
    negate: boolean,
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `the ${elementKey} with ${attribute} attribute should ${
        negate ? "not " : ""
      }contain the text ${expectedElementText}, on the ${fileName}`
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

    let metricCards = await page.locator(elementIdentifier).all();

    let actual;

    for (let metricCard of metricCards) {
      actual = await metricCard.getAttribute(attribute);
      if (actual.includes(expectedElementText)) {
        let lists = await metricCard.locator("ul").locator("li").all();

        for (let list of lists) {
          console.log(await list.innerHTML());
          if (list)
            globalVariables[await list.innerText()] = await list.innerText();
        }
        break;
      }
    }

    console.log(`the attribute is seen: ${actual}`);

    if (!negate) {
      return expect(actual).toContain(expectedElementText);
    } else {
      return expect(actual).not.toContain(expectedElementText);
    }
  }
);
