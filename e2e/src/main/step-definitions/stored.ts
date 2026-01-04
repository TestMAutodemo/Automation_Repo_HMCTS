import { Then, When } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { verifyElementLocator } from "../support/web-elements-helper";
import { expect } from 'playwright/test';;
import { extractFromTex } from "../support/filter-helper";
import { getLocatorColor, clickElement } from "../support/html-behaviour";

Then(
  /^user retrieves the "([^"]*)" text and store it as "([^"]*)" in global variables, on the "([^"]*)" page$/,
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

    logger.log(
      `user retrieves the ${elementKey} text and store it as ${variableKey} in global variables, on the ${fileName} page`
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
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        const elementText = await page.textContent(elementIdentifier);
        if (elementText != null) {
          globalVariables[variableKey] = elementText;
        }
      }
      return elementStable;
    });
  }
);

Then(
  /^on the "(.*)" (?:page|tab), I toggle the "(.*)" element if the (color|background-color) is "(.*)" and store successful or unsuccessful toggle "([^"]*)" in global variables$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    targetColourType: "color" | "background-color",
    rgbExpectedColour: string,
    variableKey: string
    
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
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
    var togglesuccess="";
    globalVariables[variableKey] = togglesuccess;
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
        console.log(`the ${rgb} RGB(Radion button is not selected hence RGB is 0000)  select operation will be supported`);
          togglesuccess="Pass";
          globalVariables[variableKey] = togglesuccess;
        
        await clickElement(page, elementIdentifier);
        console.log(`the ${globalVariables[variableKey]} Value of Toggle`);
          
        } else {
          // let colourName = hexToColorName(hexColour);
          // if (colourName)
          console.log(
            `The element ${targetColour} is not ${rgbExpectedColour}`
          );
          togglesuccess="Fail";
          globalVariables[variableKey] = togglesuccess;
          console.log(`the ${globalVariables[variableKey]} Value of Toggle`);
        
        }
      } else {
        logger.log("element is stable to proceed: " + elementStable);
         
        
      }
      return elementStable;
    });
  }
);


Then(
  /^on the "(.*)" (?:page|tab), I toggle the "(.*)" element if the (color|background-color) is "(.*)" if store successful toggle "([^"]*)" has Fail value$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    targetColourType: "color" | "background-color",
    rgbExpectedColour: string,
    variableKey: string
    
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
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
    //var togglesuccess="";
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

    if (globalVariables[variableKey]==="Fail"){
        if (rgb === rgbExpectedColour) {
        console.log(`the ${rgb} RGB(Radion button is not selected hence RGB is 0000)  is not selected`);
         // togglesuccess="Pass";
         // globalVariables[variableKey] = togglesuccess;
        
        await clickElement(page, elementIdentifier);
        console.log(`the ${globalVariables[variableKey]} Value of Toggle`);
          
        } else {
          // let colourName = hexToColorName(hexColour);
          // if (colourName)
          console.log(
            `The element ${targetColour} is not ${rgbExpectedColour}`
          );
        }
      }else{
        console.log(`the Toggle not needed`); 
        console.log(`the ${globalVariables[variableKey]} Value of Toggle`);
      }
    }else{
      logger.log("element is stable to proceed: " + elementStable);
     
      }
      return elementStable;
    });
  }
);



Then(
  /^user retrieves the "([^"]*)" text, filter from "([^"]*)" and store it as "([^"]*)" in global variables, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    filter: string,
    variableKey: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `user retrieves the ${elementKey} text, filter ${filter} and store it as ${variableKey} in global variables, on the ${fileName} page`
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
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        const elementText = await page.textContent(elementIdentifier);
        var valueToStore;
        if (elementText) {
          valueToStore = extractFromTex(elementText, filter);
          console.log(`Value to store ${valueToStore}`);
        }
        if (valueToStore) {
          globalVariables[variableKey] = valueToStore;
          console.log(`Stored ${valueToStore} as ${variableKey}`);
        }
      }
      return elementStable;
    });
  }
);

Then(
  /^user retrieves the "([^"]*)" image and store it as "([^"]*)" in global variables, on the "([^"]*)" page$/,
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

    logger.log(
      `user retrieves the ${elementKey} text and store it as ${variableKey} in global variables, on the ${fileName} page`
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
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        const image = page.locator(elementIdentifier);
        if (image != null) {
          globalVariables[variableKey] = (await image.screenshot()).toString(
            "base64"
          );
        }
      }
      return elementStable;
    });
  }
);
