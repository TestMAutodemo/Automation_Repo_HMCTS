import { ElementLocator } from "../env/global";
import { waitFor, waitForSelector } from "./wait-for-behaviour";
import { authenticator } from "otplib";
import { Page, Frame, ElementHandle, Locator } from "playwright";
import { logger } from "../logger";
import makeDir from "make-dir";
import fs from "fs";
import path from "path";
import _ from "lodash";
import { expect } from 'playwright/test';;
import { env, envNumber } from "../env/parseEnv";
import { forEach } from "jszip";

/**
 * Click Element
 * @param page
 * @param elementIdentifier
 */
export const clickElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  // Capture ONE dialog if it appears, then auto-accept.
  let dialogMessage = "";

  const dialogPromise = page
    .waitForEvent("dialog", { timeout: 3000 })
    .then(async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    })
    .catch(() => {
      // No dialog appeared within 3s — that's fine.
    });

  const locator = page.locator(elementIdentifier);

  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: "visible", timeout: envNumber("SELECTOR_TIMEOUT") });

  // Optional debug highlight (wrap in try so it never breaks the test)
  try {
    await locator.highlight();
  } catch {}

  // Click; do NOT always wait for "load" (only if navigation happens)
  await locator.click();

  // Ensure we don't leave a pending dialog handler
  await dialogPromise;

  return dialogMessage;
};

export const clickVisibleElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  let dialogMessage = "";
  page.on("dialog", async (dialog) => {
    // Handle the dialog here
    console.log(`Dialog type: ${dialog.type()}`);
    console.log(`Dialog message: ${dialog.message()}`);
    dialogMessage = dialog.message();
    // dialog.accept(); //! this is already handled on default, hence no need to re-handle it here.
  });
  const isVisible = await page.locator(elementIdentifier).isVisible();
  if (isVisible) {
    // Element is visible, perform actions.
    const locator = page.locator(elementIdentifier);
    await locator.highlight();
   
    await locator.click();
    await page.waitForLoadState("load");
  } else {
    // Element is not visible or not found, log a message.
    console.log("Element is not visible or not found.");
  }
  return dialogMessage;
};

export function getFormattedDate(): string {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = today.toLocaleString("default", { month: "short" }).slice(0, 3); // Get the first three characters of the month
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

export async function containsExactMatch(
  page: Page,
  elementIdentifier: ElementLocator,
  target: string
): Promise<boolean> {
  let allText = await page.locator(elementIdentifier).innerText();
  const regex = new RegExp(`\\b${target}\\b`, "i");
  return regex.test(allText);
}

export async function clickCenterOfElement(
  page: Page,
  elementIdentifier: string
): Promise<void> {
  const locator = page.locator(elementIdentifier);
  const isVisible = await locator.isVisible();

  if (isVisible) {
    // Get the bounding box of the element
    const boundingBox = await locator.boundingBox();

    // Calculate the center coordinates
    if (boundingBox) {
      const elementX = boundingBox.x + boundingBox.width / 2;
      const elementY = boundingBox.y + boundingBox.height / 2;

      // Scroll to the element if it's not visible in the viewport
      await locator.scrollIntoViewIfNeeded();

      // Simulate a click on the center of the element
      await page.mouse.click(elementX, elementY);
    } else {
      console.error("Element does not have a bounding box.");
    }
  } else {
    console.error("Element is not visible.");
  }
}

/**
 * Keyboard Enter Element
 * @param page
 */
export const KeyboardEnterElement = async (page: Page): Promise<void> => {
  await page.keyboard.press("Enter");
};

export async function getLocatorColor(
  page: Page,
  locator: string,
  targetColor: string
): Promise<string> {
  const elementColor = await page.$eval(
    locator,
    (element, targetColor) => {
      const computedStyle = getComputedStyle(element);
      return computedStyle.getPropertyValue(targetColor);
    },
    targetColor
  );

  return elementColor;
}

export function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g); // Extract the numeric values from the string
  if (!match || match.length !== 4) {
    throw new Error("Invalid RGB color value");
  }

  const [r, g, b] = match.map((component) => parseInt(component, 10)); // Convert the components to integers
  const red = r.toString(16).padStart(2, "0"); // Convert red component to hex
  const green = g.toString(16).padStart(2, "0"); // Convert green component to hex
  const blue = b.toString(16).padStart(2, "0"); // Convert blue component to hex

  return `#${red}${green}${blue}`; // Combine the hex components
}

export const KeyboardMoveDownAndEnter = async (page: Page): Promise<void> => {
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
};

export const mouseMove = async (
  page: Page,
  x_axis: number,
  y_axis: number
): Promise<void> => {
  await page.mouse.move(x_axis, y_axis);
};

export const clickToOpenNewTab = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<any> => {
  const [] = await Promise.all([
    page.waitForEvent("popup"),
    page.locator(elementIdentifier).click(),
  ]);
};

export const currentDate = async (): Promise<string> => {
  var todayDate = new Date().toISOString().slice(0, 10);
  return todayDate;
};

export const generateGoogleOtp = async (key: string): Promise<string> => {
  const secret = `${key}`;
  const token = authenticator.generate(secret);
  console.log("here is my token " + token);

  try {
    const isValid = authenticator.verify({ token, secret });
  } catch (err) {
    console.error(err);
  }
  return token.toString();
};

const clickWithinElement = async (
  page: Page,
  element: Locator
): Promise<void> => {
  // Hover over the input element to trigger the hover state
  await element.hover();

  // Get the bounding box of the input element
  const boundingBox = await element.boundingBox();

  // Check if the bounding box is null
  if (!boundingBox) {
    console.error("Element is not visible or not in the DOM.");
    return;
  }

  // Calculate the center point of the input element's bounding box
  const centerX = boundingBox.x + boundingBox.width / 2;
  const centerY = boundingBox.y + boundingBox.height / 2;

  // Move the mouse cursor to the center of the input element
  await page.mouse.move(centerX, centerY);
};

export const hoverElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  let element = page.locator(elementIdentifier);
  await element.hover();
};

