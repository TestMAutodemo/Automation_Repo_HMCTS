import { Then, When } from "@cucumber/cucumber";
import {
  generateGoogleOtp,
  groupedTextfield,
  humanInput,
  inputValue,
} from "../support/html-behaviour";
import { waitFor, waitForSelector } from "../support/wait-for-behaviour";
import { ScenarioWorld } from "./setup/world";
import { ElementKey } from "../env/global";
import { logger } from "../logger";
import { default as data } from "../../tests/config/auth/credentials.json";
import { verifyElementLocator } from "../support/web-elements-helper";
import { maskValueIfSensitive } from "../support/test-data/mask-sensitive";
import { expect } from 'playwright/test';
import { resolveTestValue } from "../../main/support/test-data/resolve-value";
import { logData } from "../support/test-data/logger-data";

//! ADMIN LOGIn GENERIC STEPS:  Please set your admin details on 'credentials.json' file located in 'config/pages'



Then(
  /^user types "([^"]*)" into "([^"]*)" input, on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, valueToken: string, inputKey: ElementKey, fileName: string) {
    const { screen: { page }, globalConfig } = this;

    let locator: string;
    let resolvedValue: string;

    try {
      locator = verifyElementLocator(page, inputKey, globalConfig, fileName);
      resolvedValue = await resolveTestValue(valueToken);
    } catch (err) {
      throw new Error(
        `Failed to prepare typing into inputKey="${inputKey}" page="${fileName}" token="${valueToken}". ` +
        `Original error: ${(err as Error).message}`
      );
    }

    logData("type", valueToken, resolvedValue, { inputKey, locator, page: fileName });

    await waitFor(async () => {
      const el = await waitForSelector(page, locator);
      if (el) {
        await inputValue(page, locator, resolvedValue);
      }
      return el;
    });
  }
);
Then(
  /^user fills the my admin username into "([^"]*)" input, on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, email: ElementKey, fileName: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user fills the my admin username into ${email} input, on the ${fileName} page`
    );

    const emailAddressId = verifyElementLocator(
      page,
      email,
      globalConfig,
      fileName
    );

    logger.log("email : " + emailAddressId);
    await waitFor(async () => {
      const emailAddress = await waitForSelector(page, emailAddressId);

      if (emailAddress) {
        logger.log("element is stable : " + emailAddress);
        await inputValue(page, emailAddressId, data.login.admin.valid.usernameEnv);
      } else {
        logger.log("element is stable : " + emailAddress);
      }
      return emailAddress;
    });
  }
);

Then(
  /^user fills the my admin password into "([^"]*)" input, on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pass: ElementKey, fileName: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `user fills the my admin password into ${pass} input, on the ${fileName} page`
    );

    const passwordId = verifyElementLocator(page, pass, globalConfig, fileName);

    logger.log("password : " + passwordId);
    await waitFor(async () => {
      const password = await waitForSelector(page, passwordId);

      if (password) {
        logger.log("element is stable : " + password);
        await inputValue(page, passwordId, data.login.admin.valid.passwordEnv);
      } else {
        logger.log("element is stable : " + password);
      }
      return password;
    });
  }
);
//! human input 
Then(
  /^user types the "([^"]*)" input with "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(`user types the ${elementKey} input with ${input}`);

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

    if (globalVariables[input]) {
      let value = globalVariables[input];
      input = value;
       var input2: string ; 
       input2=value;
       var splittedinput2=input2.split("+",2);
     
      console.log("input is : " + splittedinput2);
      console.log("input is : " + value);
    }

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await humanInput(page, elementIdentifier, input);
      }
      return elementStable;
    });
  }
);
//! OTP
Then(
  /^user fills the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab with otp generated from the secrete key, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `user fills the ${elementKey} on the ${elementPosition} tab with otp generated from the ${data.login.admin.valid.otpSecretEnv} key, on the ${fileName} page`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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

    globalVariables["pageIndex"] = String(pageIndex);

    await waitFor(async () => {
      let pages = context.pages();
      const elementStable = await waitForSelector(
        pages[pageIndex],
        elementIdentifier
      );

      if (elementStable) {
        var code = await generateGoogleOtp(data.login.admin.valid.otpSecretEnv);

        await inputValue(pages[pageIndex], elementIdentifier, code);
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" with otp generated from the secrete key, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    logger.log(
      `user fills the ${elementKey} with otp generated from the ${data.login.admin.valid.otpSecretEnv} key, on the ${fileName}`
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
        var code = await generateGoogleOtp(data.login.admin.valid.otpSecretEnv);

        await inputValue(page, elementIdentifier, code);
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab with otp generated from the "([^"]*)" key, on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    logger.log(
      `user fills the ${elementKey} on the ${elementPosition} tab with otp generated from the ${input} key, on the ${fileName}`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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
      let pages = context.pages();
      const elementStable = await waitForSelector(
        pages[pageIndex],
        elementIdentifier
      );

      if (elementStable) {
        var code = await generateGoogleOtp(input);

        await inputValue(pages[pageIndex], elementIdentifier, code);
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" input with "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(`user fills the ${elementKey} input with ${input}`);

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

    if (globalVariables[input]) {
      let value = globalVariables[input];
      input = value;
      logger.log("input is : " + value);
    }

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await inputValue(page, elementIdentifier, input);
      }
      return elementStable;
    });
  }
);

Then(
  /^on the "([^"]*)" reference row, user fills the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" input of the "([^"]*)" with "([^"]*)", on the "([^"]*)" (?:page|popup|tab)$/,
  async function (
    this: ScenarioWorld,
    referenceText: string,
    elementPosition: string,
    elementKey: ElementKey,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    const elementIndex = Number(elementPosition.match(/\d/g)?.join("")) + 1;

    logger.log(
      `on the ${referenceText} reference row, user fills the ${elementKey} input with ${input}`
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

    if (globalVariables[input]) {
      let value = globalVariables[input];
      input = value;
      logger.log("input is : " + value);
    }

    logger.log(`element identifier is ${elementIdentifier}`);
    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);

      if (elementStable) {
        await groupedTextfield(
          page,
          elementIdentifier,
          referenceText,
          input,
          elementIndex
        );
      }
      return elementStable;
    });
  }
);

Then(
  /^user fills the "([^"]*)" on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab with the value "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    elementPosition: string,
    input: string,
    fileName: string
  ) {
    const {
      screen: { page, context },
      globalConfig,
    } = this;

    logger.log(
      `user fills the ${elementKey} on the ${elementPosition} tab with the value ${input}, on the ${fileName} page`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

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
      let pages = context.pages();
      const elementStable = await waitForSelector(
        pages[pageIndex],
        elementIdentifier
      );

      if (elementStable) {
        await inputValue(pages[pageIndex], elementIdentifier, input);
      }
      return elementStable;
    });
  }
);
