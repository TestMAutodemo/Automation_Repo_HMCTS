import * as fs from "fs";
import * as ExcelJS from "exceljs";

// export async function updateExcelRow(
//   excelPath: string,
//   jsonPath: string,
//   excelSheet: string,
//   rowTextToUpdate: string,
//   columnHeaderStartAt: number = 1
// ): Promise<void> {
//   // Load the Excel workbook
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(excelPath);

//   // Load the JSON data
//   const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

//   // Select the worksheet by name
//   const worksheet = workbook.getWorksheet(excelSheet);

//   console.log(`Working on ${worksheet}`);

//   // Find the row to update based on partial row text match
//   let rowToUpdate;
//   worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
//     if (rowNumber >= columnHeaderStartAt) {
//       const rowData = row.values as ExcelJS.CellValue[]; // Ensure rowData is an array
//       if (Array.isArray(rowData)) {
//         const rowText = rowData.join(" ").trim(); // Concatenate and trim
//         console.log(`Row ${rowNumber}:`, rowText);

//         // Check if the row text contains the provided rowTextToUpdate
//         if (rowText.includes(rowTextToUpdate)) {
//           rowToUpdate = row;
//         }
//       }
//     }
//   });

//   if (!rowTextToUpdate) {
//     // If rowTextToUpdate is empty, add data to a new row
//     const newRow = worksheet.addRow([]);
//     for (const columnHeader of Object.keys(jsonData)) {
//       const columnIndex = getColumnIndexFromName(
//         worksheet,
//         columnHeader,
//         columnHeaderStartAt
//       );
//       if (columnIndex !== -1) {
//         newRow.getCell(columnIndex).value = jsonData[columnHeader];
//       }
//     }

//     // Save the updated workbook to a write stream
//     const writeStream = fs.createWriteStream(excelPath);
//     await workbook.xlsx.write(writeStream);
//     writeStream.end();

//     console.log(
//       `Added data to a new row. Total rows: ${worksheet.actualRowCount}`
//     );
//   } else if (rowToUpdate) {
//     // If rowTextToUpdate is not empty and found, update the Excel row with data from the JSON
//     for (const columnHeader of Object.keys(jsonData)) {
//       const columnIndex = getColumnIndexFromName(worksheet, columnHeader);
//       if (columnIndex !== -1) {
//         rowToUpdate.getCell(columnIndex).value = jsonData[columnHeader];
//       }
//     }

//     // Save the updated workbook to a write stream
//     const writeStream = fs.createWriteStream(excelPath);
//     await workbook.xlsx.write(writeStream);
//     writeStream.end();

//     console.log(`Updated row with text '${rowTextToUpdate}' in Excel file.`);
//   } else {
//     console.error(`Row with text '${rowTextToUpdate}' not found.`);
//     return;
//   }
// }

//!------------------------------------------------------

export async function updateExcelRow(
  excelPath: string,
  jsonPath: string,
  excelSheet: string,
  rowTextToUpdate: string,
  columnHeaderStartAt: number = 1
): Promise<void> {
  // Load the Excel workbook
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  // Load the JSON data
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  // Select the worksheet by name
  const worksheet = workbook.getWorksheet(excelSheet);

  console.log(`Working on ${worksheet.name}`);

  // Find the row to update based on partial row text match
  let rowToUpdate;
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber >= columnHeaderStartAt) {
      const rowData = row.values as ExcelJS.CellValue[]; // Ensure rowData is an array
      if (Array.isArray(rowData)) {
        const rowText = rowData.join(" ").trim(); // Concatenate and trim

        // Debugging - Print the row text and row number
        console.log(`Row ${rowNumber}:`, rowText);

        // Check if the row text contains the provided rowTextToUpdate
        console.log(`Searching for rowTextToUpdate: ${rowTextToUpdate}`);
        if (rowText.includes(rowTextToUpdate)) {
          rowToUpdate = row;
        }
      }
    }
  });

  if (!rowToUpdate) {
    console.error(`Row with text '${rowTextToUpdate}' not found.`);
    return;
  }

  // Debugging - Print the rowToUpdate data
  console.log("Row to Update:", rowToUpdate.values);

  // Iterate through the JSON data and update the Excel row
  for (const columnHeader of Object.keys(jsonData)) {
    const columnIndex = getColumnIndexFromName(
      worksheet,
      columnHeader,
      columnHeaderStartAt
    );

    // Debugging - Print the columnIndex and columnHeader
    console.log(`Column Index for '${columnHeader}': ${columnIndex}`);

    if (columnIndex !== -1) {
      rowToUpdate.getCell(columnIndex).value = jsonData[columnHeader];
    } else {
      // Try to find a case-insensitive match
      const caseInsensitiveMatch = worksheet
        .getColumn(columnHeaderStartAt)
        .values.findIndex((value) => {
          return (
            typeof value === "string" &&
            value.toLowerCase() === columnHeader.toLowerCase()
          );
        });

      if (caseInsensitiveMatch !== -1) {
        rowToUpdate.getCell(caseInsensitiveMatch + 1).value =
          jsonData[columnHeader];
      }
    }
  }

  // Save the updated workbook to a write stream
  const writeStream = fs.createWriteStream(excelPath);
  await workbook.xlsx.write(writeStream);
  writeStream.end();

  console.log(`Updated row with text '${rowTextToUpdate}' in Excel file.`);
}

