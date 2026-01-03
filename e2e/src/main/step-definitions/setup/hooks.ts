import "../../env/loadDotEnv";   // FIRST
import { env, envNumber } from "../../env/parseEnv";
import { Before, After, setDefaultTimeout, AfterAll } from "@cucumber/cucumber";
import { getViewPort } from "../../support/browser-behaviour";
import { ScenarioWorld } from "./world";
import { logger } from "../../logger";
import { sendReportEmail } from "../../reporter/send-email";

setDefaultTimeout(envNumber("SCRIPT_TIMEOUT"));

Before(async function (this: ScenarioWorld, scenario) {
  logger.log(`🥒 Running cucumber "${scenario.pickle.name}"`);

  const contextOptions = {
    viewport: getViewPort(),
    ignoreHTTPSErrors: true,
    recordVideo: {
      dir: `${env("VIDEO_PATH")}${scenario.pickle.name}`,
    },
  };

  const ready = await this.init(contextOptions);
  return ready;
});

After(async function (this: ScenarioWorld, scenario) {
  const {
    screen: { page, context, browser },
    globalVariables,
  } = this;
  const scenarioStatus = scenario.result?.status;
  let pageIndex: string | undefined = globalVariables["pageIndex"];
  console.log(" after test 1 " + pageIndex);

  let index: number = +pageIndex;
  console.log(" after test 2 " + index);

  console.log(pageIndex == null); // 👉️ true
  console.log(pageIndex === null); // 👉️ false

  let pages = context.pages();

  if (scenarioStatus === "FAILED") {
    console.log("\n ❌ ✨ ❌ ✨ ❌ ✨ ❌ ✨ ❌ ✨ ❌ ✨ ❌ ✨ ❌ \n");
    const scenarioName = scenario.pickle.name;
    // const steps = scenario.pickle.steps.map((step, index) => {
    //   const mark = index === scenario.pickle.steps.length - 1 ? "❌" : "✔️ ";
    //   return `${mark} ${step.text}`;
    // });
    var message = "Scenario: " + scenarioName;
    console.log(message);
    const pipeline = Boolean(env("PIPELINE_EMAIL_NOTIFICATION"));
    if (pipeline === true) {
      await sendReportEmail(message.toString());
    } else {
      console.log("❌ Email not sent");
    }

    if (pageIndex == null) {
      const screenshot = await page.screenshot({
        path: `${env("SCREENSHOT_PATH")}${scenario.pickle.name}.png`,
      });
      await this.attach(screenshot, "image/png");
    } else {
      globalVariables["failed"] = "false";
      const screenshot = await pages[index].screenshot({
        path: `${env("SCREENSHOT_PATH")}${scenario.pickle.name}.png`,
      });
      await this.attach(screenshot, "image/png");
    }
  } else if (scenarioStatus === "PASSED") {
    console.log("\n ✔️ ✨ ✔️ ✨ ✔️ ✨ ✔️ ✨ ✔️ ✨ ✔️ ✨ ✔️ ✨ ✔️ \n");
    // const steps = scenario.pickle.steps.map((step) => step.text);
  }

  await browser.close();
  return browser;
});
