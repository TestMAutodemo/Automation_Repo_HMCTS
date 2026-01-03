import { Page } from "playwright";

export async function checkUpdateTime(page: Page, elementIdentifier: string) {
  let lastUpdateTime: Date | null = null;

  // Check for time changes
  while (true) {
    const element = page.locator(elementIdentifier);

    const currentTimeText = await element.innerText();
    const currentTime = parseDateTime(currentTimeText);

    if (currentTime) {
      if (lastUpdateTime === null || currentTime > lastUpdateTime) {
        // Check if time has changed
        console.log("Time changed!");
        await logUpdateTime(page, elementIdentifier);
        lastUpdateTime = currentTime;
      }
    }
    await page.waitForTimeout(60000); // Wait for 1 minute before checking again
    await page.reload();
  }
}
// Function to extract and log time
async function logUpdateTime(page: Page, elementIdentifier: string) {
  const element = page.locator(elementIdentifier);

  const currentTimeText = await element.innerText();
  parseDateTime(currentTimeText);
}

function parseDateTime(input: string): Date | null {
  // Regular expression to match the date and time format
  const regex = /(\d{2} \w+ \d{4}) (\d{2}:\d{2}:\d{2})/;

  // Extract date and time parts using regex
  const match = input.match(regex);

  if (match) {
    const dateString = match[1];
    const timeString = match[2];

    // Map month names to numeric values
    const monthNames: { [key: string]: number } = {
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

    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split(" ");

    // Convert month name to numeric value
    const monthNumeric = monthNames[month];

    // Create a Date object using the extracted components
    const parsedDate = new Date(
      `${year}-${monthNumeric + 1}-${day}T${timeString}`
    );

    // Check if the Date object is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  // Return null if the input does not match the expected format
  return null;
}
