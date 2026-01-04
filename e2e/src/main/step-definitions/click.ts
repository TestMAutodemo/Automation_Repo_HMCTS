import { When } from "@cucumber/cucumber";
import {
  clickElement,
  clickToOpenNewTab,
  clickVisibleElement,
  createDirectory,
  downloadFile,
  getAttributeText,
  getMostRecentFileName,
  removeFiles,
  uploadFile,
} from "../support/html-behaviour";
import { ScenarioWorld } from "./setup/world";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { verifyElementLocator } from "../support/web-elements-helper";
import {
  ClickAndSelectMetricCardOperation2,
  ClickMetricCardOperation,
  ClickMetricCardOperation2,
  closedMetricCardFooter,
  expandMetricCard,
} from "../../models/cards";
import path from "path";
import { clickTextOnTreeNode } from "../support/tree-helper";
import { Locator } from "playwright";
import { expect } from "playwright/test";
import { CsvStringifier } from "csv-writer/src/lib/csv-stringifiers/abstract";
import { clickElementByAttributeMatchingText } from "../support/clickElementByAttributeMatchingText";

//! Metric cards - start
When(
  /^on the "([^"]*)" metric card, user clicks the "([^"]*)" (?:link|button|text) for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    criteriaToClick: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementKey} metric card, user clicks the ${criteriaToClick} (link|button) for ${card}, on the ${fileName} page`
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

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await ClickMetricCardOperation(
          page,
          elementIdentifier,
          criteriaToClick,
          card
        );
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);
When(
  /^on the "([^"]*)" metric card header, user clicks to expand for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementKey} metric card header, user clicks to expand for ${card}, on the ${fileName} page`
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

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await expandMetricCard(page, elementIdentifier, card);
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);

// And on the "locations" metric card, user clicks the "Reject" button for "12 Robert Street" at "Outside view of home", on the "Profile Review" page
When(
  /^on the "([^"]*)" metric card, user clicks the "([^"]*)" (?:link|button|text) at "([^"]*)" for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    criteriaToClick: string,
    secondCriteria: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementKey} metric card, user clicks the ${criteriaToClick} (link|button) at ${secondCriteria} for ${card} , on the ${fileName} page`
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

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await ClickMetricCardOperation2(
          page,
          elementIdentifier,
          criteriaToClick,
          card,
          secondCriteria
        );
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);

When(
  /^on the "([^"]*)" metric card, user clicks the "([^"]*)" to selects the "([^"]*)" option at "([^"]*)" for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    criteriaToClick: string,
    toSelect: string,
    secondCriteria: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementKey} metric card, user clicks the ${criteriaToClick} (link|button) to select the ${toSelect} at ${secondCriteria} for ${card} , on the ${fileName} page`
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

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await ClickAndSelectMetricCardOperation2(
          page,
          elementIdentifier,
          criteriaToClick,
          card,
          toSelect,
          secondCriteria
        );
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);

When(
  /^on the "([^"]*)" metric card footer, user clicks the "([^"]*)" (?:link|button|text) for "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    criteriaToClick: string,
    card: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `on the ${elementKey} metric card, user clicks the ${criteriaToClick} (link|button) for ${card} , on the ${fileName} page`
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

    const parts = card.split(",");

    if (globalVariables[parts[0]]) {
      let name = globalVariables[parts[0].trim()];
      let email = globalVariables[parts[1].trim()];
      const joinedString = `${name} (${email})`;
      card = joinedString;
      logger.log("Identification is : " + joinedString);
    }

    logger.log("locator is " + elementIdentifier);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable) {
        logger.log("element is stable to proceed: " + elementStable);

        await closedMetricCardFooter(
          page,
          elementIdentifier,
          card,
          criteriaToClick
        );
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);
//! Metric cards - ends

//! Tree - start
When(
  /^on the "([^"]*)" tree, user clicks the "([^"]*)" (?:link|button|text), on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    criteriaToClick: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `on the ${elementKey} tree, user clicks the ${criteriaToClick} (link|button|text), on the ${fileName} page`
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
        logger.log("element is stable to proceed: " + elementStable);

        await clickTextOnTreeNode(page, elementIdentifier, criteriaToClick);
      } else {
        logger.log("element is stable to proceed: " + elementStable);
      }
      return elementStable;
    });
  }
);
//! Tree - ends

