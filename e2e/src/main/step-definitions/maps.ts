import { When } from "@cucumber/cucumber";
import { logger } from "../logger";
import { clickInMap, zoomInMap, zoomOutMap } from "../support/html-behaviour";
import { waitFor } from "../support/wait-for-behaviour";
import { ScenarioWorld } from "./setup/world";

When(/^user clicks the map to zoom in$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  logger.log(`user clicks the map to zoom in`);

  await waitFor(async () => {
    await zoomInMap(page);
  });
});

When(/^user clicks the map to zoom out$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  logger.log(`user clicks the map to zoom out`);

  await waitFor(async () => {
    await zoomOutMap(page);
  });
});

When(
  /^user clicks the icon with title "([^"]*)" on map$/,
  async function (this: ScenarioWorld, title: string) {
    const {
      screen: { page },
    } = this;

    logger.log(`user clicks the icon with title ${title} on map`);

    await waitFor(async () => {
      await clickInMap(page, title);
    });
  }
);
