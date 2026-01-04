const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load env files early
dotenv.config({ path: process.env.COMMON_CONFIG_FILE || "settings/settings.env" });

const environment = process.env.NODE_ENV || "localhost";
dotenv.config({ path: `./main/env/${environment}.env` });

// strict env getter (matches your parseEnv.ts behavior)
function env(key) {
  const value = process.env[key];
  if (!value) throw new Error(`No environment variable found for ${key}`);
  return value;
}

function getJsonFromFile(relativePath) {
  // Your TS version used process.cwd() + path
  return require(`${process.cwd()}${relativePath}`);
}

function getJsonFromRecursiveFiles(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function getFilesRecursively(directory) {
  const files = fs.readdirSync(directory);
  let result = [];
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) result = result.concat(getFilesRecursively(filePath));
    else result.push(filePath);
  }
  return result;
}

const hostConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig = getJsonFromFile(env("PAGE_URLS_PATH"));

const parentFolder = path.join(__dirname, env("PAGE_ELEMENTS_PATH"));
const mappingFiles = getFilesRecursively(parentFolder);

const pageElementMappings = mappingFiles.reduce((acc, file) => {
  const key = file.replace(".json", "");
  const pageName = key.split("\\").pop()?.replace(/"/g, "");
  const elementMappings = getJsonFromRecursiveFiles(file);

  if (!pageName) return acc;

  const pageKey = pageName.replace(/ /g, "_").toLowerCase();
  acc[pageKey] = { ...elementMappings };
  return acc;
}, {});

const worldParameters = {
  emailsConfig: {},
  hostConfig,
  pagesConfig,
  pageElementMappings,
};

module.exports = { worldParameters };
