import { When } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import path from "path";
import fs from "fs";
import { ScenarioWorld } from "./setup/world";
import { readJSONFilesRecursive } from "../support/csv-helper";
import {
  generateGoogleOtp,
  getMostRecentFileName,
  inputValue,
  uploadFile,
} from "../support/html-behaviour";
import { Locator } from 'playwright/test';


When(
  /^the user selects a random available date range of (\d+) days from calender "([^"]*)" excluding statuses "([^"]*)", on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    rangeLength: string,
    calendarSelector: string,
    exclusionStatuses: string,
    fileName: string
  ) {
    const {
      screen: { page }
    } = this;

    

    const daysToSelect = parseInt(rangeLength);
    
     if (daysToSelect < 2) {
      const error = `❌ Invalid range length: ${daysToSelect}. Minimum is 2 days.`;
      console.error(error);
      if (this.attach) await this.attach(error, 'text/plain');
      throw new Error(error);
       }
    const exclusionArray = exclusionStatuses.split(',').map(s => s.trim());
    const today = new Date();
    let monthCounter = 0;
    let found = false;

    const isDateCellExcluded = async (cell: Locator): Promise<boolean> => {
  const cellHandle = await cell.elementHandle();
  if (!cellHandle) return true;

  const box = await cellHandle.boundingBox();
  if (!box) return true;

  for (const status of exclusionArray) {
    const markers = page.locator(`.rbc-event-content[title="${status}"]`);
    const count = await markers.count();

    for (let i = 0; i < count; i++) {
      const marker = markers.nth(i);
      const markerHandle = await marker.elementHandle();
      if (!markerHandle) continue;

      const markerBox = await markerHandle.boundingBox();
      if (!markerBox) continue;

      const overlaps =
        markerBox.x < box.x + box.width &&
        markerBox.x + markerBox.width > box.x;

      if (overlaps) return true;
    }
  }

  return false;
}

    while (monthCounter < 6 && !found) {
      const dateButtons = page.locator(`.${calendarSelector} button.rbc-button-link`);
      console.log(`⏳ Waiting for calendar to render...`);
      await dateButtons.first().waitFor({ timeout: 3000 });
      console.log(`✅ Calendar rendered.`)
      const totalDates = await dateButtons.count();

      const calendarLabel = await page.locator('.rbc-toolbar-label').innerText(); // e.g., "July 2025"
      const [monthName, yearStr] = calendarLabel.split(" ");
      const calendarMonth = new Date(`${monthName} 1, ${yearStr}`).getMonth();
      const calendarYear = parseInt(yearStr);

  const isFirstMonth = (monthCounter === 0);

   for (let i = 0; i <= totalDates - daysToSelect; i++) {
  let valid = true;
  const buttons: Locator[] = [];

   for (let j = 0; j < daysToSelect; j++) {
    const btn = dateButtons.nth(i + j);
    const parent = btn.locator('..');
    const text = (await btn.innerText()).trim();

    const offRange = await parent.evaluate(el => el.classList.contains('rbc-off-range'));
    const dateNumber = parseInt(text);

    // If day text is not a number (e.g., empty), skip
    if (isNaN(dateNumber)) {
      valid = false;
      break;
    }

    const dateObj = new Date(calendarYear, calendarMonth, dateNumber);
    const isPast = isFirstMonth && dateObj < new Date(today.setHours(0, 0, 0, 0));

    if (offRange || isPast || await isDateCellExcluded(parent)) {
      valid = false;
      console.log(`⛔ Skipping range starting ${await dateButtons.nth(i).innerText()} due to issue on ${text}`);
      break;
    }

    buttons.push(btn);
  }
        if (valid) {
          console.log(`✅ Selecting date range: ${await buttons[0].innerText()} → ${await buttons[buttons.length - 1].innerText()}`);

          const firstBox = await buttons[0].boundingBox();
          const lastBox = await buttons[buttons.length - 1].boundingBox();
          if (firstBox && lastBox) {
            await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
            await page.mouse.down();
            await page.mouse.move(lastBox.x + lastBox.width / 2, lastBox.y + lastBox.height / 2, { steps: 10 });
            await page.mouse.up();
          }

          this.selectedDate = `${await buttons[0].innerText()} to ${await buttons[buttons.length - 1].innerText()}`;
          found = true;
          break;
        }
      }

      if (!found) {
        const nextButton = page.locator('button', { hasText: 'Next' });
        if (await nextButton.isVisible()) {
          await nextButton.click();
           await page.waitForTimeout(200);
           const updatedDateButtons = page.locator(`.${calendarSelector} button.rbc-button-link`);
           console.log(`⏳ Waiting for calendar to render...`);
           await updatedDateButtons.first().waitFor({ timeout: 3000 });
           console.log(`✅ Calendar rendered.`)
           monthCounter++;
        } else {
          break;
        }
      }
    }

    if (!found) {
      const msg = `❌ No valid ${rangeLength}-day date range found within 6 months.`;
      console.error(msg);
      if (this.attach) {
        await this.attach(msg, 'text/plain');
        const screenshot = await page.screenshot();
        await this.attach(screenshot, 'image/png');
      }
      throw new Error(msg);
    }

    expect(this.selectedDate).toBeTruthy();
  }
);