import {
    getFakeDate,
    getFakeEmail,
    getFakeFullName,
    getFakePhoneNumber,
    getFakeTenCharUniqueId,
    getRandomAlphabet,
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
  const code3 = ["R", "C", "S"];
  
  export const createCancerSearchModel = async (): Promise<any> => {
    let uniqueId = await getFakeTenCharUniqueId();
    let functionCode = getRandomAlphabet(code2);
    let managersName = await getFakeFullName();
    let managersEmail = await getFakeEmail();
    let managersPhone = await getFakePhoneNumber();
    let startDate = await getFakeDate();
    let procedure = getRandomAlphabet(code1);
    let cancerTreatmentRequired = getRandomAlphabet(code3);
    let cancerSite = getRandomRangeNumber(1, 15);
    let travelDistance = getRandomRangeNumber(1, 3);
  
    const jsonData = "[]"; // Empty JSON array
  
    const newData = {
      "Unique Patient ID (* Not NHS Number)": "**",
      "Speciality (Treatment Function Code)": 100,
      "Requesting Manager Name": managersName,
      "Requesting Manager Email": managersEmail,
      "Requesting Manager Telephone": managersPhone,
      "Cancer Decision to Treat Start Date": startDate,
      "Cancer Treatment Required": cancerTreatmentRequired,
      "Surgery OPCS Code": procedure,
      "Cancer Site": cancerSite,
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
  