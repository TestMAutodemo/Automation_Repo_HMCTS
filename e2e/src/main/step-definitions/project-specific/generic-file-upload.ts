import { When } from "@cucumber/cucumber";
import { createAdmissionModel } from "../../../models/admitted-patients-model";
import { createAdmissionSearchModel } from "../../../models/admitted-patients-search-model";
import { ElementKey } from "../../env/global";
import { logger } from "../../logger";
import { readJSONFileContent } from "../../support/csv-helper";
import {
  getMostRecentFileName,
  uploadFile,
} from "../../support/html-behaviour";
import { waitFor, waitForSelector } from "../../support/wait-for-behaviour";
import { verifyElementLocator } from "../../support/web-elements-helper";
import { ScenarioWorld } from "../setup/world";
import path from "path";
import { createNonAdmissionModel } from "../../../models/non-admitted-patients-model";
import { createNonAdmissionSearchModel } from "../../../models/non-admitted-patients-search-model";
import { createCancerModel } from "../../../models/cancer-model";
import { createCancerSearchModel } from "../../../models/cancer-search-model";

import { createDiagnosticModel } from "../../../models/diagnostics-model";
import { createDiagnosticSearchModel } from "../../../models/diagnostics-search-model";

When(
  /^I click the "([^"]*)" (?:button|link|icon|element|text|image) to upload generic "([^"]*)" file content and store the id as "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    fileToUpload: string,
    dataId: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

    logger.log(
      `I click the ${elementKey} (?:button|link|icon|element|text|image) to upload generic ${fileToUpload} file content, on the ${fileName}`
    );

    let uniquePatientId;
    let jsonData;
    if (fileToUpload.toLowerCase() === "admitted") {
      jsonData = await createAdmissionModel();
      uniquePatientId = jsonData[0]["Unique Patient ID"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    } else if (fileToUpload.toLowerCase() === "admitted-patients-search-model") {
      jsonData = await createAdmissionSearchModel();
      uniquePatientId = jsonData[0]["Unique Request Id"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    } else if (fileToUpload.toLowerCase() === "non admitted") {
      jsonData = await createNonAdmissionModel();
      uniquePatientId = jsonData[0]["Unique Request Id"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    }else if (fileToUpload.toLowerCase() === "non-admitted-patients-search-model") {
      jsonData = await createNonAdmissionSearchModel();
      uniquePatientId = jsonData[0]["Unique Request Id"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    
    } else if (fileToUpload.toLowerCase() === "cancer") {
      jsonData = await createCancerModel();
      uniquePatientId = jsonData[0]["Unique Patient ID (* Not NHS Number)"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    } else if (fileToUpload.toLowerCase() === "cancer-search-model") {
      jsonData = await createCancerSearchModel();
      uniquePatientId = jsonData[0]["Unique Patient ID (* Not NHS Number)"]; // Retrieve the "Unique Patient ID" from the first element in the jsonDa
    }else if (fileToUpload.toLowerCase() === "diagnostics") {
      jsonData = await createDiagnosticModel();
      uniquePatientId = jsonData[0]["Unique Request Id"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    } else if (fileToUpload.toLowerCase() === "diagnostics-search-model") {
      jsonData = await createDiagnosticSearchModel();
      uniquePatientId = jsonData[0]["Unique Request Id"]; // Retrieve the "Unique Patient ID" from the first element in the jsonData array
    }

    globalVariables[dataId] = uniquePatientId; // Store the value globally

    const currentDirectory = __dirname;

    const parentDirectory = path.dirname(currentDirectory);
    const grandparentDirectory = path.dirname(parentDirectory);
    const targetDirectory = path.join(grandparentDirectory, "..", "..");

    const outputDirectory = path.join(targetDirectory, "temp/download");

    readJSONFileContent(jsonData, fileToUpload, outputDirectory);

    var file = await getMostRecentFileName(outputDirectory);

    console.log(`File to upload is ${file}`);

    const elementIdentifier = verifyElementLocator(
      page,
      elementKey,
      globalConfig,
      fileName
    );

    await waitFor(async () => {
      const elementStable = await waitForSelector(page, elementIdentifier);
      if (elementStable && file) {
        await uploadFile(
          page,
          elementIdentifier,
          path.join(outputDirectory, file) // Use path.join for consistent file path handling
        );
      }
      return elementStable;
    });
  }
);


