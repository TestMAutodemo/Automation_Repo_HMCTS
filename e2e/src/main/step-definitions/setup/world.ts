import playwright, {
  BrowserContextOptions,
  Page,
  Browser,
  BrowserContext,
} from "playwright";
import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import { env } from "../../env/parseEnv";
import { GlobalConfig, GlobalVariables } from "../../env/global";
import { BookingData } from './types'
import { APIResponse } from 'playwright/test';


export type Screen = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class ScenarioWorld extends World {

  globalConfig: GlobalConfig;
  globalVariables: GlobalVariables;
  selectedDate?: string;
  CustomerName?: string;
  Cust_email?: string;
  bookingId?: string;
   lastBookingResponse?: any;
   bookingData?: BookingData;
    token?: string;
    loginResponse?: APIResponse;
    authResponse?: APIResponse; 
    page?: Page;
    constructor(options: IWorldOptions) {
    super(options);

    this.globalConfig = options.parameters as GlobalConfig;
    this.globalVariables = { currentScreen: "" };
    
  }

 

  screen!: Screen;

  // Add this method to clear cookies and local storage
  async clearCookiesAndStorage(): Promise<void> {
    if (this.screen && this.screen.context) {
      // Clear cookies
      await this.screen.context.clearCookies();

      // Clear local storage
      await this.screen.page.evaluate(() => {
        window.localStorage.clear();
      });
    }
  }

  async init(contextOptions?: BrowserContextOptions): Promise<Screen> {
    await this.closeScreen();

    const browser = await this.newBrowser();
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    this.screen = { browser, context, page };

    return this.screen;
  }

  private async closeScreen(): Promise<void> {
    if (this.screen) {
      await this.screen.page?.close();
      await this.screen.context?.close();
      await this.screen.browser?.close();
    }
  }

  private async newBrowser(): Promise<Browser> {
    const automationBrowser = env("UI_AUTOMATION_BROWSER");

    switch (automationBrowser) {
      case "chromium":
        return playwright.chromium.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          args: [
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process",
            "--disable-site-isolation-trials",
            "--disable-features=site-per-process,SitePerProcess",
            "--disable-blink-features=AutomationControlled",
            "--disable-popup-blocking", // Disable pop-up blocking
            "--disable-notifications", // Disable notifications
          ],
        });
      case "firefox":
        return playwright.firefox.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          args: ["--disable-popup-blocking", "--disable-notifications"],
        });
      case "webkit":
        return playwright.webkit.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          args: ["--disable-popup-blocking", "--disable-notifications"],
        });
      case "chrome":
        return playwright.chromium.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          ...playwright.devices["Desktop Chrome"],
          channel: "chrome",
          args: [
            "--disable-popup-blocking", // Disable pop-up blocking
            "--disable-notifications", // Disable notifications
          ],
        });
      case "edge":
        return playwright.chromium.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          ...playwright.devices["Desktop Edge"],
          channel: "msedge",
          args: [
            "--disable-popup-blocking", // Disable pop-up blocking
            "--disable-notifications", // Disable notifications
          ],
        });
      case "mobile-chrome":
        const mobileChrome = playwright.devices["Pixel 5"];
        return playwright.chromium.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          ...mobileChrome,
        });
      case "mobile-safari":
        const mobileSafari = playwright.devices["iPhone 12"];
        return playwright.webkit.launch({
          devtools: process.env.DEVTOOLS !== "false",
          headless: process.env.HEADLESS !== "false",
          ...mobileSafari,
        });
      default:
        throw new Error(`Unsupported browser: ${automationBrowser}`);
    }
  }
}

setWorldConstructor(ScenarioWorld);
