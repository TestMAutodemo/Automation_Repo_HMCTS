import { Then } from "@cucumber/cucumber";
import { getViolations, injectAxe } from "axe-playwright";
import { ScenarioWorld } from "./setup/world";
import { getCurrentPageId } from "../support/navigation-behaviour";
import { createHtmlReport } from "axe-html-reporter";
import { env } from "../env/parseEnv";
import { logger } from "../logger";
import { AxeBuilder } from "@axe-core/playwright";
import { format } from 'date-fns'; // You need to install date-fns if not already installed
import { IWorld } from '@cucumber/cucumber';
import { expect } from 'playwright/test';;



Then(
  /^I inject axe accessibility engine$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
    } = this;

    
    await injectAxe(page);
  }
);

Then(
  /^I generate an accessibility analysis report$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const pageId = await getCurrentPageId(page, globalConfig);

    logger.log(`I generate a ${pageId} page accessibility analysis report`);

    createHtmlReport({
      results: { violations: await getViolations(page) },
      options: {
        outputDir: `${env("ACCESSIBILITY_REPORT_PATH")}`,
        reportFileName: `${pageId}_${env("HTML_ACCESSIBILITY_FILE")}`,
      },
    });
  }
);


Then(
  /^I generate full version accessibility analysis report$/,
  async function (this: ScenarioWorld) {
    const {
      screen: { page },
      globalConfig,
    } = this;

   const pageId = await getCurrentPageId(page, globalConfig); // ✅ FIXED
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const fileName = `${pageId}_${timestamp}_accessibility_report.html`;

    const currentUrl = await page.url(); // ⬅️ Step 1: Get URL

    // ✅ Step 2: Log and attach URL to the report
    if (this.attach) {
      await this.attach(`Accessibility analysis run for URL: ${currentUrl}`);
    }
    console.log(`🌐 URL: ${currentUrl}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);

    const violations = await getViolations(page);
    console.log(`🆔 Final resolved pageId: ${pageId}`);

    createHtmlReport({
      results: { violations },
      options: {
        outputDir: env("ACCESSIBILITY_REPORT_PATH"),
        reportFileName: fileName,
      },
    });

    console.log(`✅ Accessibility report generated: ${fileName}`);
    console.log(`🆔 Final resolved pageId: ${pageId}`);
  }
);