import { Frame, Page } from "playwright";
import { ElementLocator } from "../env/global";
import { envNumber } from "../env/parseEnv";
import { logger } from "../logger";

export const waitFor = async <T>(
  predicate: () => T | Promise<T>,
  options?: { timeout?: number; wait?: number }
): Promise<T> => {
  const {
    timeout = envNumber("PROCESS_TIMEOUT"),
    wait = envNumber("PROCESS_CYCLE"),
  } = options || {};

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startDate = new Date();

  while (new Date().getTime() - startDate.getTime() < timeout) {
    const result = await predicate();
    if (result) return result;

    await sleep(wait);
    logger.log(`Waiting ${wait}ms`);
  }

  throw new Error(`Wait time of ${timeout}ms exceeded`);
};

export const waitForSelector = async (
  page: Page,
  elementIdentifier: ElementLocator,
  timeoutMs?: number
): Promise<boolean> => {
  try {
    await page.locator(elementIdentifier).waitFor({
      state: "visible",
      timeout: timeoutMs ?? envNumber("SELECTOR_TIMEOUT"),
    });
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectorOnPage = async (
  page: Page,
  elementIdentifier: ElementLocator,
  pages: Array<Page>,
  pageIndex: number
): Promise<boolean> => {
  try {
    await pages[pageIndex].waitForSelector(elementIdentifier, {
      state: "visible",
      timeout: envNumber("SELECTOR_TIMEOUT"),
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const waitForSelectorInIframe = async (
  elementIframe: Frame,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await elementIframe?.waitForSelector(elementIdentifier, {
      state: "visible",
      timeout: envNumber("SELECTOR_TIMEOUT"),
    });
    return true;
  } catch (e) {
    return false;
  }
};
