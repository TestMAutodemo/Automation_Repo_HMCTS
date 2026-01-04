import { When } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import { ScenarioWorld } from "./setup/world";

When(
  /^the user selects a random available date from calendar with element "([^"]*)" excluding statuses "([^"]*)", on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    calendarSelector: string,
    exclusionStatuses: string,
    fileName: string
  ) {
    const {
      screen: { page },
    } = this;

    console.log(`Using selector: ${calendarSelector}`);
    console.log(`Excluding statuses: ${exclusionStatuses}`);

    const excludeArray = exclusionStatuses.split(",").map((s) => s.trim());

    const dateElements = page.locator(`div.${calendarSelector}`);

    const filtered = dateElements.filter({
      hasNotText: new RegExp(excludeArray.join("|"), "i"),
    });

    const count = await filtered.count();

    if (count === 0) {
      throw new Error("No available dates found in the calendar.");
    }

    const randomIndex = Math.floor(Math.random() * count);
    const selectedDate = filtered.nth(randomIndex);

    const dateAttr = await (await (selectedDate.innerText())).trim();

    if (dateAttr) {
     this.selectedDate = dateAttr;
    }; // store in world if needed

    console.log(`Selected date: ${dateAttr}`);
    await selectedDate.click();

    expect(dateAttr).toBeTruthy();
  }
);