export const inputValue = async (
  page: Page,
  elementIdentifier: ElementLocator,
  input: string
): Promise<void> => {
  const locator = page.locator(elementIdentifier);
  if (await locator.isEditable()) {
    await locator.highlight();
    await locator.clear();
    await locator.type(input);
  }
};

async function typeWithDelay(page:Page, locator:Locator, text:string, delay:number = 100){
  for(const char of text){
    await locator.type(char);
    await page.waitForTimeout(delay+Math.random() * 50)
  }
}

export const humanInput = async (
  page: Page,
  elementIdentifier: ElementLocator,
  input: string
): Promise<void> => {
  const locator = page.locator(elementIdentifier);
  
 
  if (await locator.isEditable()) {
    await locator.highlight();
    await locator.clear(); //  to be considered
    await typeWithDelay(page, locator, input);
  }
};


export const splitemail = async (
  page: Page,
  elementIdentifier: ElementLocator,
  input: string
): Promise<void> => {
  const locator = page.locator(elementIdentifier);
  var input2: string ; 
  input2=input;
  var splittedinput2=input2.split("+",2);
 console.log("input is : " + splittedinput2[0]);
 console.log("input is : " + splittedinput2[1]);
 var input3:string;
 input3=splittedinput2[1];
 var splittedinput3=input3.split("@",2);
 let num: number = parseInt(splittedinput3[0]);
 var x=num;
 var y:number=x+1;
 var nextemailid= splittedinput2[0]+"+"+y+"@gmail.com"
 console.log(nextemailid);
  if (await locator.isEditable()) {
    await locator.highlight();
    await locator.clear(); //  to be considered
    await typeWithDelay(page, locator, input);
  }
};

export const checkElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const isChecked = await isCheckElement(page, elementIdentifier);
  if (!isChecked) {
    const locator = page.locator(elementIdentifier);

    await locator.highlight();
    await locator.check();
  }
};

export const scrollIntoView = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const element = page.locator(elementIdentifier);
  await element.scrollIntoViewIfNeeded();
};

export const getAttributeText = async (
  page: Page,
  elementIdentifier: ElementLocator,
  attribute: string
): Promise<string | null> => {
  const attr = await page.locator(elementIdentifier).getAttribute(attribute);
  return attr;
};

export const isActive = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  var classAttribute = await page
    .locator(elementIdentifier)
    .getAttribute("class");
  var isTrue = false;
  if (classAttribute?.includes("active")) {
    isTrue = true;
  }
  return isTrue;
};

export const getValue = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  const locator = page.locator(elementIdentifier);
  await locator.highlight();
  return await locator.inputValue();
};

export const getTitle = async (page: Page): Promise<any> => {
  var actualTitle = page.title;

  return actualTitle;
};

export const uncheckElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const locator = page.locator(elementIdentifier);
  await locator.highlight();
  await locator.uncheck();
};

export const isCheckElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  const locator = page.locator(elementIdentifier);
  await locator.highlight();
  const isChecked = await locator.getAttribute("checked");
  const checked = isChecked === "checked"; // Check if the attribute value is "checked"
  return checked;
};

export const CheckElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const locator = page.locator(elementIdentifier);
  await locator.highlight();
  locator.click();
};

export const getIframeElement = async (
  page: Page,
  iframeIdentifier: ElementLocator
): Promise<Frame | undefined | null> => {
  await page.waitForSelector(iframeIdentifier);
  const elementHandle = await page.$(iframeIdentifier);
  const elementIframe = await elementHandle?.contentFrame();
  return elementIframe;
};

export const inputValueOnIframe = async (
  elementIframe: Frame,
  elementIdentifier: ElementLocator,
  inputValue: string
): Promise<void> => {
  await elementIframe.fill(elementIdentifier, inputValue);
};

export const inputValueOnPage = async (
  pages: Array<Page>,
  pageIndex: number,
  elementIdentifier: ElementLocator,
  inputValue: string
): Promise<void> => {
  const locator = pages[pageIndex].locator(elementIdentifier);
  await locator.highlight();
  await locator.clear();
  await locator.fill(inputValue);
};

export const scrollElementIntoView = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const element = page.locator(elementIdentifier);
  await element.scrollIntoViewIfNeeded();
};

export const getElement = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
  const element = await page.$(elementIdentifier);
  return element;
};

// export const getElements = async (
//   page: Page,
//   elementIdentifier: ElementLocator
// ): Promise<ElementHandle<SVGElement | HTMLElement>[]> => {
//   const elements = await page.$$(elementIdentifier);
//   return elements;
// };

export const getElementAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  index: number
): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
  const elementAtIndex = await page.$(`${elementIdentifier}>>nth=${index}`);
  return elementAtIndex;
};

export const getElementValue = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const value = await page.$eval<string, HTMLSelectElement>(
    elementIdentifier,
    (el) => {
      return el.value;
    }
  );
  return value;
};

export const getElementWithinIframe = async (
  elementIframe: Frame,
  elementIdentifier: ElementLocator
): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
  const visibleOnIframeElement = await elementIframe?.$(elementIdentifier);
  return visibleOnIframeElement;
};

export const getTextWithinIframeElement = async (
  elementIframe: Frame,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const textOnIframeElement = await elementIframe?.textContent(
    elementIdentifier
  );
  return textOnIframeElement;
};

export const getTitleWithinPage = async (
  page: Page,
  pages: Array<Page>,
  pageIndex: number
): Promise<string | null> => {
  const titleWithinPage = await pages[pageIndex].title();
  return titleWithinPage;
};

export const getElementOnPage = async (
  page: Page,
  elementIdentifier: ElementLocator,
  pages: Array<Page>,
  pageIndex: number
): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
  const elementOnPage = await pages[pageIndex].$(elementIdentifier);
  return elementOnPage;
};

export const getElementTextWithinPage = async (
  page: Page,
  elementIdentifier: ElementLocator,
  pages: Array<Page>,
  pageIndex: number
): Promise<string | null> => {
  const textWithinPage = await pages[pageIndex].textContent(elementIdentifier);
  return textWithinPage;
};

