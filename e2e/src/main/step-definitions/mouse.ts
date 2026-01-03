import { When } from "@cucumber/cucumber";
import { logger } from "../logger";
import { KeyboardEnterElement, mouseMove } from "../support/html-behaviour";
import { waitFor } from "../support/wait-for-behaviour";
import { ScenarioWorld } from "./setup/world";

When(/^user press enter in textfield$/, async function (this: ScenarioWorld) {
  const {
    screen: { page },
  } = this;

  logger.log(`user press enter in textfield`);

  await KeyboardEnterElement(page);
});

When(
  /^user clicks the coordinates of the x-axis "([^"]*)" and the y-axis "([^"]*)", on the "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" tab$/,
  async function (
    this: ScenarioWorld,
    x_axis: number,
    y_axis: number,
    elementPosition: string
  ) {
    const {
      screen: { context },
    } = this;

    logger.log(
      `user clicks the coordinates of x-axis ${x_axis} and ${y_axis} on the ${elementPosition} tab`
    );

    const pageIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    await waitFor(async () => {
      let pages = context.pages();

      await mouseMove(pages[pageIndex], x_axis, y_axis);
    });
  }
);
