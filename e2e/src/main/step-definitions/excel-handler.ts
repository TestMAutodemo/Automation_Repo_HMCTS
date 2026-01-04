import { Then } from "@cucumber/cucumber";
import { logger } from "../logger";
import { ScenarioWorld } from "./setup/world";
import path from "path";
import { getMostRecentFileName } from "../support/html-behaviour";
import { updateExcelSheet, updateExcelRow } from "../support/excel-helper";
// import { getAllDataFromExcel } from "../support/excel-helper";

Then(
  /^I update the downloaded excel file, "([^"]*)" excel sheet at "([^"]*)" reference text and header row index at "([^"]*)" with "([^"]*)" json data$/,
  async function (
    this: ScenarioWorld,
    sheetName: string,
    rowTextToUpdate: string,
    columnHeaderRowIndex: string,
    jsonName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    await page.waitForTimeout(parseInt("1", 10) * 1000);
    const columnHeaderStartAt = Number(columnHeaderRowIndex); // Converts to a number

    logger.log(
      `I update the downloaded excel file, ${sheetName} excel sheet at ${rowTextToUpdate} reference text and header row index at ${columnHeaderRowIndex} with ${jsonName} json data`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const directory = path.join(targetDirectory, "temp");

    var fileName = await getMostRecentFileName(directory + "/download");

    await page.waitForTimeout(parseInt("1", 10) * 1000);

    logger.log(`the file name is : ` + fileName);
    if (fileName) {
      let excelPath = path.join(directory, "download", fileName);
      let jsonPath = path.join(directory, "data", `${jsonName}.json`);

      await updateExcelRow(
        excelPath,
        jsonPath,
        sheetName,
        rowTextToUpdate,
        columnHeaderStartAt
      ).catch((error) => console.error("Error:", error));
    }
    await page.waitForTimeout(parseInt("2", 10) * 1000);
  }
);

Then(
  /^I update the downloaded excel file, "([^"]*)" excel sheet with "([^"]*)" json data$/,
  async function (this: ScenarioWorld, sheetName: string, jsonName: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    await page.waitForTimeout(parseInt("1", 10) * 1000);

    logger.log(
      `I update the downloaded excel file, ${sheetName} excel sheet with ${jsonName} json data`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const directory = path.join(targetDirectory, "temp");

    var fileName = await getMostRecentFileName(directory + "/download");

    await page.waitForTimeout(parseInt("1", 10) * 1000);

    logger.log(`the file name is : ` + fileName);
    if (fileName) {
      let excelPath = path.join(directory, "download", fileName);
      let jsonPath = path.join(directory, "data", `${jsonName}.json`);

      await updateExcelSheet(excelPath, sheetName, jsonPath).catch((error) =>
        console.error("Error:", error)
      );
    }
    await page.waitForTimeout(parseInt("2", 10) * 1000);
  }
);
