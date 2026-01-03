import faker from "faker";
import {
  getFakeDate,
  getFakeEmail,
  getFakeFullName,
  getFakePhoneNumber,
  getFakeTenCharUniqueId,
  getRandomAlphabet,
  getRandomBooleanAsString,
  getRandomDecimal,
  getRandomNumber,
  getRandomRangeNumber,
} from "../main/support/data-generator";

const code1 = [
  "A01",
  "A021",
  "A022",
  "A023",
  "A024",
  "A025",
  "A026",
  "A027",
  "A028",
  "A029",
];
const code2 = [
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

export const createAdmissionSearchModel = async (): Promise<any> => {
  let uniqueId = await getFakeTenCharUniqueId();
  let functionCode = getRandomAlphabet(code2);
  let managersName = await getFakeFullName();
  let managersEmail = await getFakeEmail();
  let managersPhone = await getFakePhoneNumber();
  let startDate = await getFakeDate();
  let procedure = getRandomAlphabet(code1);
  let level = getRandomRangeNumber(1, 4);
  let isCareFacility = getRandomBooleanAsString();
  let travelDistance = getRandomRangeNumber(1, 3);
  let bmi = getRandomDecimal(10, 60, 1);

  const jsonData = "[]"; // Empty JSON array

  const newData = {
    "Unique Patient ID": "**",
    "Speciality (Treatment Function Code)": "100",
    "Requesting Manager Name": "Automation Admitted",
    "Requesting Manager Email": "AutomatTestupload@nhs.net",
    "Requesting Manager Telephone": "1904343007",
    "RTT Clock Start Date": "01/01/0001",
    "Procedure (OPCS)": "A01",
    "ASA Level": "1",
    "Does the patient require Critical Care Facilities?": "Y",
    "Willing to Travel Distance": "1",
    "Body Mass Index (BMI)": "10.1",
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
