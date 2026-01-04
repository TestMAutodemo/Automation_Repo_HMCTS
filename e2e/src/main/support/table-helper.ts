import { Page, Locator } from "playwright";
import { envNumber } from "../env/parseEnv";

export const clickCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string,
  text: string
): Promise<void> => {
  try {
    const cell = await getBodyCell(
      page,
      elementIdentifier,
      columnHeader,
      referenceRowText
    );

    console.log(`The cell is ${await cell?.isVisible()}`);
    console.log(`The cell is ${await cell?.innerHTML()}`);

    let aCount = await cell?.locator("a").count();
    let buttonCount = await cell?.locator("button").count();
    let labelCount = await cell?.locator("label").count();

    console.log(`'a' count is: ${aCount}`);
    console.log(`'button' count is: ${buttonCount}`);
    if (aCount)
      if (aCount > 0) {
        for (const element of (await cell?.locator("a").all()) ?? []) {
          // Properly await element.textContent()
          const elementText = await element.textContent();
          if (elementText && elementText.trim().includes(text.trim())) {
            page.once("dialog", (dialog) => {
              console.log(`Dialog message: ${dialog.message()}`);
              dialog.accept().catch(() => {});
            });

            await element.highlight();
            await element.click();
            await page.waitForLoadState("networkidle", {
              timeout: envNumber("PROCESS_TIMEOUT"),
            });
            break;
          }
        }
      }
    if (buttonCount)
      if (buttonCount > 0) {
        for (const element of (await cell?.locator("button").all()) ?? []) {
          if ((await element.isVisible()) && (await element.isEnabled())) {
            const buttonText = await element.textContent();
            console.log(`Text content of button:`, buttonText);

            if (buttonText && buttonText.trim() === text.trim()) {
              page.once("dialog", (dialog) => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.accept().catch(() => {});
              });
              await element.highlight();
              // Use "force: true" option only if necessary
              await element.click();
              // Wait for the page to load (if necessary)
              await page.waitForLoadState("load");
              break;
            }
          }
        }
      }

    if (labelCount)
      if (labelCount > 0) {
        for (const element of (await cell?.locator("label").all()) ?? []) {
          if ((await element.isVisible()) && (await element.isEnabled())) {
            const labelText = await element.textContent();
            console.log(`Text content of label:`, labelText);

            if (labelText && labelText.trim() === text.trim()) {
              page.once("dialog", (dialog) => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.accept().catch(() => {});
              });
              await element.highlight();
              // Use "force: true" option only if necessary
              await element.click();
              // Wait for the page to load (if necessary)
              await page.waitForLoadState("load");
              break;
            }
          }
        }
      }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const clickClassCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string,
  text: string
): Promise<void> => {
  try {
    const cell = await getBodyCell(
      page,
      elementIdentifier,
      columnHeader,
      referenceRowText
    );

    let spanCount = await cell?.locator("span").count();

    console.log(`'span' count is: ${spanCount}`);

    if (spanCount)
      if (spanCount > 0) {
        console.log(`inside span tag`);
        for (const element of (await cell?.locator("span").all()) ?? []) {
          let classAttr = await element.getAttribute("class");
          if (classAttr?.includes(text)) {
            const spanText = await element.textContent();
            console.log(`Text content of span:`, spanText);
            page.once("dialog", (dialog) => {
              console.log(`Dialog message: ${dialog.message()}`);
              dialog.accept().catch(() => {});
            });
            await element.last().highlight();

            await element.last().click({ force: true });

            // Wait for the page to load (if necessary)
            await page.waitForLoadState("load");
            break;
          }
        }
      }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const fillCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string,
  text: string
): Promise<void> => {
  const cell = await getBodyCell(
    page,
    elementIdentifier,
    columnHeader,
    referenceRowText
  );

  let inputCount = await cell?.locator("input").count();
  console.log(`'input' count is: ${inputCount}`);

  if (inputCount)
    if (inputCount > 0) {
      const inputElements = await cell?.locator("input").all();
      for (const element of inputElements ?? []) {
        if ((await element.isVisible()) && (await element.isEnabled())) {
          const inputText = await element.textContent();
          console.log(`Text content of input:`, inputText);

          await element.highlight();
          await element.clear();
          await element.type(text);

          break;
        }
      }
    }
};

export const getFooterTextCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string
): Promise<string> => {
  const cell = await getFooterCell(
    page,
    elementIdentifier,
    columnHeader,
    referenceRowText
  );

  let inputCount = await cell?.locator("input").count();
  console.log(`'input' count is: ${inputCount}`);

  let text: string = "";

  if (inputCount)
    if (inputCount > 0) {
      const inputElements = await cell?.locator("input").all();
      for (const element of inputElements ?? []) {
        if (await element.isVisible()) {
          const inputText = await element.textContent();
          console.log(`Text content of input:`, inputText);

          await element.highlight();
          text = await element.inputValue();

          break;
        }
      }
    }

  return text;
};

