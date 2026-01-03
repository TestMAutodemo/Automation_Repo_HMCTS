import { Then } from "@cucumber/cucumber";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import {
  KeyboardEnterElement,
  clickElement,
  getIframeElement,
  inputValueOnIframe,
} from "../support/html-behaviour";
import { ScenarioWorld } from "./setup/world";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { verifyElementLocator } from "../support/web-elements-helper";
import { Page } from "playwright";
import { expect } from "playwright/test";

Then(
  /^user fills the in the "([^"]*)" input on the "([^"]*)" iframe with "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user fills the in the ${elementKey} input on the ${iframeName} iframe with ${input}, on the ${fileName} page`
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
    const iframeIdentifier = verifyElementLocator(
      page,
      iframeName,
      globalConfig,
      fileName
    );

    await waitFor(async () => {
      const iframeStable = await waitForSelector(page, iframeIdentifier);

      if (iframeStable) {
        const elementIframe = await getIframeElement(page, iframeIdentifier);
        if (elementIframe) {
          await inputValueOnIframe(elementIframe, elementIdentifier, input);
        }
      }
      return iframeStable;
    });
  }
);


Then(
  /^user clicks the "([^"]*)" button on the "([^"]*)" iframe, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} input on the ${iframeName} iframe, on the ${fileName} page`
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
    const iframeIdentifier = verifyElementLocator(
      page,
      iframeName,
      globalConfig,
      fileName
    );

    await waitFor(async () => {
      // const iframeStable = await waitForSelector(page, iframeIdentifier);

      // if (iframeStable) {
        // const elementIframe = await getIframeElement(page, iframeIdentifier);
        // if (elementIframe) {
          console.log('frames count: '+await page.frames().length);
          // let temp;
          // for(let frame of await page.frames())
          // {
          //     temp = await frame.$(iframeName);
              
          //     if(temp){
          //         console.log(temp);
          //         break;            
          //     }
          // }
          // await temp.click();

       
         // page.$eval(sel, (elementKey)=>elementKey.click )

        const elementName = await page.locator(elementIdentifier).innerText();
        console.log(`element text is ${elementName}`);

        const isVisible = await page.locator(elementIdentifier).isVisible();
        console.log(`element text is visible ${isVisible}`);

        const isEnabled = await page.locator(elementIdentifier).isEnabled();
        console.log(`element text is enabled ${isEnabled}`);
        
          await page.click(elementIdentifier, {force: true});
          await page.keyboard.down("Enter");
         
         return await page.dblclick(elementIdentifier, {force: true});
        // }
      // }
      // return iframeStable;
    });
  }
);

