import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { env, getJsonFromFile, getJsonFromRecursiveFiles } from "./main/env/parseEnv";
import { GlobalConfig, HostConfig, PagesConfig, PageElementMappings } from "./main/env/global";

dotenv.config({ path: process.env.COMMON_CONFIG_FILE || "settings/settings.env" });

const environment = process.env.NODE_ENV || "localhost";
dotenv.config({ path: `./main/env/${environment}.env` });

const hostConfig: HostConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig: PagesConfig = getJsonFromFile(env("PAGE_URLS_PATH"));

function getFilesRecursively(directory: string): string[] {
  const files = fs.readdirSync(directory);
  let result: string[] = [];
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) result = result.concat(getFilesRecursively(filePath));
    else result.push(filePath);
  }
  return result;
}

const parentFolder = path.join(__dirname, env("PAGE_ELEMENTS_PATH"));
const mappingFiles = getFilesRecursively(parentFolder);

const pageElementMappings: PageElementMappings = mappingFiles.reduce((acc, file) => {
  const key = file.replace(".json", "");
  const pageName = key.split("\\").pop()?.replace(/"/g, "");
  const elementMappings = getJsonFromRecursiveFiles(file);
  if (!pageName) return acc;
  const pageKey = pageName.replace(/ /g, "_").toLowerCase();
  return { ...acc, [pageKey]: { ...elementMappings } };
}, {} as PageElementMappings);

export const worldParameters: GlobalConfig = {
  emailsConfig: {},
  hostConfig,
  pagesConfig,
  pageElementMappings,
};
