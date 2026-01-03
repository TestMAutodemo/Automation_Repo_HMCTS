import {
    getFakeEmail,
    getFakeFullName,
    getFakePhoneNumber,
    getFakeTenCharUniqueId,
    getRandomAlphabet,
    getRandomBooleanAsString,
    getRandomRangeNumber,
  } from "../main/support/data-generator";
  
  const alphabets = ["D",  "BOTH"];
  const code = [
    "100",
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
  ];
  
  export const createDiagnosticSearchModel = async (): Promise<any> => {
    let uniqueId = await getFakeTenCharUniqueId();
    let functionCode = getRandomAlphabet(code);
    let managersName = await getFakeFullName();
    let managersEmail = await getFakeEmail();
    let managersPhone = await getFakePhoneNumber();
    let diagnosticModality = "D" + getRandomRangeNumber(1, 17);
    let diagnosticRequirement = getRandomAlphabet(alphabets);
    let isCancerActivity = getRandomBooleanAsString();
    let travelDistance = getRandomRangeNumber(1, 3);
  
    const jsonData = "[]"; // Empty JSON array
  
    const newData = {
      "Unique Request Id": "**",
      "Speciality (Treatment Function Code)": 100,
      "Requesting Manager Name": managersName,
      "Requesting Manager Email": managersEmail,
      "Requesting Manager Telephone": managersPhone,
      "Diagnostic Modality": diagnosticModality,
      "Diagnostic Requirement": diagnosticRequirement,
      "Does this request include cancer activity?": isCancerActivity,
      "Willing to Travel Distance": travelDistance,
    };
  
    let jsonArray;
    try {
      // Parse the JSON data into a JavaScript object (an empty array in this case)
      jsonArray = JSON.parse(jsonData);
  
      // Add the new data to the array
      jsonArray.push(newData);
  
      // Convert the modified array back to a JSON string
      // const updatedJsonData = JSON.stringify(jsonArray);
  
      // console.log(updatedJsonData);
    } catch (error) {
      console.error("Error parsing or modifying JSON data:", error);
    }
    return jsonArray;
  };
  