export const getElementText = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const text = await page.textContent(elementIdentifier);
  return text;
};

export const getElementTextAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  index: number
): Promise<string | null> => {
  const textAtIndex = await page.textContent(
    `${elementIdentifier}>>nth=${index}`
  );
  return textAtIndex;
};

export const getTableData = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  const table = await page.$$eval(elementIdentifier + " tbody tr", (rows) => {
    return rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells).map((cell) => cell.textContent);
    });
  });
  return JSON.stringify(table);
};

export const elementEnabled = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  const enabled = await page.isEnabled(elementIdentifier);
  return enabled;
};

export const elementDisabled = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  const disabled = await page.isDisabled(elementIdentifier);
  return disabled;
};

export const elementChecked = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  const checked = await page.isChecked(elementIdentifier);
  return checked;
};

export const getList = async (
  page: Page,
  elementIdentifier: ElementLocator,
  expected: string
): Promise<boolean> => {
  const list = await page.locator(elementIdentifier).locator("li").all();

  let result = false;
  for (const item of list) {
    let actual = (await item.innerText()).replace(/\s+/g, " ").trim();
    console.log(`\n\nexpected: ${expected}\n actual: ${actual} \n\n`);
    if (actual === expected) {
      console.log(`\n\nexpected: ${expected}\n actual: ${actual} \n\n`);
      result = true;
      break;
    }
  }
  return result;
};

export const getElements = async (
  page: Page,
  elementIdentifier: ElementLocator,
  expected: string
): Promise<boolean> => {
  const elements = await page.locator(elementIdentifier).all(); // collect elements

  let result = false;
  for (const element of elements) {
    let actual = (await element.innerText()).trim();
    console.log(`the text from the list is ${actual}`);
    if (actual === expected) {
      result = true;
      break;
    }
  }
  return result;
};

export const getLists = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<any> => {
  return await page.locator(elementIdentifier).allInnerTexts();
};

export const clickElementAtIndex = async (
  page: Page,
  elementIdentifier: ElementLocator,
  elementPosition: number
): Promise<void> => {
  const element = page.locator(`${elementIdentifier}>>nth=${elementPosition}`);
  await element?.click();
};

export const reloadPage = async (page: Page): Promise<void> => {
  await page.reload();
};

export const getText = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  const locator = page.locator(elementIdentifier);
  let text = "";
  if ((await locator.all()).length > 1) {
    for (const element of await locator.all()) {
      await element.highlight();
      const innerText = (await element.innerText()).replace(/\s*,\s*/g, ",");
      text += innerText + ", ";
    }
    // Remove the trailing comma and whitespace
    text = text.slice(0, -2);
    console.log(`text = (${text})`);
  } else {
    await locator.highlight();
    text = await locator.innerText();
    console.log(`Found text: ${text}`);
  }
  return text.trim();
};

export const getVisibleText = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  const locator = page.locator(elementIdentifier);
  let text = "";
  if (await locator.isVisible()) {
    if ((await locator.all()).length > 1) {
      for (const element of await locator.all()) {
        await element.highlight();
        const innerText = (await element.innerText()).replace(/\s*,\s*/g, ",");
        text += innerText + ", ";
      }
      // Remove the trailing comma and whitespace
      text = text.slice(0, -2);
      console.log(`text = (${text})`);
    } else {
      await locator.highlight();
      text = await locator.innerText();
      console.log(`Found text: ${text}`);
    }
  }
  return text.trim();
};

export const getDownloadedFileName = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string> => {
  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("" + elementIdentifier + "").click(),
  ]);
  // Wait for the download process to complete
  console.log(await download.path());
  const fileName = download.suggestedFilename();
  return fileName;
};

export const downloadFile = async (
  page: Page,
  elementIdentifier: ElementLocator,
  path: string
): Promise<any> => {
  const downloadEvent = page.waitForEvent("download", { timeout: 80000 }); // Wait for 80 seconds
  // Perform the action that initiates download
  await page.locator("" + elementIdentifier + "").click();

  const download = await downloadEvent;

  // Wait for the download process to complete
  const suggestedFileName = download.suggestedFilename();
  const downloadPath = path + "/" + suggestedFileName;

  // Determine the new file name and path
  const renamedDownloadPath = await getUniqueFileName(downloadPath);

  // Save downloaded file with the new name
  await download.saveAs(renamedDownloadPath);
  logger.log(renamedDownloadPath);
};

// get unique file name
async function getUniqueFileName(filePath: string): Promise<string> {
  let newFilePath = filePath;
  let counter = 1;

  while (await exists(newFilePath)) {
    const parsedPath = path.parse(filePath);
    newFilePath = path.join(
      parsedPath.dir,
      `${parsedPath.name}_${counter}${parsedPath.ext}`
    );
    counter++;
  }

  return newFilePath;
}

// check if already exists
async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export const uploadFile = async (
  page: Page,
  elementIdentifier: ElementLocator,
  filePath: string
): Promise<void> => {
  let locator = page.locator(elementIdentifier);
  await locator.highlight();
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent("filechooser"),
    await locator.click(),
  ]);
  await fileChooser.setFiles(filePath);
  console.log(`File uploaded successfully!`);
};

export const createDirectory = async (path: string): Promise<string> => {
  return await makeDir(path);
};

export function getMostRecentFileName(
  directoryPath: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const fileNames = files.filter((fileName) => {
        const filePath = path.join(directoryPath, fileName);
        return fs.statSync(filePath).isFile();
      });

      fileNames.sort((a, b) => {
        const filePathA = path.join(directoryPath, a);
        const filePathB = path.join(directoryPath, b);
        return fs.statSync(filePathB).mtimeMs - fs.statSync(filePathA).mtimeMs;
      });

      const mostRecentFileName = fileNames.length > 0 ? fileNames[0] : null;
      resolve(mostRecentFileName);
    });
  });
}

