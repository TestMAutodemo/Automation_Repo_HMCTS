import { When } from "@cucumber/cucumber";
import { logger } from "../logger";
import { ScenarioWorld } from "./setup/world";
import { Page } from "playwright";
import path from "path";
import { env } from "../env/parseEnv";
import fs from "fs";

When(
  /^I scrape the web elements and save them to the "([^"]*)" page$/,
  async function (this: ScenarioWorld, fileName: string) {
    const {
      screen: { page },
    } = this;

    logger.log(
      `I scrape the web elements and save them to the ${fileName} page`
    );

    const currentUrl = page.url();
    console.log(`the current url is: ${currentUrl}`);

    await scrapeAndSave(page, fileName);
  }
);

interface ScrapeData {
  tag: string;
  id: string | null;
  name: string | null;
  for: string | null;
  href: string | null;
  classes: string;
  text: string;
  parentTag: string;
  smallText: string;
}

export async function scrapeAndSave(
  page: Page,
  jsonFileName: string
): Promise<void> {
  const parentFolder = path.join(
    __dirname,
    env("SCRAPPER_PAGE_ELEMENTS_FOLDER_PATH")
  );

  const inputElements = await page.$$("input[id],input[name],input[class]");
  const labelElements = await page.$$("label[for],label[id],label[name]");
  const buttonElements = await page.$$("button[id],button[name],button[class]");
  const anchorElements = await page.$$("a[id],a[name],a[href],a[class]");

  const elements = [
    ...inputElements,
    ...labelElements,
    ...buttonElements,
    ...anchorElements,
  ];

  const scrapedData: ScrapeData[] = await page.evaluate(
    (elements: Element[]) => {
      return elements.map((element) => {
        const tag = element.tagName.toLowerCase();
        const id = element.getAttribute("id");
        const name = element.getAttribute("name");
        const forAttr = element.getAttribute("for");
        const href = element.getAttribute("href");
        const classes = element.getAttribute("class") || "";
        const text =
          element.textContent?.trim().replace(/\n/g, "").replace(/\t/g, "") ||
          ""; // Trim, remove newline characters, and normalize whitespace
        let parentTag = "";

        if (tag === "input" && forAttr) {
          const labelElement = element.closest(`label[for="${forAttr}"]`);
          if (labelElement) {
            const labelText = labelElement.textContent?.trim() || "";
            return {
              tag,
              id,
              name,
              for: forAttr,
              href,
              classes,
              text: labelText,
              parentTag,
              smallText: "",
            };
          }
        } else if (tag === "button" || tag === "a") {
          return {
            tag,
            id,
            name,
            for: forAttr,
            href,
            classes,
            text,
            parentTag,
            smallText: "",
          };
        }

        let parentElement = element.parentElement;
        while (
          parentElement &&
          parentElement.tagName.toLowerCase() !== "body"
        ) {
          if (parentElement.tagName.toLowerCase() !== "label") {
            parentTag = parentElement.tagName.toLowerCase();
            break;
          }
          parentElement = parentElement.parentElement;
        }

        return {
          tag,
          id,
          name,
          for: forAttr,
          href,
          classes,
          text,
          parentTag,
          smallText: "",
        };
      });
    },
    elements
  );

  for (let i = 0; i < scrapedData.length; i++) {
    const { tag, id, name, for: forAttr, href } = scrapedData[i];
    const elementHandle = await page.$(
      `${tag}${id ? `[id="${id}"]` : ""}${name ? `[name="${name}"]` : ""}${
        forAttr ? `[for="${forAttr}"]` : ""
      }${href ? `[href="${href}"]` : ""}`
    );
    if (elementHandle) {
      const smallText = await page.evaluate((element) => {
        const smallElement = element.querySelector("small");
        return smallElement ? smallElement.textContent?.trim() || "" : "";
      }, elementHandle);
      scrapedData[i].smallText = smallText;
    }
  }

  console.log(scrapedData);
  const xpaths = convertToXPaths(scrapedData);
  const jsonData = JSON.stringify(xpaths, null, 2);

  const filePath = `${parentFolder}/${jsonFileName}.json`;

  try {
    // Check if the file path exists, if not, create the necessary directories
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, jsonData);
    console.log(
      `Web elements were scraped successfully and saved to: ${filePath}`
    );
  } catch (error) {
    console.error("An error occurred while saving web elements:", error);
  }
}

function convertToXPaths(data: ScrapeData[]): Record<string, string> {
  const xpaths: Record<string, string> = {};
  data.forEach((element) => {
    let xpath = "";
    if (element.tag === "button" || element.tag === "a") {
      xpath = `//${element.tag}`;
      if (element.id) {
        xpath += `[@id='${element.id}']`;
      } else if (element.name) {
        xpath += `[@name='${element.name}']`;
      } else if (element.for) {
        xpath += `[@for='${element.for}']`;
      } else if (element.href) {
        xpath += `[@href='${element.href}']`;
      } else {
        xpath += `[text()='${element.text}']`;
      }
    } else {
      xpath = `//${element.tag}`;
      if (element.id) {
        xpath += `[@id='${element.id}']`;
      }
      if (element.name) {
        xpath += `[@name='${element.name}']`;
      }
      if (element.for) {
        xpath += `[@for='${element.for}']`;
      }
      if (element.href) {
        xpath += `[@href='${element.href}']`;
      }
      if (element.smallText) {
        xpath += `[contains(small/text(), '${element.smallText}')]`;
      }
    }
    xpaths[element.text] = xpath;
  });
  return xpaths;
}
