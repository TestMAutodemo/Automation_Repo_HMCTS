import { When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";
import { expect } from 'playwright/test';;
import { clickElement, getLocatorColor, rgbToHex } from "../support/html-behaviour";

When(
  /^on the "(.*)" (?:page|tab), the (color|background-color) of the "(.*)" element should be "(.*)"$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    targetColourType: "color" | "background-color",
    elementKey: ElementKey,
    hexExpectedColour: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    // Define the actual targetColour based on targetColourType
    const targetColour =
      targetColourType === "color" ? "color" : "background-color";

    logger.log(
      `on the ${fileName} page, the ${targetColour} of the ${elementKey} element should be ${hexExpectedColour}`
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
        await page.waitForTimeout(2000);
        logger.log("element is stable to proceed: " + elementStable);
        let rgb = await getLocatorColor(page, elementIdentifier, targetColour);
        let hexColour = rgbToHex(rgb);
        expect(hexColour).toBe(hexExpectedColour);
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);

When(
  /^on the "(.*)" (?:page|tab), I toggle the "(.*)" element if the (color|background-color) is "(.*)"$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    targetColourType: "color" | "background-color",
    rgbExpectedColour: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    // Define the actual targetColour based on targetColourType
    const targetColour =
      targetColourType === "color" ? "color" : "background-color" 

    logger.log(
      `on the ${fileName} page, I toggle the ${elementKey} element if the ${targetColour} is ${rgbExpectedColour}`
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
        await page.waitForTimeout(2000);
        logger.log("element is stable to proceed: " + elementStable);
        let rgb = await getLocatorColor(page, elementIdentifier, targetColour);
        console.log(`\nActual RGB is ${rgb}\n`);
        
        // let hexColour = rgbToHex(rgb);
        console.log(`Actual RGB color is ${rgb}`);
        if (rgb === rgbExpectedColour) {
        console.log(`the ${rgb} RGB(Radion button is not selected hence RGB is 0000)  is not selected`);
       
        
        await clickElement(page, elementIdentifier);
      
          
        } else {
          // let colourName = hexToColorName(hexColour);
          // if (colourName)
          console.log(
            `The element ${targetColour} is not ${rgbExpectedColour}`
          );
        }
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);
