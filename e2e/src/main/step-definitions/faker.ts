import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { inputValue } from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { verifyElementLocator } from "../support/web-elements-helper";
import { ScenarioWorld } from "./setup/world";
import {
  getFakeCityAddress,
  getFakeCompanyAddress,
  getFakeCompanyName,
  getFakeCountryAddress,
  getFakeDOB,
  getFakeEmail,
  getFakeFileName,
  getFakeFirstName,
  getFakeFullName,
  getFakeJobTitle,
  getFakeLastName,
  getFakePassword,
  getFakePhoneNumber,
  getFakePostcodeAddress,
  getFakeStateAddress,
  getFakeStreetAddress,
} from "../support/data-generator";
import { expect } from 'playwright/test';;

// Email Address
Then(
  /^user fills the "([^"]*)" input with a fake email address and store as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fakeEmail: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const faker = await getFakeEmail();
    this.Cust_email =faker;

    if (fakeEmail) globalVariables[fakeEmail] = faker;

    logger.log(
      `user fills the ${elementKey} input with a fake email address as store as ${fakeEmail}, on the ${fileName} page`
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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// First Name
Then(
  /^user fills the "([^"]*)" input with a fake first name, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeFirstName();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Last Name
Then(
  /^user fills the "([^"]*)" input with a fake last name, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeLastName();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Full Name
Then(
  /^user fills the "([^"]*)" input with a fake full name and store as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fullName: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const faker = await getFakeFullName();
    this.CustomerName = faker;
    if (fullName) globalVariables[fullName] = faker;

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// FIle Name
Then(
  /^user fills the "([^"]*)" input with a fake file name, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeFileName();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" input with a fake company name, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeCompanyName();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);
Then(
  /^user fills the "([^"]*)" input with a fake company address, on the "([^"]*)" (?:page|popup|tab)$/,
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

    const faker = await getFakeCompanyAddress();
    const addressComponents = faker.split(",");
    globalVariables["postcode"] = addressComponents[3].trim();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);
Then(
  /^user fills the "([^"]*)" input with a fake company postcode, on the "([^"]*)" (?:page|popup|tab)$/,
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

    const retrievedValue = globalVariables["postcode"];

    logger.log(`user fills the ${elementKey} input with ${retrievedValue}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, retrievedValue);
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" input with a fake phone number and store as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fakePhoneNumber: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const faker = await getFakePhoneNumber();
    if (fakePhoneNumber) globalVariables[fakePhoneNumber] = faker;

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Job Title
Then(
  /^user fills the "([^"]*)" input with a fake job title and store as "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fakeJobTitle: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const faker = await getFakeJobTitle();
    if (fakeJobTitle) globalVariables[fakeJobTitle] = faker;

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Password
Then(
  /^user fills the "([^"]*)" input with a fake password of length "([^"]*)" characters, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    passwordLength: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakePassword(parseInt(passwordLength));

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Street
Then(
  /^user fills the "([^"]*)" input with a fake street address, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeStreetAddress();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// City
Then(
  /^user fills the "([^"]*)" input with a fake city, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeCityAddress();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// State
Then(
  /^user fills the "([^"]*)" input with a fake state, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeStateAddress();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Country
Then(
  /^user fills the "([^"]*)" input with a fake country, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeCountryAddress();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// Postcode
Then(
  /^user fills the "([^"]*)" input with a fake postcode, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakePostcodeAddress();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);

// DOB
Then(
  /^user fills the "([^"]*)" input with a fake date of birth, on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const faker = await getFakeDOB();

    logger.log(`user fills the ${elementKey} input with ${faker}`);

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

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, faker);
      }
      return elementStable;
    });
  }
);
