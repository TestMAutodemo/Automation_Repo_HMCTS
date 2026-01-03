import { Then } from "@cucumber/cucumber";
import { getTitle } from "../../support/html-behaviour";
import { waitFor } from "../../support/wait-for-behaviour";
import { ScenarioWorld } from "../setup/world";
import { logger } from "../../logger";

Then(
  /^the page title should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, expectedTitle: string, negate: boolean) {
    const {
      screen: { page },

      globalConfig,
    } = this;

    console.log(
      `page title should ${negate ? "not " : ""} be ${expectedTitle}`
    );
    await waitFor(async () => {
      const actualTitle = getTitle(page);
      console.log(await actualTitle);
      return (await actualTitle) === expectedTitle;
    });
  }
);