export const getBodyTextCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string
): Promise<string | null> => {
  const cell = await getBodyCell(
    page,
    elementIdentifier,
    columnHeader,
    referenceRowText
  );

  let spanCount = await cell?.locator("span").count();
  console.log(`'span' count is: ${spanCount}`);

  let strongCount = await cell?.locator("strong").count();
  console.log(`'strong' count is: ${strongCount}`);

  let text: string | null = "";

  if (spanCount)
    if (spanCount > 0) {
      const spanElements = await cell?.locator("span").all();
      for (const element of spanElements ?? []) {
        if (await element.isVisible()) {
          const spanText = await element.textContent();
          console.log(`Text content of span:`, spanText);

          await element.highlight();
          text = await element.textContent();

          break;
        }
      }
    }

  if (strongCount)
    if (strongCount > 0) {
      const strongElements = await cell?.locator("strong").all();
      for (const element of strongElements ?? []) {
        if (await element.isVisible()) {
          const strongText = await element.textContent();
          console.log(`Text content of strong:`, strongText);

          await element.highlight();
          text = await element.textContent();

          break;
        }
      }
    }

  if (spanCount == 0 && strongCount == 0) {
    await cell?.highlight();
    const cellText = await cell?.textContent();
    console.log(`Text content of strong:`, cellText);
  }

  return text;
};

