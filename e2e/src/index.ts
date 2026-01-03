import dotenv from "dotenv";
import {
  env,
  getJsonFromFile,
  getJsonFromRecursiveFiles,
} from "./main/env/parseEnv";
import { generateCucumberRuntimeTag } from "./main/support/tag-helper";
import {
  GlobalConfig,
  HostConfig,
  PageElementMappings,
  PagesConfig,
} from "./main/env/global";
import fs from "fs";
import path from "path";


const environment = env("NODE_ENV");

dotenv.config({ path: env("COMMON_CONFIG_FILE") });
dotenv.config({ path: `${env("ENV_PATH")}${environment}.env` });

const hostConfig: HostConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig: PagesConfig = getJsonFromFile(env("PAGE_URLS_PATH"));

// console.log("Hosts file exists:", hostConfig);

// // Check if it's an array and convert it if needed
// const hostConfigArray = Array.isArray(hostConfig)
//   ? hostConfig
//   : Object.keys(hostConfig);

// console.log("Hosts file exists:", hostConfigArray);

/**
 * Read all files from directory in a recursive way
 * @param directory
 * @returns
 */
function getFilesRecursively(directory: string): string[] {
  const files = fs.readdirSync(directory);
  let result: string[] = [];
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      result = result.concat(getFilesRecursively(filePath));
    } else {
      result.push(filePath);
    }
  });
  return result;
}

const parentFolder = path.join(__dirname, env("PAGE_ELEMENTS_PATH"));
const mappingFiles = getFilesRecursively(parentFolder);

const getEnvList = (): string[] => {
  const envList = Object.keys(hostConfig);

  if (envList.length === 0) {
    throw Error(`🧨 No environments mapped in your ${env("HOSTS_URL_PATH")}`);
  }

  return envList;
};

const pageElementMappings: PageElementMappings = mappingFiles.reduce(
  (pageElementConfigAcc, file) => {
    if (!file) {
      // Handle the case where file is undefined
      return pageElementConfigAcc;
    }
    // filter out to return e.g. home_page
    const key = file.replace(".json", ""); // removes the extension e.g 'nat_template//src//...//pages/home/home_page.json:{'key':'value'} to 'nat_template//src//...//pages/home/home_page:{'key':'value'}
    const pageName = key.split("\\").pop()?.replace(/"/g, ""); // removes everything up until after \\ and remove the quotes
    const elementMappings = getJsonFromRecursiveFiles(file); // new format becomes home_page:{'key':'value'}

    if (pageName) {
      const pageKey = pageName.replace(/ /g, "_").toLowerCase();
      const pageElements = { ...elementMappings };
      return {
        ...pageElementConfigAcc,
        [pageKey]: pageElements,
      };
    } else {
      // Handle the case where pageName is undefined
      return pageElementConfigAcc;
    }
  },
  {}
);

// const worldParameters: GlobalConfig = {
//   hostConfig,
//   pagesConfig,
//   pageElementMappings,
// };

const worldParameters: GlobalConfig = {
  emailsConfig: {},
  hostConfig: Array.isArray(hostConfig)
    ? hostConfig.reduce((acc, host) => ({ ...acc, [host]: host }), {})
    : hostConfig,
  pagesConfig,
  pageElementMappings,
   
};

const common = `./src/tests/features/**/*.feature \
                --require-module ts-node/register \
                --require ./src/main/step-definitions/**/**/*.ts \
                --world-parameters ${JSON.stringify(worldParameters)} \
                -f json:./reports/report.json \
                --format progress-bar 
                --parallel ${env("PARALLEL")} \
                --retry ${env("RETRY")}
                `;
                
                
const api = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "api"
);

const a11y = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "a11y"
);


const unit = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "unit"
);
const smoke = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "smoke"
);
const sanity = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "sanity"
);

const integration = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "integration"
);
const regression = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "regression"
);
const pipe = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "pipe"
);
const scrape = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "scrape"
);
const dev = generateCucumberRuntimeTag(
  common,
  environment,
  getEnvList(),
  "scrape"
);

console.log("\n🥒 ✨ 🥒 ✨ 🥒 ✨ 🥒 ✨ 🥒 ✨ 🥒 ✨ 🥒 ✨ 🥒 \n");

export { a11y, api, unit, smoke, regression, pipe, integration, sanity, scrape, dev };
