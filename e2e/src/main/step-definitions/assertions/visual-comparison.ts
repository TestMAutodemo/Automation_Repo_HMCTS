import { Then } from "@cucumber/cucumber";
import { waitFor } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { logger } from "../../logger";
import {
  screenshots_equal,
  screenshots_not_equal,
} from "../../support/html-behaviour";
import { expect } from 'playwright/test';;
import { ElementKey } from "../../env/global";
import { verifyElementLocator } from "../../support/web-elements-helper";

Then(
  /^the "([^"]*)" (?:chart|image|graph) should not be equal to "([^"]*)" (?:chart|image|graph)$/,
  async function (
    this: ScenarioWorld,
    screenshot1: string,
    screenshot2: string
  ) {
    logger.log(`the ${screenshot1} should not be equal to ${screenshot2}`);

    await screenshots_not_equal(screenshot1, screenshot2);
  }
);

Then(
  /^the "([^"]*)" (?:chart|image|graph) should be equal to "([^"]*)" (?:chart|image|graph)$/,
  async function (
    this: ScenarioWorld,
    screenshot1: string,
    screenshot2: string
  ) {
    logger.log(`the ${screenshot1} should not be equal to ${screenshot2}`);

    await screenshots_equal(screenshot1, screenshot2);
  }
);

Then(
  /^the "([^"]*)" image should be equal to "([^"]*)" image, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey1: ElementKey,
    variableKey: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `the ${elementKey1} should be equal to ${variableKey}, pn the ${fileName}`
    );

    const screenshotString: string = globalVariables[variableKey];
    const buffer2: Buffer = Buffer.from(screenshotString, "base64");

    const elementIdentifier1 = verifyElementLocator(
      page,
      elementKey1,
      globalConfig,
      fileName
    ); //? check pages
    var flag1 = true;
    if (elementIdentifier1 === undefined) {
      flag1 = false;
      logger.log("❌ element identifier not found.");
    }
    expect(flag1).toBeTruthy();

    const elementScreenshot1 = page.locator(elementIdentifier1);
    // const elementScreenshot2 = page.locator(elementIdentifier2);

    const unitArray = await elementScreenshot1.screenshot();

    const buffer1 = Buffer.from(unitArray);

    const [image1, image2] = buffersToImages(buffer1, buffer2);

    const differenceCount = compareImages(image1, image2);

    console.log(`Difference count: ${differenceCount}%`);

    // if (differenceCount > 70) {
    //   result = true;
    // }
    // expect(result).toBeTruthy();
  }
);

type Image = number[][];

function buffersToImages(
  buffer1: Uint8Array,
  buffer2: Uint8Array,
  width: number = 100,
  height: number = 100
): [Image, Image] {
  const image1: Image = [];
  const image2: Image = [];

  for (let i = 0; i < width * height * 3; i += 3) {
    image1.push([buffer1[i], buffer1[i + 1], buffer1[i + 2]]);
    image2.push([buffer2[i], buffer2[i + 1], buffer2[i + 2]]);
  }

  return [image1, image2];
}

function compareImages(
  image1: Image,
  image2: Image,
  threshold: number = 5
): number {
  let diffCount = 0;

  for (let i = 0; i < image1.length; i++) {
    for (let j = 0; j < image1[i].length; j++) {
      for (let c = 0; c < 3; c++) {
        if (Math.abs(image1[i][j][c] - image2[i][j][c]) > threshold) {
          diffCount++;
          break; // Break if any channel difference exceeds the threshold
        }
      }
    }
  }

  const totalPixels = image1.length * image1[0].length;
  const percentageDifference = (diffCount / totalPixels) * 100;

  return parseFloat(percentageDifference.toFixed(2));
}