export const selectCellOperation = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string,
  options: string
): Promise<void> => {
  try {
    const cell = await getBodyCell(
      page,
      elementIdentifier,
      columnHeader,
      referenceRowText
    );

    console.log(`The cell is ${await cell?.isVisible()}`);
    console.log(`The cell is ${await cell?.innerHTML()}`);

    let button = await cell?.locator("button").isVisible(); // check for button
    if (button) {
      await cell?.locator("button").click(); // click to open
    }

    const values = options
      .split(",")
      .map((value) => value.trim().replace(/\s/g, ""));

    const isLi = await cell?.locator("li").first().isVisible();

    const isA = await cell?.locator("a").first().isVisible();

    let locators: Locator[] = [];

    if (isLi) {
      const liLocators = await cell?.locator("li").all();
      if (liLocators) {
        locators = liLocators;
      }
    } else if (isA) {
      const aLocators = await cell?.locator("a").all();
      if (aLocators) {
        locators = aLocators;
      }
    }

    if (isA || isLi)
      // Deselect any selected items first
      for (const optionElement of await locators) {
        const text = await optionElement.textContent();
        if (text) {
          // Check if the 'li' element has the "selected" class
          const hasSelectedClass = await optionElement.getAttribute("class");

          if (
            hasSelectedClass !== null &&
            hasSelectedClass.includes("selected")
          ) {
            await optionElement.hover();
            await optionElement.highlight(); // Deselect the item
            await optionElement.click(); // Deselect the item
            await page.waitForTimeout(500);
          }
        }
      }

    if (isA || isLi)
      for (const optionElement of await locators) {
        const text = await optionElement.textContent();

        if (text) {
          const trimmedText = text
            .trim()
            .replace(/\n/g, " ")
            .replace(/\s/g, "");

          if (values.includes(trimmedText)) {
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
      await cell?.locator("button").click(); // click to close
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

//! Body
const getBodyCell = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string
): Promise<Locator | null> => {
  try {
    // Find the column index based on the column header text
    let columnIndex = await findColumnIndexWithHeaderText(
      page,
      elementIdentifier,
      columnHeader
    );

    console.log(`On getBodyCell function: column index is ${columnIndex}`);
    await page.waitForTimeout(parseInt("1", 10) * 1000);

    let rowIndex: number | null = -1;

    try {
      rowIndex = await findRowIndexWithReferenceText(
        page,
        elementIdentifier,
        referenceRowText
      );
      console.log("Reference row index:", rowIndex);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(`On getBodyCell function: row index is ${rowIndex}`);

    let cellPath;
    if (elementIdentifier.includes("#"))
      cellPath = `//table[@id='${elementIdentifier.replace(
        "#",
        ""
      )}']/tbody/tr[${rowIndex}]/td[${columnIndex}]`;
    else
      cellPath = `${elementIdentifier}>tbody>tr:nth-child(${rowIndex})>td:nth-child(${columnIndex})`;

    page.locator(cellPath).waitFor();
    console.log(cellPath);
    const element = page.locator(cellPath);
    await element.scrollIntoViewIfNeeded();
    console.log(`the cell element is ${await element.isVisible()}`);

    return element;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

//! Footer
const getFooterCell = async (
  page: Page,
  elementIdentifier: string,
  columnHeader: string,
  referenceRowText: string
): Promise<Locator | null> => {
  try {
    // Find the column index based on the column header text
    let columnIndex = await findColumnIndexWithHeaderText(
      page,
      elementIdentifier,
      columnHeader
    );

    console.log(`On getFooterCell function: column index is ${columnIndex}`);

    let rowIndex: number | null = -1;

    try {
      rowIndex = await findRowIndexWithReferenceTextFooter(
        page,
        elementIdentifier,
        referenceRowText
      );
      console.log("Reference row index:", rowIndex);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(`On getFooterCell function: row index is ${rowIndex}`);

    const cellXPath = `//table[@id='${elementIdentifier.replace(
      "#",
      ""
    )}']/tfoot/tr[${rowIndex}]/td[${columnIndex}]`;

    page.locator(cellXPath).waitFor();

    const element = page.locator(cellXPath);
    console.log(`the cell element is ${await element.isVisible()}`);

    return element;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

//! Body - Row index
async function findRowIndexWithReferenceText(
  page: Page,
  elementIdentifier: string,
  referenceRowText: string
): Promise<number | null> {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForSelector(`${elementIdentifier} > tbody > tr`);

    const rows = await page.locator(`${elementIdentifier} > tbody > tr`).all();

    for (const [index, row] of rows.entries()) {
      const rowText = (await row.textContent())?.replace(/\s+/g, " ").trim();
      // console.log(`Row ${index + 1} text:`, rowText?.trim());

      if (rowText?.includes(referenceRowText)) {
        const rowIndex = index + 1;
        console.log("Reference row index is " + rowIndex);
        return rowIndex;
      }
    }

    console.log("Reference row not found");
    return null;
  } catch (error) {
    console.error("Error finding reference row:", error);
    throw error;
  }
}

//! Footer Row Index
async function findRowIndexWithReferenceTextFooter(
  page: Page,
  elementIdentifier: string,
  referenceRowText: string
): Promise<number | null> {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForSelector(`${elementIdentifier} > tfoot > tr`);

    const rows = await page.locator(`${elementIdentifier} > tfoot > tr`).all();

    for (const [index, row] of rows.entries()) {
      const rowText = (await row.textContent())?.replace(/\s+/g, " ").trim();
      // console.log(`Row ${index + 1} text:`, rowText?.trim());

      if (rowText?.includes(referenceRowText)) {
        const rowIndex = index + 1;
        console.log("Reference row index is " + rowIndex);
        return rowIndex;
      }
    }

    console.log("Reference row not found");
    return null;
  } catch (error) {
    console.error("Error finding reference row:", error);
    throw error;
  }
}

//! consolidated
async function findColumnIndexWithHeaderText(
  page: Page,
  elementIdentifier: string,
  columnHeader: string
): Promise<number> {
  await page.waitForLoadState("domcontentloaded");

  const headerRows = await page
    .locator(`${elementIdentifier} > thead > tr`)
    .all();

  let columnIndex = -1;
  let isFlag = false;

  if (headerRows.length === 1) {
    const headerCells = await headerRows[0].locator("th").all();
    for (let [index, headerCell] of headerCells.entries()) {
      const headerText = (await headerCell.textContent())?.trim();
      if (headerText === columnHeader.trim()) {
        columnIndex = index + 1;
        isFlag = true;
        break;
      }
    }
  } else if (headerRows.length === 2) {
    let trueCount = 1; // Initialize true count
    let falseCount = 1; // Initialize false count
    for (let i = 0; i < headerRows.length - 1; i++) {
      const headerCells = await headerRows[i].locator("th").all();
      const nextHeaderCells = await headerRows[i + 1].locator("th").all();

      for (let [index, headerCell] of headerCells.entries()) {
        const headerText = (await headerCell.textContent())?.trim();

        for (
          let nextIndex = 0;
          nextIndex < nextHeaderCells.length - 1;
          nextIndex++
        ) {
          const nextHeaderCell = nextHeaderCells[nextIndex];
          const nextHeaderText = (await nextHeaderCell.textContent())?.trim();

          if (headerText && nextHeaderText) {
            const combinedHeaderText = `${headerText}-${nextHeaderText}`
              .replace(/\s/g, "")
              .trim();
            const desired = columnHeader.replace(/\s/g, "").trim();
            console.log(
              `Expected "${combinedHeaderText}" Actual: ${desired}, ${
                combinedHeaderText === desired
              }`
            );
            if (combinedHeaderText === desired) {
              columnIndex = falseCount + trueCount;
              console.log(
                `false: ${falseCount} true: "${trueCount}" td[${
                  falseCount + trueCount
                }]`
              );
              isFlag = true;
              break;
            } else {
              falseCount++; // Increment false count
            }
          }
        }
        if (isFlag) {
          break;
        }
      }
      if (isFlag) {
        break;
      }
    }
  } else if (headerRows.length === 3) {
    for (let i = 0; i < headerRows.length - 2; i++) {
      const firstHeaderCells = await headerRows[i].locator("th").all();
      const secondHeaderCells = await headerRows[i + 1].locator("th").all();
      const thirdHeaderCells = await headerRows[i + 2].locator("th").all();
      console.log(`Count of firstHeaderCells = ${firstHeaderCells.length}`);
      console.log(`Count of secondHeaderCells = ${secondHeaderCells.length}`);
      console.log(`Count of thirdHeaderCells = ${thirdHeaderCells.length}`);
      for (
        let firstIndex = 0;
        firstIndex < firstHeaderCells.length;
        firstIndex++
      ) {
        const firstHeaderText = (
          await firstHeaderCells[firstIndex].textContent()
        )?.trim();
        if (firstHeaderText) {
          const desired = columnHeader.replace(/\s/g, "").trim();
          if (firstHeaderText === desired) {
            columnIndex = firstIndex + 1;
            isFlag = true;
            break;
          }
        }
        for (
          let secondIndex = 0;
          secondIndex < secondHeaderCells.length;
          secondIndex++
        ) {
          const secondHeaderText = (
            await secondHeaderCells[secondIndex].textContent()
          )?.trim();
          for (
            let thirdIndex = 0;
            thirdIndex < thirdHeaderCells.length;
            thirdIndex++
          ) {
            const thirdHeaderText = (
              await thirdHeaderCells[thirdIndex].textContent()
            )?.trim();
            if (firstHeaderText && secondHeaderText && thirdHeaderText) {
              const combinedHeaderText =
                `${firstHeaderText}-${secondHeaderText}-${thirdHeaderText}`
                  .replace(/\s/g, "")
                  .trim();
              const desired = columnHeader.replace(/\s/g, "").trim();
              console.log(
                `Is ${combinedHeaderText} = ${desired} result: ${
                  combinedHeaderText === desired
                } at ${thirdIndex} index`
              );
              if (combinedHeaderText === desired) {
                columnIndex = thirdIndex + 1;
                isFlag = true;
                break;
              }
            }
          }
          if (isFlag) {
            break;
          }
        }
        if (isFlag) {
          break;
        }
      }
      if (isFlag) {
        break;
      }
    }
  }

  return columnIndex; // Return the columnIndex after the loop.
}
