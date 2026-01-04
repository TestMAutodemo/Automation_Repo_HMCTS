import { Then } from "@cucumber/cucumber";
import { waitFor } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { ElementKey } from "../../env/global";
import { getIframeElement } from "../../support/html-behaviour";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { expect } from 'playwright/test';;

Then(
  /^the "([^"]*)" on the "([^"]*)" iframe should( not)? be displayed, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    negate: boolean,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} on the ${iframeName} should ${
        negate ? "not " : ""
      }be displayed, on the ${fileName}`
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
    const elementIframe = await getIframeElement(page, iframeIdentifier);

    await waitFor(async () => {
      const isElementVisible =
        (await elementIframe?.$(elementIdentifier)) != null;
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([^"]*)" iframe (should|should not) contain the text "(.*)", on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    negate: "should" | "should not",
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} should ${negate}contain the text ${expectedElementText}, on the ${fileName}`
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
    const elementIframe = await getIframeElement(page, iframeIdentifier);

    await waitFor(async () => {
      let elementText = await elementIframe?.textContent(elementIdentifier);
      elementText = elementText?.trim();
      let containsText;
      if (elementText !== undefined) {
        containsText = elementText.includes(expectedElementText);
        logger.log(
          `Element Text: ${elementText} contains Expected Element Text: ${expectedElementText} result: ${containsText}`
        );

        if (negate === "should") {
          // If expecting the text to be present
          expect(containsText).toBeTruthy();
        } else if (negate === "should not") {
          // If expecting the text to be absent
          expect(containsText).toBeFalsy();
        }
      }
      // If element text is undefined or doesn't meet conditions, return false
      return containsText;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([^"]*)" iframe (should|should not) equal the text "(.*)", on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    negate: "should" | "should not",
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} should ${negate}equal the text ${expectedElementText}, on the ${fileName} page, on the ${fileName}`
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
    const elementIframe = await getIframeElement(page, iframeIdentifier);
    logger.log(`Iframe: ${elementIframe}`);
    await waitFor(async () => {
      let elementText = await elementIframe?.textContent(elementIdentifier);
      elementText = elementText?.trim();
      if (negate === "should") {
        return expect(expectedElementText).toBe(elementText);
      } else if (negate === "should not") {
        return expect(expectedElementText).not.toBe(elementText);
      }
      return null;
    });
  }
);

Then(
  /^the "([^"]*)" on the "([^"]*)" iframe (should|should not) equal the input text "(.*)", on the "([^"]*)" (?:page|bar|tab|popup)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeName: string,
    negate: "should" | "should not",
    expectedElementText: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    console.log(
      `the ${elementKey} should ${negate}equal the text ${expectedElementText}, on the ${fileName} page, on the ${fileName}`
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
    const elementIframe = await getIframeElement(page, iframeIdentifier);
    logger.log(`Iframe: ${elementIframe}`);
    await waitFor(async () => {
      let elementText = await elementIframe?.inputValue(elementIdentifier);
      elementText = elementText?.trim();
      if (negate === "should") {
        return expect(expectedElementText).toBe(elementText);
      } else if (negate === "should not") {
        return expect(expectedElementText).not.toBe(elementText);
      }
      return null;
    });
  }
);
