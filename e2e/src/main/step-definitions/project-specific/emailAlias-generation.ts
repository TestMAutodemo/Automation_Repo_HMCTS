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
import { emailaliasgeneration } from "../../../models/Alias-email-generation";

When(
  /^I generate emailalias by providing firstpart of email "([^"]*)" and email domain "([^"]*)" file and store the fullemail as "([^"]*)", on the "([^"]*)" page$/,
  async function (
    this: ScenarioWorld,
    firstpartemail: string,
    emaildomain:string,
    Gdataid: string,
    fileName: string
  ) {
    const {
      screen: { page },
      globalConfig,
      globalVariables,
    } = this;

   

    let uniquealias;
    let finalemail;
    let jsonData;
   
      jsonData = await emailaliasgeneration();
      uniquealias = jsonData[0]["Unique Email Alias"]; // Retrieve the "Unique Email Alias" from the first element in the jsonData array
      finalemail=firstpartemail+"+"+uniquealias+emaildomain;
      globalVariables[Gdataid] = finalemail; // Store the value globally
      console.log(`Generated email id is ${finalemail}`);

     
  }
);


