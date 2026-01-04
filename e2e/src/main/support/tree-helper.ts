import { Page } from "playwright";
import { ElementLocator } from "../env/global";

// Function to click on a specific text within a tree node
export const clickTextOnTreeNode = async (
  page: Page,
  elementIdentifier: ElementLocator,
  textToCompare: string
): Promise<void> => {
  // Initialize a flag to track if the text was found
  let isTextFound = false;

  // Locate the root node of the tree
  const rootNode = page.locator(elementIdentifier).locator("ul").locator("li");

  // Convert the expected text to lowercase and trim any whitespace
  const expectedText = textToCompare.trim().toLowerCase();

  // Iterate through the root node's children
  for (let i = 0; i < (await rootNode.count()); i++) {
    // Locate the link element within the current child node
    const linkElement = rootNode.nth(i).locator("a").first();

    // Get the text of the link element, convert to lowercase, and trim
    const linkText = (await linkElement.innerText()).trim().toLowerCase();

    // Check if the link text matches the expected text
    if (linkText === expectedText) {
      // Click on the link element if a match is found
      await linkElement.click();
      isTextFound = true;
      break; // Exit the loop if the text is found
    }

    // If the text was not found in the current node, explore its sub-nodes
    const subNodes = rootNode.nth(i).locator("ul").locator("li");

    // Iterate through the sub-nodes
    for (let j = 0; j < (await subNodes.count()); j++) {
      // Click on the expand/collapse icon of the sub-node
      await subNodes.nth(j).locator("i").first().click();

      // Locate the link element within the sub-node
      const subLinkElement = subNodes.nth(j).locator("a").first();

      // Get the text of the link element, convert to lowercase, and trim
      const subLinkText = (await subLinkElement.innerText())
        .trim()
        .toLowerCase();

      console.log(
        `Node Two is: ${subLinkText} at ${j + 1} of ${await subNodes.count()}`
      );

      // Check if the sub-node's link text matches the expected text
      if (subLinkText === expectedText) {
        // Click on the sub-node's link element if a match is found
        await subLinkElement.click();
        isTextFound = true;
        break; // Exit the loop if the text is found
      }
    }

    // Exit the loop if the text is found
    if (isTextFound) {
      break;
    }
  }
};
