import { Then, When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import {
  generateGoogleOtp,
  getMostRecentFileName,
  inputValue,
  uploadFile,
} from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";
import { readJSONFilesRecursive } from "../support/csv-helper";
import path from "path";
import { expect } from 'playwright/test';;

When(
  /^user clicks the "([^"]*)" (?:button|link|icon|element|text|image) to upload "([^"]*)" file, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileToUpload: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} (?:button|link|icon|element|text|image) to upload, on the ${fileName}`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const jsonDir = path.join(targetDirectory, "temp/data");
    const outputDirectory = path.join(targetDirectory, "temp/download");

    readJSONFilesRecursive(jsonDir, fileToUpload, outputDirectory);

    var file = await getMostRecentFileName(outputDirectory);

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
      if (elementStable && file) {
        await uploadFile(
          page,
          elementIdentifier,
          path.join(outputDirectory, file) // Use path.join for consistent file path handling
        );
      }
      return elementStable;
    });
  }
);

When(
  /^user clicks the "([^"]*)" (?:button|link|icon|element|text|image) to upload the "([^"]*)" file, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileToUpload: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} (?:button|link|icon|element|text|image) to upload the ${fileToUpload}, on the ${fileName}`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const uploadPath = path.join(
      targetDirectory,
      `temp/images/${fileToUpload}`
    );

    console.log(`path: ${uploadPath}`);

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
      if (elementStable && uploadPath) {
        await uploadFile(
          page,
          elementIdentifier,
          path.join(uploadPath) // Use path.join for consistent file path handling
        );
      }
      return elementStable;
    });
  }
);
