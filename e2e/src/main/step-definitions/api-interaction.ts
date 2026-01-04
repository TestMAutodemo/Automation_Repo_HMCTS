import { Given } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import fs from "fs";
import { default as data } from "../../tests/config/auth/credentials.json";
import {
  createDirectory,
  getMostRecentFileName,
  removeFiles,
} from "../support/html-behaviour";
import * as _ from "lodash";
import { expect } from 'playwright/test';;
import { envNumber } from "../env/parseEnv";
import { readJsonFromFolders } from "../support/web-elements-helper";
import path from "path";
import * as cheerio from "cheerio";

Given(
  /^the generic api with "([^"]*)" and "([^"]*)" should be found$/,
  async function (this: ScenarioWorld, apiKey: string, searchCriteria: string) {
    const {
      screen: { page },
      globalVariables,
    } = this;

    const fullURL = `${data.apis.generic.validKeyEnv}${globalVariables[apiKey]}`;
    console.log(
      `the generic api with ${globalVariables[apiKey]} key and ${searchCriteria} should be found`
    );

    const pageContent = await page.context().newPage();

    const targetDirectory = path.join(
      path.dirname(path.dirname(__dirname)),
      ".."
    );

    const genericPath = path.join(
      targetDirectory,
      "temp",
      "download",
      "generic"
    );

    const flag = await fetchAndProcessAPIData(
      pageContent,
      fullURL,
      searchCriteria,
      globalVariables,
      genericPath
    );

    return expect(flag).toBeTruthy();
  }
);
//!================================================

Given(
  /^the domcare api with "([^"]*)" and "([^"]*)" should be found$/,
  async function (this: ScenarioWorld, apiKey: string, searchCriteria: string) {
    const {
      screen: { page },
      globalVariables,
    } = this;

    const fullURL = `${data.apis.domcare.validKeyEnv}${globalVariables[apiKey]}`;
    console.log(
      `the domcare api with ${apiKey} key and ${searchCriteria} should be found`
    );
    const pageContent = await page.context().newPage();

    const targetDirectory = path.join(
      path.dirname(path.dirname(__dirname)),
      ".."
    );

    const genericPath = path.join(targetDirectory, "temp", "download", "dom");

    const flag = await fetchAndProcessAPIData(
      pageContent,
      fullURL,
      searchCriteria,
      globalVariables,
      genericPath
    );

    return expect(flag).toBeTruthy();
  }
);

Given(
  /^the survey api with "([^"]*)" and "([^"]*)" survey id, between start date "([^"]*)" and end date "([^"]*)" should be "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    apiKey: string,
    surveyId: string,
    startDate: string,
    endDate: string,
    searchCriteria: string
  ) {
    const {
      screen: { page },
      globalVariables,
    } = this;

    let [b, api_key] = globalVariables[apiKey].split(" - ", 2);

    const fullURL = `${data.apis.survey.validKeyEnv}${surveyId}/json/${api_key}`;
    console.log(`url: ${fullURL}`);
    console.log(
      `the survey api with ${apiKey} and ${surveyId}, between start date ${startDate} and end date ${endDate} should be ${searchCriteria}`
    );
    const pageContent = await page.context().newPage();

    const targetDirectory = path.join(
      path.dirname(path.dirname(__dirname)),
      ".."
    );

    const genericPath = path.join(
      targetDirectory,
      "temp",
      "download",
      "survey"
    );

    const flag = await fetchAndProcessAPIData(
      pageContent,
      fullURL,
      searchCriteria,
      globalVariables,
      genericPath
    );

    return expect(flag).toBeTruthy();
  }
);