export function removeFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    return;
  }
  const files = fs.readdirSync(folderPath);
  files.forEach((fileName) => {
    const filePath = `${folderPath}/${fileName}`;
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  });
}

export const doubleClick = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  let element = page.locator(elementIdentifier);
  await element.dblclick();
};

/**
 *
 * @param page
 * @param elementIdentifier | #ui-id-6>li
 * @param value
 */
export const selectExactMatchFromDropdown = async (
  page: Page,
  elementIdentifier: string,
  value: string
): Promise<void> => {
  const optionSelector = `${elementIdentifier}//a`;

  const elementStable = await waitForSelector(page, optionSelector);

  if (elementStable) {
    logger.log("element is stable : " + elementStable);
    const options = await page.$$(optionSelector);

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const text = await option.textContent();
      if (text) {
        let expected = value.toLowerCase().trim();
        let actual = text.toLowerCase().trim();
        console.log(`expected is ${expected} and actual is ${actual}`);
        if (actual === expected) {
          await page.waitForTimeout(500);
          await page.evaluate((el) => el.scrollIntoView(), option); // Scroll the element into view if needed
          console.log(`trying to click ${await option.innerText()}`);

          const locator = page
            .getByRole("listitem")
            .filter({ hasText: `${text}` });

          await locator.waitFor();
          await locator.highlight();
          await locator.click();

          break;
        } else {
          console.log(`No text found...`);
        }
      }
    }
  } else {
    logger.log("element is stable : " + elementStable);
  }
};

export const removeExactMatchFromDropdown = async (
  page: Page,
  elementIdentifier: string,
  value: string
): Promise<void> => {
  await page
    .locator(elementIdentifier)
    .filter({ hasText: `${value}` })
    .getByRole("link")
    .click();
};

export const selectTextFromList = async (
  page: Page,
  elementIdentifier: string,
  options: string
): Promise<void> => {
  // check for button
  const button = await page
    .locator(elementIdentifier)
    .locator("button")
    .isVisible();

  if (button) {
    // click to open
    await page.locator(elementIdentifier).locator("button").click();
  }

  const values = options
    .split(",")
    .map((value) => value.trim().replace(/\s/g, ""));

  const isLi = await page
    .locator(elementIdentifier)
    .locator("li")
    .first()
    .isVisible();

  const isA = await page
    .locator(elementIdentifier)
    .locator("a")
    .first()
    .isVisible();

  let locators;
  if (isLi) {
    locators = page.locator(elementIdentifier).locator("li").all();
  } else if (isA) {
    locators = page.locator(elementIdentifier).locator("a").all();
  }
  await page.waitForTimeout(500);
  for (const optionElement of await locators) {
    const text = await optionElement.textContent();
    if (text) {
      const trimmedText = text.trim().replace(/\n/g, " ").replace(/\s/g, "");
      console.log(`actual trimmed text from li is ${trimmedText}`);

      if (trimmedText.includes(values)) {
        console.log(`li text match ${trimmedText}`);
        await optionElement.click();
        // Add a delay if needed between selections
        await page.waitForTimeout(500);
        if (values.length === 1) {
          break;
        }
      }
    }
  }

  if (button) {
    // click to close
    await page.locator(elementIdentifier).locator("button").click();
  }
};

export const multiSelectTextFromList = async (
  page: Page,
  elementIdentifier: string,
  options: string
): Promise<void> => {
  // check for button
  const button = await page
    .locator(elementIdentifier)
    .locator("button")
    .isVisible();

  if (button) {
    // click to open
    await page.locator(elementIdentifier).locator("button").click();
  }

  const values = options
    .split(",")
    .map((value) => value.trim().replace(/\s/g, ""));

  const isLi = await page
    .locator(elementIdentifier)
    .locator("li")
    .first()
    .isVisible();

  const isA = await page
    .locator(elementIdentifier)
    .locator("a")
    .first()
    .isVisible();

  const isDiv = await page
    .locator(elementIdentifier)
    .locator("div")
    .first()
    .isVisible();

  let locators;
  if (isLi) {
    locators = page.locator(elementIdentifier).locator("li").all();
  } else if (isA) {
    locators = page.locator(elementIdentifier).locator("a").all();
  } else if (isDiv) {
    locators = page.locator(elementIdentifier).locator("div").all();
  }

  // Deselect any selected items first
  for (const optionElement of await locators) {
    const text = await optionElement.textContent();
    if (text) {
      await deselectOption(page, optionElement, text);
    }
  }

  // Now select the desired items
  for (const optionElement of await locators) {
    const text = await optionElement.textContent();
    if (text) {
      const hasSelectedClass = await optionElement.getAttribute("class");

      const trimmedText = text.trim().replace(/\n/g, " ").replace(/\s/g, "");

      if (
        values.includes(trimmedText) &&
        hasSelectedClass !== null &&
        !hasSelectedClass.includes("selected")
      ) {
        console.log(`selecting ${text}...`);
        await optionElement.click(); // Select the item
        await page.waitForTimeout(500);
        if (values.length === 1) {
          break;
        }
      }
    }
  }

  if (button) {
    // click to close
    await page.locator(elementIdentifier).locator("button").click();
  }
};

async function deselectOption(page: Page, optionElement: any, text: any) {
  let hasSelectedClass = await optionElement.getAttribute("class");

  while (hasSelectedClass !== null && hasSelectedClass.includes("selected")) {
    await page.waitForTimeout(500);
    console.log(`Unselecting ${text}...`);

    await optionElement.hover();
    await optionElement.highlight(); // Deselect the item
    await optionElement.click(); // Deselect the item

    await page.waitForTimeout(500);

    // Update the value of hasSelectedClass for the next iteration
    hasSelectedClass = await optionElement.getAttribute("class");
  }
}

