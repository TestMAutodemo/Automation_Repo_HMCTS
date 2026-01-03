import { Then } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { ScenarioWorld } from "../setup/world";
import {
  checkForKeywords,
  convertStringToArray,
  failedKeywords,
} from "../../support/html-behaviour";

// the <element> should (not) contain the <key words>

Then(
  /^the "([^"]*)" (should|should not) contain the "([^"]*)" keywords, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    argType: string,
    keywords: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    let cleanedStr: string = keywords.slice(1, -1);

    let keywordsArray: string[] = cleanedStr
      .split(",")
      .map((keyword) => keyword.trim().replace(/'/g, ""));

    logger.log(
      `the ${elementKey} ${argType} contain the ${keywordsArray} keywords, on the ${fileName}`
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

    console.log("element identifier is: " + elementIdentifier);

    await page.waitForTimeout(parseInt("3", 10) * 1000);

    let inputText = await page.locator(elementIdentifier).inputValue(); // get the text from input or textarea
    console.log(inputText);
    let isKeyword = checkForKeywords(inputText, keywordsArray); // search for keywords
    let failed = failedKeywords(inputText, keywordsArray);

    if (failed) {
      console.log(`Keyword: ${failed} not found!`);
    }
    if (argType === "should") {
      return expect(isKeyword).toBeTruthy();
    } else if (argType === "should not") {
      return expect(isKeyword).toBeFalsy();
    }
  }
);