interface DataRow {
  [key: string]:
    | string
    | number
    | boolean
    | Record<string, string | number | boolean>;
}

export async function updateExcelSheet(
  excelPath: string,
  excelSheet: string,
  jsonPath: string
): Promise<void> {
  try {
    // Load the Excel workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);

    // Select the worksheet by name
    const worksheet = workbook.getWorksheet(excelSheet);

    // Read the JSON data from the external file
    const jsonData: DataRow[] = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    // Define a function to flatten nested objects
    function flattenObject(obj: Record<string, any>, parentKey = ""): DataRow {
      return Object.keys(obj).reduce((acc, key) => {
        const currentKey = parentKey ? `${parentKey} - ${key}` : key;
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          Object.assign(acc, flattenObject(obj[key], currentKey));
        } else {
          acc[currentKey] = obj[key];
        }
        return acc;
      }, {} as DataRow);
    }

    // Create a header row with all unique column names from the JSON data
    const headerRow: string[] = Array.from(
      new Set<string>(
        jsonData.flatMap((row) => Object.keys(flattenObject(row)))
      )
    );

    // Write the header row to the worksheet (if it doesn't exist)
    if (worksheet.getRow(1).cellCount === 0) {
      worksheet.addRow(headerRow);
    }

    // Create a Set to keep track of existing rows by their values (excluding the header row)
    const existingRows = new Set<string>();

    // Loop through the existing rows (excluding the header row) and add them to the Set
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      const values = headerRow.map(
        (column) => row.getCell(headerRow.indexOf(column) + 1).value
      );
      existingRows.add(JSON.stringify(values));
    }

    // Loop through the JSON data and add rows to the Excel sheet, skipping duplicates
    for (const dataRow of jsonData) {
      const flattenedRow = flattenObject(dataRow);
      const rowValues = headerRow.map((column) =>
        flattenedRow[column] !== undefined ? flattenedRow[column] : ""
      );
      const rowString = JSON.stringify(rowValues);
      if (!existingRows.has(rowString)) {
        worksheet.addRow(rowValues);
        existingRows.add(rowString);
      }
    }

    // Save the updated workbook to a write stream
    const writeStream = fs.createWriteStream(excelPath);
    await workbook.xlsx.write(writeStream);
    writeStream.end();

    console.log(`Excel file updated.`);
  } catch (error) {
    console.error("Error updating Excel file:", error);
  }
}

function getColumnIndexFromName(
  worksheet: ExcelJS.Worksheet,
  name: string,
  columnHeaderStartAt: number = 1
): number {
  const headerRow = worksheet.getRow(columnHeaderStartAt); // Assuming headers are in the first row
  // console.log(`Header Row:`, headerRow.values);
  for (let colIndex = 1; colIndex <= headerRow.cellCount; colIndex++) {
    const columnHeader = headerRow.getCell(colIndex).value as string;
    console.log(`Checking column header: ${columnHeader} = ${name}`);
    // Case-insensitive comparison
    if (columnHeader && columnHeader.toLowerCase() === name.toLowerCase()) {
      console.log(
        `Column header: ${columnHeader} returned index of: ${colIndex}`
      );
      return colIndex;
    }
  }
  return -1; // Return -1 if the column name is not found
}