export const checkTextOnList = async (
  page: Page,
  elementIdentifier: string,
  specificText: string
): Promise<boolean> => {
  // check for button
  const button = await page
    .locator(elementIdentifier)
    .locator("button")
    .isVisible();

  if (button) {
    // click to open
    await page.locator(elementIdentifier).locator("button").click();
  }

  const isLi = await page
    .locator(elementIdentifier)
    .locator("li")
    .first()
    .isVisible();
  const isA = await page
    .locator(elementIdentifier)
    .locator("a")
    .first()
    .isVisible();

  let locators;
  if (isLi) {
    locators = page.locator(elementIdentifier).locator("li").all();
  } else if (isA) {
    locators = page.locator(elementIdentifier).locator("a").all();
  }

  // Search for the specific text within the element
  let isTextPresent = false;
  for (const optionElement of await locators) {
    const text = await optionElement.textContent();
    if (text) {
      const trimmedText = text.trim().replace(/\n/g, " ").replace(/\s/g, "");
      specificText = specificText.trim().replace(/\n/g, " ").replace(/\s/g, "");

      if (trimmedText === specificText) {
        isTextPresent = true;
        break;
      }
    }
  }

  if (button) {
    // click to close
    await page.locator(elementIdentifier).locator("button").click();
  }

  return isTextPresent;
};

export const unMultiSelectTextFromList = async (
  page: Page,
  elementIdentifier: string
): Promise<void> => {
  // check for button
  const button = await page
    .locator(elementIdentifier)
    .locator("button")
    .isVisible();

  if (button) {
    // click to open
    await page.locator(elementIdentifier).locator("button").click();
  }
  const isLi = await page
    .locator(elementIdentifier)
    .locator("li")
    .first()
    .isVisible();

  const isA = await page
    .locator(elementIdentifier)
    .locator("a")
    .first()
    .isVisible();

  let locators;
  if (isLi) {
    locators = page.locator(elementIdentifier).locator("li").all();
  } else if (isA) {
    locators = page.locator(elementIdentifier).locator("a").all();
  }

  // Deselect any selected items first
  for (const optionElement of await locators) {
    const text = await optionElement.textContent();
    if (text) {
      // Check if the 'li' element has the "selected" class
      const hasSelectedClass = await optionElement.getAttribute("class");

      if (hasSelectedClass !== null && hasSelectedClass.includes("selected")) {
        await optionElement.hover();
        await optionElement.highlight(); // Deselect the item
        await optionElement.click(); // Deselect the item
        await page.waitForTimeout(500);
      }
    }
  }

  if (button) {
    // click to close
    await page.locator(elementIdentifier).locator("button").click();
  }
};

export const clickArrowKeyDownEnter = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<void> => {
  await page.locator(elementIdentifier).click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
};

export const selectOptionByText = async (
  page: Page,
  elementIdentifier: ElementLocator,
  value: string
): Promise<void> => {
  console.log(
    await page.locator(`${elementIdentifier}`).selectOption(value.trim())
  );
  await page.locator(`${elementIdentifier}`).selectOption(value.trim());
};

export const verifySelectOptionByText = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const selectedOption = await page.$(
    "select" + elementIdentifier + "option:checked"
  );
  if (selectedOption) {
    const selectedText = await selectedOption.textContent();
    return selectedText;
  }

  return null;
};

export const toggleMultipleCheckBoxes = async (
  page: Page,
  elementIdentifier: ElementLocator,
  options: string
): Promise<void> => {
  var derivedLocator = page.locator("" + elementIdentifier + "");
  var toggleCount = derivedLocator.count();

  for (let x = 0; x < (await toggleCount); x++) {
    await derivedLocator.uncheck(); // uncheck all
  }

  for (let i = 0; i < (await toggleCount); i++) {
    var classAttribute = derivedLocator.nth(i).getAttribute("class");
    var checkLabel = derivedLocator.nth(i).innerText();

    var values = options.split("#");
    for (let j = 0; j < values.length; j++) {
      values[j] = values[j].trim(); // work on
      if (
        values[j].toLowerCase().trim() ==
          (await checkLabel).toLowerCase().trim() &&
        (await classAttribute) != "active"
      )
        await derivedLocator.nth(i).click();
    }
  }
};

export const zoomInMap = async (page: Page): Promise<void> => {
  await page.locator('[aria-label="Zoom in"]').click();
};

export const zoomOutMap = async (page: Page): Promise<void> => {
  await page.locator('[aria-label="Zoom out"]').click();
};

export const clickInMap = async (page: Page, label: string): Promise<void> => {
  await page.locator(`'[aria-label="${label}"]'`).click();
};

export const screenshots_not_equal = async (
  screenshot1: any,
  screenshot2: any
): Promise<any> => {
  expect(screenshot1).not.toEqual(screenshot2);
  console.log(
    `The images ${screenshot1} and ${screenshot2} are different as expected`
  );
};

export const screenshots_equal = async (
  screenshot1: any,
  screenshot2: any
): Promise<any> => {
  expect(screenshot1).toEqual(screenshot2);
  console.log(
    `The images ${screenshot1} and ${screenshot2} are not different as expected`
  );
};

//!#region - TABLE HANDLE

export const clickButtonOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  elementType: string,
  value: string
): Promise<any> => {
  await page.waitForLoadState("networkidle", {
    timeout: envNumber("PROCESS_TIMEOUT"),
  }); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the link in the cell
  let element: Locator | null = null; // Initialize 'element' with a default value

  let checkLinks = await tDataCol
    .locator(`:scope >> * >> ${elementType}:has-text("${value}")`)
    .isVisible();

  if (checkLinks) {
    element = tDataCol.locator(
      `:scope >> * >> ${elementType}:has-text("${value}")`
    );
  }

  if (element) {
    return element;
  }
};

