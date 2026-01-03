import * as fs from "fs";
import * as path from "path";
import { ElementKey, ElementLocator, GlobalConfig } from "../env/global";
import { Page } from "playwright";
import {
  extractPageIdFromPath,
  getCurrentPageId,
} from "./navigation-behaviour";

export async function findAndReadJsonKey(
  parentFolderPath: string,
  folderName: string,
  fileName: string,
  key: string
): Promise<string | undefined> {
  const folderPath = findFolderWithName(parentFolderPath, folderName);
  if (folderPath === undefined) {
    return undefined;
  }
  console.log(`folder name: ${folderName}`);
  var file = `${fileName.replace(" ", "_")}.json`;
  console.log(`file name: ${file}`);
  console.log(`key name: ${key}`);
  return await readJsonKey(folderPath, file, key);
}

export async function readJsonFromFolders(
  parentPath: string,
  targetFolder: string,
  fileName: string
): Promise<string | undefined> {
  try {
    const files = await fs.promises.readdir(parentPath);
    for (const file of files) {
      const filePath = path.join(parentPath, file);
      const fileStat = await fs.promises.stat(filePath);
      if (fileStat.isDirectory()) {
        if (file === targetFolder) {
          const json = await readJsonFromFiles(filePath, fileName);
          if (json !== undefined) {
            return json;
          }
        } else {
          const json = await readJsonFromFolders(
            filePath,
            targetFolder,
            fileName
          );
          if (json !== undefined) {
            return json;
          }
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error reading JSON:", error);
    return undefined;
  }
}

async function readJsonFromFiles(
  filePath: string,
  fileName: string
): Promise<string | undefined> {
  try {
    const fileContents = await fs.promises.readFile(
      path.join(filePath, fileName),
      "utf-8"
    );
    return fileContents;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error reading JSON:", error);
    }
    return undefined;
  }
}

export async function findAndReadJson(
  parentPath: string,
  folderName: string,
  fileName: string
): Promise<any | undefined> {
  try {
    const files = await fs.promises.readdir(parentPath);
    for (const file of files) {
      const filePath = path.join(parentPath, file);
      const fileStat = await fs.promises.stat(filePath);
      if (fileStat.isDirectory()) {
        if (file === folderName) {
          const json = await readJsonFromFolder(filePath, fileName);
          if (json !== undefined) {
            return json;
          }
        } else {
          const json = await findAndReadJson(filePath, folderName, fileName);
          if (json !== undefined) {
            return json;
          }
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error reading JSON:", error);
    return undefined;
  }
}

async function readJsonFromFolder(
  folderPath: string,
  fileName: string
): Promise<any | undefined> {
  try {
    const files = await fs.promises.readdir(folderPath);
    const file = files.find((file) => file === fileName);
    console.log(`the file is ${file}`);
    if (file) {
      const filePath = path.join(folderPath, file);
      const fileContent = await fs.promises.readFile(filePath, "utf8");
      const json = JSON.parse(fileContent);
      return json;
    } else {
      console.error("File not found:", fileName);
      return undefined;
    }
  } catch (error) {
    console.error("Error reading JSON:", error);
    return undefined;
  }
}

//! UPDATE- ON PAGE ELEMENT LOCATOR
export const verifyElementLocator = (
  page: Page,
  elementKey: ElementKey,
  globalConfig: GlobalConfig,
  fileName: string
): ElementLocator => {
  const { pageElementMappings } = globalConfig;

  // const currentPage = getCurrentPageId(page, globalConfig);
  const { pathname: currentPath } = new URL(page.url());
  const currentPageId = extractPageIdFromPath(currentPath, globalConfig);
  const fileKey = `${fileName.replace(/ /g, "_")}`.toLowerCase();
  console.log(`file name: ${fileKey}`);
  console.log(`current page id: ${currentPageId}`);

  // First, look for elementKey in the pageElementMappings object for fileName
  if (pageElementMappings[fileKey]) {
    return pageElementMappings[fileKey][elementKey];
  }

  // If not found, look for elementKey in the pageElementMappings object for the current page
  return pageElementMappings[currentPageId]?.[elementKey];
};

function findFolderWithName(
  folderPath: string,
  folderName: string
): string | undefined {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === folderName) {
        console.log(`path: ${filePath}`);
        return filePath;
      }
      const value = findFolderWithName(filePath, folderName);
      if (value !== undefined) {
        return value;
      }
    }
  }
  return undefined;
}

async function readJsonKey(
  folderPath: string,
  fileName: string,
  key: string
): Promise<any | undefined> {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    console.log(`path: ${filePath}`);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      const value = await readJsonKey(filePath, fileName, key);
      if (value !== undefined) {
        return value;
      }
    } else if (file === fileName) {
      const contents = await fs.promises.readFile(filePath, "utf8");
      const json = JSON.parse(contents);
      if (key in json) {
        return json[key];
      }
    }
  }
  return undefined;
}

async function readJson(
  folderPath: string,
  fileName: string
): Promise<any | undefined> {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    console.log(`path: ${filePath}`);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      const content = await readJson(filePath, fileName);
      return content;
    } else if (file === fileName) {
      const contents = await fs.promises.readFile(filePath, "utf8");
      const json = JSON.parse(contents);
      return json;
    }
  }
  return undefined;
}