When(
  /^user clicks the "([^"]*)" (button|link|icon|text|text field|radio button|input dropdown|dropdown text|logo), on the "([^"]*)" (?:page|bar|tab|menu|sub menu|popup)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementType: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `🖱️ user clicks '${elementKey}' ${elementType}, on the '${fileName}' page`
    );

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    // 1) Fail fast if mapping is missing/invalid
    if (
      !elementIdentifier ||
      typeof elementIdentifier !== "string" ||
      !elementIdentifier.trim()
    ) {
      const message = `❌ Cannot click '${elementKey}' on '${fileName}' — locator not found in page mappings.`;
      logger.log(message);

      if (this.attach) {
        await this.attach(message, "text/plain");
      }

      throw new Error(message);
    }

    logger.log(`✔️ locator: ${elementIdentifier}`);

    try {
      // 2) Wait until the element is stable/ready (your existing retry loop)
      await waitFor(async () => {
        const elementStable = await waitForSelector(page, elementIdentifier);

        if (elementStable) {
          logger.log(`✅ element is stable: ${elementIdentifier}`);

          const dialogMessage = await clickElement(page, elementIdentifier);
          globalVariables["dialogMessage"] = dialogMessage;
        } else {
          logger.log(`⏳ waiting for element to become stable: ${elementIdentifier}`);
        }

        return elementStable;
      });
    } catch (error) {
      // 3) User-friendly failure + evidence
      const message = `
❌ Failed to click '${elementKey}' ${elementType}
📄 Page: ${fileName}
🔎 Locator: ${elementIdentifier}
💡 Possible causes:
  - Element never became visible/stable (timeout)
  - Element is covered by an overlay
  - Incorrect selector in mappings
  - Click triggered a navigation/dialog unexpectedly
`.trim();

      logger.log(message);

      if (this.attach) {
        await this.attach(message, "text/plain");
        const png = await page.screenshot({ fullPage: true });
        await this.attach(png, "image/png");
      }

      // Keep original error info in console logs for debugging
      logger.log(`Original error: ${String(error)}`);

      throw new Error(message);
    }
  }
);
When(
  /^user clicks the "([^"]*)" icon if visible, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    

    logger.log(`user clicks the ${elementKey} icon, on the ${fileName} page`);

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
      const isVisible = page.locator(elementIdentifier);

      if (await isVisible.isVisible()) {
        const elementStable = await waitForSelector(page, elementIdentifier);
        if (elementStable) {
          logger.log("element is stable to proceed: " + elementStable);
          let dialogMessage = await clickVisibleElement(
            page,
            elementIdentifier
          );
          globalVariables["dialogMessage"] = dialogMessage;
          //let elementLocator = page.locator(elementIdentifier);
          //await isVisible.highlight();
         
        } else {
          logger.log("element is stable to proceed: " + elementStable);
        }
        return elementStable;
      }
      return true;
    });
  }
);





When(
  /^user clicks the "([^"]*)" to open a new tab, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} to open a new tab, on the ${fileName} page`
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
        clickToOpenNewTab(page, elementIdentifier);
      }
      return elementStable;
    });
  }
);