export const clickOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  expectedHeader: string,
  linkText: string
): Promise<any> => {
  await page.waitForLoadState("networkidle", {
    timeout: envNumber("PROCESS_TIMEOUT"),
  }); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the link in the cell
  let element: Locator | null = null; // Initialize 'element' with a default value

  let checkLinks = await tDataCol
    .locator(`:scope >> * >> a:has-text("${linkText}")`)
    .isVisible();
  let checkLink = await tDataCol
    .locator(`a:has-text("${linkText}")`)
    .isVisible();

  let checkLabels = await tDataCol
    .locator(`:scope >> * >> label:has-text("${linkText}")`)
    .isVisible();
  let checkLabel = await tDataCol
    .locator(`label:has-text("${linkText}")`)
    .isVisible();

  let checkButtons = await tDataCol
    .locator(`:scope >> * >> button:has-text("${linkText}")`)
    .isVisible();
  let checkButton = await tDataCol
    .locator(`button:has-text("${linkText}")`)
    .isVisible();

  if (checkLinks) {
    element = tDataCol.locator(`:scope >> * >> a:has-text("${linkText}")`);
  } else if (checkLink) {
    element = tDataCol.locator(`a:has-text("${linkText}")`);
  } else if (checkLabels) {
    element = tDataCol.locator(`:scope >> * >> label:has-text("${linkText}")`);
  } else if (checkLabel) {
    element = tDataCol.locator(`label:has-text("${linkText}")`);
  } else if (checkButtons) {
    element = tDataCol.locator(`:scope >> * >> button:has-text("${linkText}")`);
  } else if (checkButton) {
    element = tDataCol.locator(`button:has-text("${linkText}")`);
  }

  if (element) {
    console.log(`Selected ${await element.innerText()}`);

    // get table header
    let tableHead = page.locator(elementIdentifier).locator("thead");

    // get table header row
    let tHeadRow = tableHead.locator("tr");

    let start = -1;
    // get table header row data
    if (await tHeadRow.locator("th").first().isVisible()) {
      start = 0;
    }

    for (
      let index = start;
      index < (await tHeadRow.locator("th,td").count());
      index++
    ) {
      // loop through table header collection

      var actualHeader = await tHeadRow.locator("th,td").nth(index).innerText();
      const actualHeader_reg = actualHeader
        .replace(/[\n\s]+/g, "")
        .toLowerCase();
      const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
      console.log(
        "actual header " +
          actualHeader_reg +
          " =  expected header " +
          eHeader_reg +
          " with index of " +
          index
      );
      if (actualHeader_reg === eHeader_reg) {
        await element.hover();
        await element.click();
        break;
      }
    }
  }
};

/**
 * @constructor clickInputOnTable
 * @param page
 * @param elementIdentifier
 * @param referenceText
 * @param expectedHeader
 */
export const checkBoxOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  expectedHeader: string
): Promise<any> => {
  await page.waitForLoadState("networkidle", {
    timeout: envNumber("PROCESS_TIMEOUT"),
  }); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the input in cell
  let input = tDataCol.locator("input");

  // get table header
  let tableHead = page.locator(elementIdentifier).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();

    if (actualHeader_reg === eHeader_reg) {
      var checkBox = input.nth(index);
      console.log(
        `click link - ${referenceText}
            for ${await checkBox.innerText()}`
      );

      await checkBox.hover();
      await checkBox.click();
      break;
    }
  }
};

export const rowCountOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator
): Promise<number> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  return await bodyRows.count();
};

export const clickLabelOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  expectedHeader: string,
  text: string
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the table data in a row
  let label = tDataCol.locator("label");

  // get table header
  let tableHead = page.locator(elementIdentifier).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    var isTrue = false;

    var labelText = label;
    for (let ei = 0; ei < (await label.count()); ei++) {
      var aLabel = (await labelText.nth(ei).innerText()).trim().toLowerCase();
      var isLabelVisible = await labelText.nth(ei).isVisible();

      if (isLabelVisible && aLabel === text.trim().toLowerCase()) {
        if (actualHeader_reg === eHeader_reg) {
          await labelText.nth(ei).hover();
          await labelText.nth(ei).click({ force: true });
          isTrue = true;
          break;
        }
      } else {
        console.log(`click link - not visible`);
      }
    }
    if (isTrue) {
      break;
    }
  }
};

/**
 *
 * @param page
 * @param elementIdentifier1
 * @param elementIdentifier2
 * @param value
 * @param referenceText
 * @param expectedHeader
 * @constructor fillTextfieldOnTable
 */
export const fillTextfieldOnTable = async (
  page: Page,
  elementIdentifier1: ElementLocator,
  elementIdentifier2: ElementLocator,
  value: string,
  referenceText: string,
  expectedHeader: string
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier1).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the table data in a row
  let input = tDataCol.locator(elementIdentifier2);

  // get table header
  let tableHead = page.locator(elementIdentifier1).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);
    if (eHeader_reg === actualHeader_reg) {
      var textfield = input.nth(index - 1);
      if (await textfield.isEditable()) {
        await textfield.fill("");
        await textfield.type(value);
        break;
      } else {
        console.log("text field is not editable.");
      }
    }
  }
};

/**
 *
 * @param page
 * @param elementIdentifier1
 * @param elementIdentifier2
 * @param referenceText
 * @param expectedHeader
 * @returns getTextFromInputOnTable
 */
export const getTextFromInputOnTable = async (
  page: Page,
  elementIdentifier1: ElementLocator,
  elementIdentifier2: ElementLocator,
  referenceText: string,
  expectedHeader: string
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier1).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the table data in a row
  let input = tDataCol.locator(elementIdentifier2);

  // get table header
  let tableHead = page.locator(elementIdentifier1).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  var text = "";
  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);
    if (eHeader_reg === actualHeader_reg) {
      var textfield = input.nth(index - 1);
      logger.log("textfield is  : " + textfield);
      if (await textfield.isEditable()) {
        logger.log("textfield is Editable  : " + textfield);
        text = await textfield.inputValue();
      } else {
        logger.log("textfield is not Editable  : " + textfield);
        text = await textfield.inputValue();
      }
      logger.log("text is  : " + text);
      break;
    }
  }
  return text;
};

/**
 *
 * @param page
 * @param elementIdentifier1
 * @param elementIdentifier2
 * @param referenceText
 * @param expectedHeader
 * @returns getHoverTextFromInputOnTable
 */
