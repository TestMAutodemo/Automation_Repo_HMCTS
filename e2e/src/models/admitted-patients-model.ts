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

export const createAdmissionModel = async (): Promise<any> => {
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
    "Unique Patient ID": uniqueId,
    "Speciality (Treatment Function Code)": functionCode,
    "Requesting Manager Name": managersName,
    "Requesting Manager Email": managersEmail,
    "Requesting Manager Telephone": managersPhone,
    "RTT Clock Start Date": startDate,
    "Procedure (OPCS)": procedure,
    "ASA Level": level,
    "Does the patient require Critical Care Facilities?": isCareFacility,
    "Willing to Travel Distance": travelDistance,
    "Body Mass Index (BMI)": bmi,
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