//! TABS
When(
  /^on the "([^"]*)" page, user clicks the "([^"]*)" (?:button|link|icon|element|radio button|text|image) on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab to open popup$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    elementPosition: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    logger.log(
      `on the ${fileName} page, user clicks the ${elementKey} (?:button|link|icon|element|radio button) on the ${elementPosition} tab to open popup`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;
    let pages = context.pages();
    const elementIdentifier = verifyElementLocator(
      pages[pageIndex],
      elementKey,
      globalConfig,
      fileName
    );

    await waitFor(async () => {
      const elementStable = await waitForSelector(
        pages[pageIndex],
        elementIdentifier
      );

      if (elementStable) {
        await clickToOpenNewTab(pages[pageIndex], elementIdentifier);
      }
      return elementStable;
    });
  }
);

When(
  /^on the "([^"]*)" page, user clicks the "([^"]*)" (?:button|link|icon|element|radio button|text|image) on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab$/,
  async function (
    this: ScenarioWorld,
    fileName: string,
    elementKey: ElementKey,
    elementPosition: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    logger.log(
      `on the ${fileName} page, user clicks the ${elementKey} (?:button|link|icon|element|radio button) on the ${elementPosition} tab`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;
    let pages = context.pages();
    const elementIdentifier = verifyElementLocator(
      pages[pageIndex],
      elementKey,
      globalConfig,
      fileName
    );

    await waitFor(async () => {
      const elementStable = await waitForSelector(
        pages[pageIndex],
        elementIdentifier
      );

      if (elementStable) {
        await clickElement(pages[pageIndex], elementIdentifier);
      }
      return elementStable;
    });
  }
);
//! DOWNLOAD
When(
  /^user clicks the "([^"]*)" (?:button|link|icon|element|text|image) to download on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} (?:button|link|icon|element|text|image) to download on the ${fileName} page`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const outputDirectory = path.join(targetDirectory, "temp/download");

    // nested path to check for existence
    var createdDir = await createDirectory(outputDirectory);

    // removeFiles(createdDir); // clean dir

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
        logger.log("element is stable : " + elementStable);
        await downloadFile(page, elementIdentifier, createdDir);
      } else {
        logger.log("element is stable : " + elementStable);
      }
      return elementStable;
    });
  }
);

//! UPLOAD
When(
  /^user clicks the "([^"]*)" (?:button|link|icon|element|text|image) to upload, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} (?:button|link|icon|element|text|image) to upload, on the ${fileName}`
    );

    // nested path to check for existence
    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const directory = path.join(targetDirectory, "temp");

    var file = await getMostRecentFileName(directory + "/download");

    console.log(`File to upload is ${file}`);

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
        let excelPath = path.join(directory, "download", file);
        await uploadFile(page, elementIdentifier, excelPath);
      }
      return elementStable;
    });
  }
);

When(
  /^user clicks the "([^"]*)" with "([^"]*)" attribute, on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    attribute: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user clicks the ${elementKey} with ${attribute}, on the ${fileName}`
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

    const actual = await getAttributeText(page, elementIdentifier, attribute);
    console.log(`the attribute is seen: ${actual}`);

    if (actual === null) {
      return await clickElement(page, elementIdentifier);
    }
  }
);


When(
  /^user clicks the item containing a saved customer name from elements where "([^"]*)" starts with "([^"]*)", on the "([^"]*)" (?:page|bar|tab)$/,
  async function (
    this: ScenarioWorld,
    attribute: string,   // e.g., "data-testid"
    prefix: string,      // e.g., "message"
    fileName: string     // e.g., "Messages"
  ) {
    const {
      screen: { page },
    } = this;

    const elementKey = this.CustomerName; // ✅ From global context
    if (!elementKey) {
      throw new Error(`❌ CustomerName was not set in global context.`);
    }

    const success = await clickElementByAttributeMatchingText(
      page,
      attribute,
      elementKey,
      prefix,
     `[${fileName}]`
    );

    if (!success) {
      const error = `"❌ Could not find element with ${attribute} starting with "${prefix}" containing "${elementKey}"`;
      console.error(error);
      if (this.attach) await this.attach(error, 'text/plain');
      throw new Error(error);
    }
  }
);