export const getHoverTextFromInputOnTable = async (
  page: Page,
  elementIdentifier1: ElementLocator,
  elementIdentifier2: ElementLocator,
  referenceText: string,
  expectedHeader: string
): Promise<string> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier1).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the table data in a row
  let input = tDataCol.locator(elementIdentifier2);

  // get table header
  let tableHead = page.locator(elementIdentifier1).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  var result = "";
  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);
    let parentLocator;
    if (eHeader_reg === actualHeader_reg) {
      var childLocator = input.nth(index - 1);
      if (childLocator) {
        // The evaluateHandle() method is called on that object with a function that retrieves the parent element using the parentElement property.
        // The result is another ElementHandle object representing the parent element, which you can use to perform further actions on the parent element.
        parentLocator = await childLocator.evaluateHandle(
          (element) => element.parentElement
        );
      } else {
        logger.log("element is  : " + null);
      }

      result = parentLocator.getAttribute("title");

      logger.log("hover text is  : " + result);
      logger.log("textfield is  : " + childLocator);
      logger.log("textfield is  : " + parentLocator);

      break;
    }
  }
  return result;
};

/**
 *
 * @param page
 * @param elementIdentifier1
 * @param elementIdentifier2
 * @param referenceText
 * @param expectedHeader
 * @returns getHoverTextFromTableHeader
 */
export const getHoverTextFromTableHeader = async (
  page: Page,
  elementIdentifier: ElementLocator,
  expectedHeader: string
): Promise<string> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // get table header
  let tableHead = page.locator(elementIdentifier).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  var result = "";
  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);

    if (eHeader_reg === actualHeader_reg) {
      let headerLocator = tHeadRowDataCol.nth(index);

      result = await headerLocator.getAttribute("title");

      logger.log("hover text is  : " + result);

      break;
    }
  }
  return result;
};

/**
 *
 * @param page
 * @param elementIdentifier
 * @param referenceText
 * @param expectedHeader
 * @returns getTextFromFooterOnTable
 */
export const getTextFromFooterOnTable = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  expectedHeader: string
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier).locator("tfoot");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get table header
  let tableHead = page.locator(elementIdentifier).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  var text = "";
  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);
    if (eHeader_reg === actualHeader_reg) {
      var textfield = tDataCol.nth(index - 1);
      logger.log("textfield is  : " + textfield);
      if (await textfield.isVisible()) {
        logger.log("textfield is Visible  : " + textfield);
        text = await textfield.innerText();
      } else {
        logger.log("textfield is not Visible  : " + textfield);
      }
      logger.log("text is  : " + text);
      break;
    }
  }
  return text;
};

/**
 *
 * @param page
 * @param elementIdentifier
 * @param referenceText
 * @param expectedHeader
 * @returns getTextOnTableBody
 */
export const getTextOnTableBody = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  expectedHeader: string
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // Locate the table
  let table = page.locator(elementIdentifier);

  // Locate the table body rows
  let bodyRows = table.locator("tbody tr");

  // Find the index of the expected header
  let headerIndex = -1;
  let tableHeaders = table.locator("thead th, thead td");
  for (let index = 0; index < (await tableHeaders.count()); index++) {
    const headerText = (await tableHeaders.nth(index).innerText())
      .replace(/[\n\s]+/g, "")
      .toLowerCase();
    const expectedHeaderText = expectedHeader
      .replace(/[\n\s]+/g, "")
      .toLowerCase();

    if (headerText === expectedHeaderText) {
      headerIndex = index;
      break;
    }
  }

  if (headerIndex === -1) {
    console.log(`Header "${expectedHeader}" not found in the table.`);
    return "";
  }

  // Find the row with the reference text
  let refRow;
  for (let index = 0; index < (await bodyRows.count()); index++) {
    const row = bodyRows.nth(index);
    const rowText = await row.innerText();

    if (rowText.includes(referenceText)) {
      // Locate the text field in the reference row
      let textField = row.locator(`td:nth-child(${headerIndex + 1})`);

      if (!(await textField.isVisible())) {
        console.log("Text field is not visible.");
        return "";
      }

      const text = await textField.innerText();
      return text;
    }
  }

  console.log(
    `Row with reference text "${referenceText}" not found in the table.`
  );
  return "";
};

/**
 *
 * @param page
 * @param elementIdentifier1
 * @param elementIdentifier2
 * @param referenceText
 * @param expectedHeader
 * @param value
 * @returns multiSelectOnTable
 */
export const multiSelectOnTable = async (
  page: Page,
  elementIdentifier1: ElementLocator,
  elementIdentifier2: ElementLocator,
  referenceText: string,
  expectedHeader: string,
  value?: any
): Promise<any> => {
  await page.waitForLoadState("networkidle"); // The promise resolves after 'load' event.

  // return the entire table body
  let table = page.locator(elementIdentifier1).locator("tbody");

  // get all the table body rows
  let bodyRows = table.locator("tr");

  // get the table data in a row
  let refRow = bodyRows.locator(":scope", { hasText: referenceText });

  // get the table data in a row
  let tDataCol = refRow.locator("td");

  // get the table data in a row
  let dropdown = tDataCol.locator(elementIdentifier2);

  // get table header
  let tableHead = page.locator(elementIdentifier1).locator("thead");

  // get table header row
  let tHeadRow = tableHead.locator("tr");

  let tHeadRowDataCol;
  let start = 0;
  // get table header row data
  if (await tHeadRow.locator("th").first().isVisible()) {
    tHeadRowDataCol = tHeadRow.locator("th");
  } else {
    tHeadRowDataCol = tHeadRow.locator("td");
    start = -1;
  }

  var text = "";
  for (let index = 0; index < (await tHeadRowDataCol.count()); index++) {
    // loop through table header collection

    var actualHeader = await tHeadRowDataCol.nth(index).innerText();
    const actualHeader_reg = actualHeader.replace(/[\n\s]+/g, "").toLowerCase();
    const eHeader_reg = expectedHeader.replace(/[\n\s]+/g, "").toLowerCase();
    console.log(`${eHeader_reg} === ${actualHeader_reg}`);
    if (eHeader_reg === actualHeader_reg) {
      if (await dropdown.isVisible()) {
        await dropdown.click();
        logger.log("dropDown is  : " + dropdown);
        var check1 = await dropdown
          .locator("ul")
          .locator("li")
          .first()
          .isVisible();

        logger.log("check1 is  : " + check1);

        if (check1) {
          var locator = dropdown.locator("div").locator("ul").locator("li");
          for (let i = 0; i < (await locator.count()); i++) {
            const attribute = await locator.nth(i).getAttribute("class");
            var actualText = await locator.nth(i).innerText();

            var values = value.split("#");
            for (let j = 0; j < values.length; j++) {
              values[j] = values[j].trim(); // work on
              if (
                values[j].toLowerCase().trim() ==
                actualText.toLowerCase().trim()
              ) {
                if (attribute == null) {
                  await locator.nth(i).click();
                  break;
                }
              }
            }
          }
          await dropdown.click(); // click to close
        }
      } else {
        logger.log("dropdown is not Editable  : " + dropdown);
        text = await dropdown.inputValue();
      }
      logger.log("text is  : " + text);
      break;
    }
  }
  return text;
};

