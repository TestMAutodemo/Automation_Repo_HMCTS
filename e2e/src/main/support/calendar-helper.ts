import { Page } from "playwright";

// Map month names to their corresponding numbers
const monthNameToNumber = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export async function selectDateOnCalendar(
  page: Page,
  calendarSelector: string,
  targetDay: string,
  targetMonth: string,
  targetYear: string
) {
  while (true) {
    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based index
    const currentDay = currentDate.getDate();

    // Extract the calendar title (month and year)
    const titleElement = await page.$(
      `${calendarSelector} .ui-datepicker-title`
    );
    const titleText = await titleElement?.textContent();

    // Split the title text using a regular expression to match whitespace characters
    const [calendarMonth, calendarYear] =
      titleText?.split(/\s+/).map((part) => part.trim()) || [];

    // Parse target date values into numbers
    const targetYearNum = parseInt(targetYear, 10);
    const targetMonthNum = monthNameToNumber[targetMonth];
    const targetDayNum = parseInt(targetDay, 10);

    // Compare the calendar month/year with the target
    const calendarMonthNum = new Date(
      Date.parse(`1 ${calendarMonth} ${calendarYear}`)
    ).getMonth(); // Get month number from month name
    const calendarYearNum = parseInt(calendarYear, 10);

    if (
      currentYear === targetYearNum &&
      currentMonth === targetMonthNum &&
      currentDay === targetDayNum
    ) {
      // If the target date is the same as the current date, simply click the current date
      console.log(`Clicking on current day: ${currentDay}`);
      await page.click(`${calendarSelector} .ui-datepicker-current-day`);
      return;
    } else if (
      calendarYearNum === targetYearNum &&
      calendarMonthNum === targetMonthNum
    ) {
      // If the calendar month and year match the target, find and click the target day
      const calendarCells = await page.$$(
        `${calendarSelector} .ui-datepicker-calendar tbody td`
      );

      for (const cell of calendarCells) {
        const cellText = await cell.textContent();
        if (cellText === targetDayNum.toString()) {
          await cell.click();
          return;
        }
      }

      console.error(`Target day ${targetDayNum} not found in the calendar`);
      break;
    } else if (
      calendarYearNum < targetYearNum ||
      (calendarYearNum === targetYearNum && calendarMonthNum < targetMonthNum)
    ) {
      // Click on the next month button
      const nextButton = await page.$(
        `${calendarSelector} .ui-datepicker-next`
      );
      if (nextButton) {
        await nextButton.click();
      } else {
        console.error("Next month button not found");
        break;
      }
    } else {
      // Click on the previous month button
      const prevButton = await page.$(
        `${calendarSelector} .ui-datepicker-prev`
      );
      if (prevButton) {
        await prevButton.click();
      } else {
        console.error("Previous month button not found");
        break;
      }
    }
  }

  // If the target month/year was not found, you can handle it here
  console.error("Target month/year not found in the calendar");
}
