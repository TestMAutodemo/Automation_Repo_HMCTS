import { Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "../setup/world";
import { logger } from "../../logger";
import { getMostRecentFileName } from "../../support/html-behaviour";

Then(
  /^the file should( not)? be downloaded$/,
  async function (this: ScenarioWorld, negate: boolean) {
    logger.log(`the file should ${negate ? "not " : ""}be downloaded`);

    const filePath = "temp/download/";
    var file = await getMostRecentFileName(filePath);
    var result = false;
    if (file) {
      result = true;
    }
    logger.log("downloaded file is " + file + " found in " + filePath);
    return result === !negate;
  }
);
