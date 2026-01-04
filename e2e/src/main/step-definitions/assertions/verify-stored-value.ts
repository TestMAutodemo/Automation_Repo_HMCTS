import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { waitFor } from "../../support/wait-for-behaviour";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([^"]*)" should( not)? contain the "([^"]*)" stored in global variables, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: boolean,
    variableKey: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    console.log(
      `the ${elementKey} should ${negate ? "not " : ""}contain the ${
        globalVariables[variableKey]
      } stored in global variables, on the ${fileName}`
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
      const elementText = await page.textContent(elementIdentifier);
      const variableValue = globalVariables[variableKey];
      return elementText?.includes(variableValue) === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" should( not)? equal the "([^"]*)" stored in global variables, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: boolean,
    variableKey: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    console.log(
      `the ${elementKey} should ${negate ? "not " : ""}equal the ${
        globalVariables[variableKey]
      } stored in global variables, on the ${fileName}`
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
      const elementText = await page.textContent(elementIdentifier);
      const variableValue = globalVariables[variableKey];
      return (elementText === variableValue) === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" number should be greater than the "([^"]*)" number stored in global variables, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    variableKey: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    console.log(
      `Checking if ${elementKey} is greater than the ${globalVariables[variableKey]} stored in global variables, on the ${fileName}`
    );

    const variableValue = globalVariables[variableKey];

    let storedNumber: number = parseFloat(variableValue);
    let result = false;
    const maxReloads = 10; // Number of reloads
    const reloadInterval = 10000; // 10 seconds in milliseconds
    const totalDuration = maxReloads * reloadInterval;

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    let reloadCounter = 0;
    let elapsedTime = 0;

    while (!result && elapsedTime < totalDuration) {
      console.log(`Checking element ${elementKey} on ${fileName}`);
      console.log(`Stored number is: ${storedNumber}`);
      console.log(`Reload attempt ${reloadCounter + 1}`);

      let elementText = await page.textContent(elementIdentifier);
      let actualNumber: number;

      if (elementText) {
        actualNumber = parseFloat(elementText);
        console.log(`Actual number is: ${actualNumber}`);

        if (actualNumber > storedNumber) {
          console.log(`Condition met: ${actualNumber} > ${storedNumber}`);
          result = true;
        }
      }

      if (!result && reloadCounter < maxReloads - 1) {
        console.log(`Reloading page...`);
        await page.reload();
        reloadCounter++;
        await sleep(reloadInterval);
        elapsedTime += reloadInterval;
      } else {
        console.log(`Breaking the loop`);
        break;
      }
    }

    return expect(result).toBeTruthy();
  }
);
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Then(/^user clears the cookies$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
    globalConfig,
    globalVariables,
  } = this;

  console.log(`user clears the cookies`);
  // Clear cookies before performing the comparison
  await this.clearCookiesAndStorage();
  await page.reload();
});