//!#endregion - TABLE HANDLE

export const retryUntilVisible = async (
  page: Page,
  selector: string,
  maxRetries: number = 3,
  retryInterval: number = 1000
): Promise<void> => {
  let retries = 0;

  while (retries < maxRetries) {
    const element = page.locator(selector);
    page.waitForTimeout(parseInt("10", 10) * 1000);
    if (element) {
      const isVisible = await element.isVisible();

      if (isVisible) {
        return; // Element is visible, exit the function
      }
    }

    retries++;
    await page.waitForTimeout(retryInterval);
  }

  throw new Error(
    `Element '${selector}' was not visible after ${maxRetries} retries`
  );
};

// Define an export function to wait until an element is no longer visible
export async function waitForElementToDisappear(
  page: Page,
  selector: string,
  timeoutMs: number = 10000
) {
  try {
    // Wait for the element to be present
    await page.waitForSelector(selector, { timeout: timeoutMs });

    // Wait for the element to become invisible
    await page.waitForSelector(selector, {
      state: "hidden",
      timeout: timeoutMs,
    });
  } catch (error) {
    // Handle any errors, e.g., element not found or timeout
    console.error(
      `Element with selector '${selector}' did not disappear within ${timeoutMs}ms.`
    );
  }
  await page.waitForTimeout(parseInt("2", 10) * 1000);
}

export const groupedTextfield = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  inputText: string,
  elementIndex: number
): Promise<any> => {
  let locators = page.locator(elementIdentifier).all();

  for (let locator of await locators) {
    const label = await locator.innerText();
    const match = label.match(new RegExp(referenceText, "g"));
    console.log(`Found the element with text: "${match}"`);

    if (match) {
      let element = locator
        .locator(`div:nth-child(${elementIndex})`)
        .locator("div input");

      // Get the inner HTML of the element
      const elementHandle = element.first();
      const innerHTML = await elementHandle.inputValue();
      await elementHandle.highlight();
      await elementHandle.clear();
      await elementHandle.type(inputText);
      console.log(`Element html at row ${elementIndex} is: ${innerHTML}`);

      break;
    }
  }
};

export const getValueGroupedTextfield = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  elementIndex: number
): Promise<any> => {
  let locators = page.locator(elementIdentifier).all();

  for (let locator of await locators) {
    const label = await locator.innerText();
    const match = label.match(new RegExp(referenceText, "g"));
    console.log(`Found the element with text: "${match}"`);

    if (match) {
      let element = locator
        .locator(`div:nth-child(${elementIndex})`)
        .locator("div input");

      // Get the inner HTML of the element
      const elementHandle = element.first();
      const innerHTML = await elementHandle.inputValue();
      await elementHandle.highlight();
      console.log(`Element html at row ${elementIndex} is: ${innerHTML}`);
      return await elementHandle.inputValue();
    }
  }
};

export const getValueGroupedText = async (
  page: Page,
  elementIdentifier: ElementLocator,
  referenceText: string,
  elementIndex: number
): Promise<any> => {
  let locators = page.locator(elementIdentifier).all();

  for (let locator of await locators) {
    const label = await locator.innerText();
    const match = label.match(new RegExp(referenceText, "g"));
    console.log(`Found the element with text: "${match}"`);

    if (match) {
      let element = locator.locator(`div:nth-child(${elementIndex})`);

      // Get the inner HTML of the element
      const elementHandle = element.first();
      const innerHTML = await elementHandle.textContent();
      await elementHandle.highlight();
      console.log(
        `Element html at row ${elementIndex} is: ${innerHTML?.trim()}`
      );
      return innerHTML?.trim();
    }
  }
};

export function removeExternalQuotes(arr: string[]): string[] {
  return arr.map((item) => item.replace(/^'(.*)'$/, "$1"));
}

export function convertStringToArray(str: string): string[] {
  // Replace double single quotes with an opening and closing square bracket
  const jsonString =
    str.replace(/^''|''$/g, '["').replace(/','/g, '","') + '"]';

  try {
    // Parse the JSON string into an array
    const array = JSON.parse(jsonString);

    if (Array.isArray(array)) {
      return array;
    } else {
      throw new Error("Not a valid array");
    }
  } catch (error) {
    console.error("Error parsing string to array:", error);
    return [];
  }
}

export function checkForKeywords(input: string, keywords: string[]): boolean {
  return keywords.every((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(input)
  );
}

export function failedKeywords(
  input: string,
  keywords: string[]
): string[] | null {
  const failedKeywords: string[] = keywords.filter(
    (keyword) => !new RegExp(`\\b${keyword}\\b`, "i").test(input)
  );

  return failedKeywords.length > 0 ? failedKeywords : null;
}

// const keywordsToCheck = ['Location name', 'Town', 'Purpose Built', 'Total beds', 'CQC rating'];

// const result = checkForKeywords(inputString, keywordsToCheck);