Given(
  /^the survey api with "([^"]*)" and "([^"]*)" survey id, between start date "([^"]*)" and end date "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    apiKey: string,
    surveyId: string,
    startDate: string,
    endDate: string
  ) {
    const {
      screen: { page },
      globalVariables,
    } = this;

    let [b, api_key] = globalVariables[apiKey].split(" - ", 2);

    const fullURL = `${data.apis.survey.validKeyEnv}${surveyId}/json/${api_key}`;
    console.log(`url: ${fullURL}`);
    console.log(
      `the survey api with ${apiKey} and ${surveyId}, between start date ${startDate} and end date ${endDate}`
    );
    const pageContent = await page.context().newPage();

    await pageContent.goto(fullURL);
    var viewContent = await pageContent.content();
    var contents = extractJSONFromHTML(viewContent);

    //! API TO JSON - STARTS
    if (contents != null) {
      const currentDirectory = __dirname;

      const parentDirectory = path.dirname(currentDirectory);
      const grandparentDirectory = path.dirname(parentDirectory);
      const targetDirectory = path.join(grandparentDirectory, "..");

      const directory = path.join(targetDirectory, "temp");

      const survey_path = directory + "/download/survey/";

      removeFiles(survey_path); // clean dir

      let obj = JSON.parse(
        contents.replace(/"{/g, "[{").replace(/}"/g, "}]").replace(/\\"/g, '"')
      );
      console.log(obj.survey.questions.length);

      for (let index = 0; index < obj.survey.questions.length; index += 999) {
        let extension;
        if (startDate !== "" || endDate !== "") {
          extension = `?startDate=${startDate}&endDate=${endDate}&&offset=${index}`;
        } else {
          extension = `?offset=${index}`;
        }
        console.log(`url + extension: ${fullURL.trim() + "/" + extension}`);
        var completePath = fullURL.trim() + "/" + extension;
        await pageContent.goto(completePath);
        await pageContent.waitForLoadState("domcontentloaded", {
          timeout: envNumber("PROCESS_TIMEOUT"),
        }); // Wait for the 'DOMContentLoaded' event.
        var viewContent = await pageContent.content();

        var sourceFileContents = extractJSONFromHTML(viewContent);
        if (sourceFileContents != null) {
          // console.log(sourceFileContents);

          var outputFilePath = await createDirectory(survey_path);

          //? write to json file
          try {
            // Specify the path and name of the output file
            console.log(outputFilePath);

            let newFileName = `/api_data${index}.json`;

            // Write the JSON data to the file
            fs.writeFileSync(outputFilePath + newFileName, sourceFileContents);

            globalVariables["accepted file"] = outputFilePath + newFileName;

            console.log(
              `Data successfully written to ${outputFilePath + newFileName}`
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }
);

Given(
  /^the generic api contents between the ui payload and apuser should be equal$/,
  async function (this: ScenarioWorld) {
    console.log(`the api generic contents should be equal`);

    const targetDirectory = path.join(
      path.dirname(path.dirname(__dirname)),
      ".."
    );

    const generic_path = path.join(
      targetDirectory,
      "temp",
      "download",
      "generic"
    );

    const generic_payload = path.join(
      targetDirectory,
      "temp",
      "data",
      "payload",
      "generic"
    );

    var res1 = await getMostRecentFileName(generic_path);
    var res2 = await getMostRecentFileName(generic_payload);
    console.log(`The downloaded file is: ${res1}`);
    console.log(`The payload file is: ${res2}`);

    const api = fs.readFileSync(generic_path + "/" + res1, "utf-8");
    const payload = fs.readFileSync(generic_payload + "/" + res2, "utf-8");

    return expect(api.replace(/\s+/g, "")).toEqual(payload.replace(/\s+/g, ""));
  }
);

Given(
  /^the domcare api contents should be equal$/,
  async function (this: ScenarioWorld) {
    console.log(`the api domcare contents should be equal`);

    const targetDirectory = path.join(
      path.dirname(path.dirname(__dirname)),
      ".."
    );

    const domcare_path = path.join(targetDirectory, "temp", "download", "dom");

    const domcare_payload = path.join(
      targetDirectory,
      "temp",
      "data",
      "payload",
      "dom"
    );

    var res1 = await getMostRecentFileName(domcare_path);
    var res2 = await getMostRecentFileName(domcare_payload);

    const api = fs.readFileSync(domcare_path + "/" + res1, "utf-8");
    const payload = fs.readFileSync(domcare_payload + "/" + res2, "utf-8");

    return expect(api.replace(/\s+/g, "")).toEqual(payload.replace(/\s+/g, ""));
  }
);

Given(
  /^the "([^"]*)" survey with "([^"]*)" api contents should be equal$/,
  async function (this: ScenarioWorld, folderName: string, fileName: string) {
    console.log(
      `the ${folderName} survey with ${fileName} api contents should be equal`
    );

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..");

    const directory = path.join(targetDirectory, "temp");

    const survey_path = directory + "/download/survey/";
    const survey_payload = directory + "/data/survey/";

    var res1 = await getMostRecentFileName(survey_path);

    var res2 = await readJsonFromFolders(
      survey_payload,
      folderName,
      fileName + ".json"
    );

    const api = fs.readFileSync(survey_path + "/" + res1, "utf-8");

    return expect(api.replace(/\s+/g, "")).toEqual(res2?.replace(/\s+/g, ""));
  }
);

//!===============================

function extractJSONFromHTML(htmlResponse: string): string | null {
  // Parse the HTML using cheerio
  const $ = cheerio.load(htmlResponse);

  // Find the hidden div element
  const jsonDiv = $("div[hidden=true]");

  // Check if the div was found
  if (jsonDiv.length === 0) {
    console.error("No hidden div element found containing JSON data.");
    return null;
  }

  // Extract the text content from the hidden div
  const jsonData = jsonDiv.text().trim();

  // Check if jsonData is empty
  if (!jsonData) {
    console.error("No JSON data found in the hidden div element.");
    return null;
  }

  try {
    // Parse the extracted JSON data into a JavaScript object
    const jsonObject = JSON.parse(jsonData);

    // Convert the JavaScript object to a JSON string
    const jsonString = JSON.stringify(jsonObject, null, 2);

    // Return the JSON string
    return jsonString;
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return null;
  }
}

async function fetchAndProcessAPIData(
  pageContent: any,
  fullURL: string,
  searchCriteria: string,
  globalVariables: any,
  genericPath: string
): Promise<boolean> {
  const initialResponse = await pageContent
    .goto(fullURL)
    .then(() => pageContent.content());
  const initialContents = extractJSONFromHTML(initialResponse);

  if (initialContents !== null) {
    const obj = JSON.parse(initialContents);

    if (!initialContents || !obj.totalItems) {
      console.error("Invalid or missing totalItems in the initial response.");
      return false;
    }

    const totalItems = obj.totalItems;
    console.log(`Total items: ${totalItems}`);

    removeFiles(genericPath);

    let flag = false;
    let outputFileName = "";
    let outputData = "[";

    for (let index = 0; index < totalItems; index += 999) {
      const extension = `&&offset=${index}`;
      await pageContent.goto(fullURL + extension);

      await pageContent.waitForLoadState("networkidle");
      await pageContent.waitForLoadState("domcontentloaded");
      const response = await pageContent.content();
      const sourceFileContents = extractJSONFromHTML(response);

      try {
        if (sourceFileContents !== null) {
          const jsonData = JSON.parse(sourceFileContents);

          for (let i = 0; i < jsonData.items.length; i++) {
            const item = jsonData.items[i];
            if (item.cqcId == searchCriteria) {
              if (flag) {
                outputData += ",";
              }
              outputData += JSON.stringify(item);
              flag = true;
            }
          }

          if (flag) {
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error(
          "JSON Content that caused the error:",
          sourceFileContents
        );
      }
    }

    outputData += "]";

    try {
      const outputFilePath = await createDirectory(genericPath);
      outputFileName = "/api_data.json";
      fs.writeFileSync(outputFilePath + outputFileName, outputData);
      globalVariables["accepted file"] = outputFilePath + outputFileName;
      console.log(
        `Data successfully written to ${outputFilePath + outputFileName}`
      );
    } catch (error) {
      console.error("Error writing JSON to file:", error);
    }

    console.log(`${searchCriteria} is found: ${flag}`);
    return flag;
  }

  return false;
}
