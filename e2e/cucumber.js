const { worldParameters } = require("./src/world-parameters.js");

module.exports = {
  default: [
    "src/tests/features/**/*.feature",
    "--require-module", "ts-node/register",
    "--require", "src/main/step-definitions/**/*.ts",
    "--require", "src/main/support/**/*.ts",
    "--world-parameters", JSON.stringify(worldParameters),
    "--format", "progress-bar",
    "--format", "json:reports/report.json"
  ].join(" ")
};
