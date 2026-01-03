import fs from "fs";
import path from "path"; // Import the path module for cross-platform file path operations
import Papa from "papaparse";

function convertJSONToCSV(jsonData: any[]): string {
  // Convert JSON to CSV using papaparse
  const csvData = Papa.unparse(jsonData);
  return csvData;
}

function readJSONFile(filePath: string, outputFilePath: string): void {
  if (fs.existsSync(filePath)) {
    // Check if the file exists
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    // Convert JSON to CSV
    const csvData = convertJSONToCSV(jsonData);

    // Save the CSV data to a file
    fs.writeFileSync(outputFilePath, csvData, "utf-8");

    console.log(`CSV file created: ${outputFilePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

export function readJSONFilesRecursive(
  directoryPath: string,
  fileName: string,
  outputDirectory: string
): void {
  // Read the files in the directory
  fs.readdirSync(directoryPath).forEach((file: string) => {
    const filePath = path.join(directoryPath, file); // Use path.join() for cross-platform compatibility

    // Check if the file is a directory
    if (fs.statSync(filePath).isDirectory()) {
      // Recursively read the files in the subdirectory
      readJSONFilesRecursive(filePath, fileName, outputDirectory);
    } else if (file === fileName + ".json" && file.endsWith(".json")) {
      // Read and convert the selected JSON file to CSV
      const outputFilePath = path.join(
        outputDirectory,
        file.replace(".json", ".csv")
      ); // Use path.join() for cross-platform compatibility
      readJSONFile(filePath, outputFilePath);
    }
  });
}

export function readJSONFileContent(
  jsonData: string[],
  fileName: string,
  outputDirectory: string
): void {
  // Check if the file already exists in the output directory
  let fileNumber = 0;
  let outputFilePath: string;

  do {
    fileNumber++;
    outputFilePath = path.join(
      outputDirectory,
      `${fileName}_${fileNumber}.csv`
    );
  } while (fs.existsSync(outputFilePath));

  // Convert JSON to CSV
  const csvData = convertJSONToCSV(jsonData);
  console.log("Generated CSV Data:", csvData);
  console.log("Generated File Path:", outputFilePath);

  // Save the CSV data to a file
  try {
    fs.writeFileSync(outputFilePath, csvData, "utf-8");
    console.log(`CSV file created: ${outputFilePath}`);
  } catch (err) {
    console.error("Error while writing CSV file:", err);
  }
}