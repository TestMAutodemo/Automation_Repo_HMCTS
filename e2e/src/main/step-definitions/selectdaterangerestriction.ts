import { Given, When } from "@cucumber/cucumber";
import { expect } from 'playwright/test';;
import { ScenarioWorld } from "./setup/world";
import { ElementHandle } from 'playwright';
import { ElementKey } from "../env/global";
import { env } from "../env/parseEnv";
import { currentDate } from "../support/html-behaviour";

When(
  /^the user selects a random available date range from calendar with element "([^"]*)" excluding statuses "([^"]*)", on the "([^"]*)" (?:page|tab)$/,
  async function (
    this: ScenarioWorld,
    calendarSelector: string,
    exclusionStatuses: string,
    fileName: string
  ) {
    const {
      screen: { page },
    } = this;

    const excludeTitles = exclusionStatuses.split(',').map(s => s.trim().toLowerCase());

    const calendarCells = await page.$$(calendarSelector);
      
    const isCellAvailable = async (cell: ElementHandle<Element>): Promise<boolean> => {
      const markers = await cell.$$(`.rbc-event-content`);
      for (const marker of markers) {
        const title = (await marker.getAttribute("title"))?.toLowerCase();
        if (title && excludeTitles.includes(title)) {
          return false;
        }
      }
      return true;
    };
    
    const availableCells: ElementHandle<Element>[] = [];

    for (const cell of calendarCells) {
      if (await isCellAvailable(cell)) {
        availableCells.push(cell);
      }
    }

    if (availableCells.length < 2) {
      throw new Error("Not enough available dates to select a range.");
    }

    // Select two consecutive available cells for drag
    let startCell: ElementHandle<Element> | null = null;
    let endCell: ElementHandle<Element> | null = null;

    for (let i = 0; i < availableCells.length - 1; i++) {
      const first = availableCells[i];
      const second = availableCells[i + 1];

      const firstBox = await first.boundingBox();
      const secondBox = await second.boundingBox();

      if (firstBox && secondBox) {
        startCell = first;
        endCell = second;
        break;
      }
    }

    if (!startCell || !endCell) {
      throw new Error("Unable to find two consecutive available dates.");
       
    }

   
    const startBox = await startCell.boundingBox();
    const endBox = await endCell.boundingBox();

    

    if (startBox && endBox) {
      await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
      await page.mouse.up();
    }

    // Store selected start date if needed
    const startDateAttr = (await startCell.innerText()).trim();
   if (!startDateAttr) {
    throw new Error("Selected calendar cell is missing 'data-date' attribute");
      }
    this.selectedDate = startDateAttr;

    console.log(`Selected date range from: ${startDateAttr}`);
    expect(this.selectedDate).toBeTruthy();

}
);