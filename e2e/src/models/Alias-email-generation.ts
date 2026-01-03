import faker from "faker";
import {
  
  getFakeTenCharUniqueId,
 
} from "../main/support/data-generator";



export const emailaliasgeneration = async (): Promise<any> => {
  let uniquemailalias = await getFakeTenCharUniqueId();
  
  const jsonData = "[]"; // Empty JSON array

  const newData = {
    "Unique Email Alias": uniquemailalias,
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
