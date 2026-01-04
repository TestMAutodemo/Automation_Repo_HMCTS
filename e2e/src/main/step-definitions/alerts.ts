import { ScenarioWorld } from "./setup/world";
import { When } from "@cucumber/cucumber";
import { logger } from "../logger";
import { expect } from 'playwright/test';;

When(
  /^user clicks the (accept)?(dismiss)? on the alert dialog$/,
  async function (
    this: ScenarioWorld,
    acceptDialog: boolean,
    dismissDialog: boolean
  ) {
    const {
      screen: { page },
    } = this;

    logger.log(
      `user clicks the ${
        dismissDialog ? "dismiss " : "accept "
      }on the alert dialog`
    );

    if (!!dismissDialog) {
      page.on("dialog", (dialog) => dialog.dismiss());
    } else {
      page.on("dialog", (dialog) => dialog.accept());
    }
  }
);

When(
  /^the javascript dialog should contain "([^"]*)" text$/,
  async function (this: ScenarioWorld, expectedText: string) {
    const {
      screen: { page },
      globalVariables,
    } = this;

    logger.log(`the javascript dialog should contain ${expectedText} text`);

    // Verify the content of the popup

    expect(globalVariables["dialogMessage"]).toContain(expectedText);
  }
);
