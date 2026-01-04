import { DataTable, Then } from "@cucumber/cucumber";
import { ElementKey, ElementLocator } from "../../env/global";
import { ScenarioWorld } from "../setup/world";
import { waitFor } from "../../support/wait-for-behaviour";
import { logger } from "../../logger";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { Page, expect } from "playwright/test";
import { rowCountOnTable } from "../../support/html-behaviour";

Then(
  /^on the "([^"]*)" page, the "([^"]*)" table should( not)? equal the following:$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    negate: boolean,
    dataTable: DataTable
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `on the ${fileName}, the ${elementKey} table should ${
        negate ? " not" : ""
      }equal the following:`
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
      const dataBefore = await page.$$eval(
        elementIdentifier + " tbody tr",
        (rows) => {
          return rows.map((row) => {
            const cells = row.querySelectorAll("td");
            return Array.from(cells).map((cell) => cell.textContent);
          });
        }
      );

      console.log(dataBefore);

      return (
        (JSON.stringify(dataBefore) === JSON.stringify(dataTable.raw())) ===
        !negate
      );
    });
  }
);

Then(
  /^on the "([^"]*)" page, the "([^"]*)" table rows should have counts "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    rowCount: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `on the ${fileName}, the ${elementKey} table rows should have ${rowCount} count`
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

    await page.waitForLoadState("load");
    await page.waitForTimeout(parseInt("2", 10) * 1000);
    const result = await rowCountOnTable(page, elementIdentifier);
    console.log(`Row count on the table is: ${result}`);
    expect(rowCount).toBe(result.toString());
  }
);
