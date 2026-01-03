import dotenv from "dotenv";
const report = require("multiple-cucumber-html-reporter");
import { env } from "../env/parseEnv";

// Load COMMON config (default if not set)
dotenv.config({ path: env("COMMON_CONFIG_FILE", "settings/settings.env") });

// Load environment-specific config (default localhost)
const envName = env("NODE_ENV", "localhost");
dotenv.config({ path: `./main/env/${envName}.env` });

dotenv.config({ path: env("COMMON_CONFIG_FILE", "settings/settings.env") });


var runType = env("DEVICE");
var platformName = env("PLATFORM_NAME");
var platformVersion = env("PLATFORM_VERSION");
var projectName = env("PROJECT_NAME");
var reportName = env("REPORT_NAME");
var reportTitle = env("REPORT_TITLE");
var pageFooter = env("PAGE_FOOTER");
// const displayDuration = Boolean(env("DISPLAY_DURATION"));
// const durationInMS = Boolean(env("DURATION_IN_MS"));
// const hideMetadata = Boolean(env("HIDE_METADATA"));
var sprint = env("SPRINT");
var release = env("RELEASE");
var browserType = env("UI_AUTOMATION_BROWSER");
var jsonPath = env("JSON_REPORT_FILE");
var htmlPath = env("HTML_REPORT_FILE");

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZoneName: "short",
  timeZone: "Europe/London",
};
const now: string = new Date().toLocaleDateString("en-GB", options);

report.generate({
  jsonDir: jsonPath,
  reportPath: htmlPath,
  pageTitle: reportTitle,
  reportName: reportName,
  pageFooter: pageFooter,
  metadata: {
    browser: {
      name: browserType,
      version: "latest",
    },
    device: runType,
    platform: {
      name: platformName,
      version: platformVersion,
    },
  },
  customData: {
    title: "Run Information",
    data: [
      { label: "Project", value: projectName },
      { label: "Release", value: release },
      { label: "Sprint", value: sprint },
      { label: "Execution Start Time", value: now },
    ],
  },
});
