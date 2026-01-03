import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";

Then(
  /^user scrolls to the bottom of the page$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    // Get the height of the page content
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll to the bottom of the page
    await page.evaluate((height) => {
      window.scrollTo(0, height);
    }, pageHeight);

    // Wait for a brief moment to allow the page to finish scrolling
    await page.waitForTimeout(1000);
  }
);
