import fs from "fs";

interface Response {
  questionId: number;
  response: string;
}

interface Location {
  cqcId: string;
  responses: Response[];
}

interface Survey {
  [key: string]: any;
}

export interface Payload {
  offset: number;
  limit: number;
  survey: Survey;
  totalLocations: number;
  locations: Location[];
}

export const extractTotalLocations = async (
  payload: Payload,
  targetLocations: Location[]
): Promise<number> => {
  const { totalLocations, locations } = payload;
  let count = 0;

  for (const targetLocation of targetLocations) {
    const foundLocation = locations.find(
      (location) => location.cqcId === targetLocation.cqcId
    );
    if (foundLocation) {
      count++;
    }
  }

  return count;
};

export const extractSurveyProperties = async (
  payload: Payload,
  propertyNames: string[]
): Promise<Survey> => {
  const { survey } = payload;
  const extractedSurvey: Survey = {};

  for (const propertyName of propertyNames) {
    if (survey.hasOwnProperty(propertyName)) {
      extractedSurvey[propertyName] = survey[propertyName];
    }
  }

  return extractedSurvey;
};

export const extractPayload = async (
  payload: Payload,
  targetLocations: Location[]
): Promise<Payload> => {
  const { totalLocations, locations, ...rest } = payload;
  const extractedLocations: Location[] = [];

  for (const targetLocation of targetLocations) {
    const foundLocation = locations.find(
      (location) => location.cqcId === targetLocation.cqcId
    );
    if (foundLocation) {
      extractedLocations.push(foundLocation);
    }
  }

  return {
    ...rest,
    totalLocations: extractedLocations.length,
    locations: extractedLocations,
  };
};

// Example usage:
//   const payload: Payload = {
//     offset: 0,
//     limit: 1000,
//     survey: {
//       name: "DHSC Proposed Questions",
//       providerType: "CareHomes, DomCare",
//       description: null,
//       isActive: true,
//       isSingleResponse: false,
//       questions: [
//         {
//           id: 269,
//           text: "Test",
//           subtext: "",
//           answerType: "Boolean",
//           answerMeta: "",
//           min: null,
//           max: null,
//           isAutoReset: false,
//           isRequired: false,
//           sortOrder: 0
//         },
//         {
//           id: 270,
//           text: "xxxxxxxxxxx",
//           subtext: "xx",
//           answerType: "PicklistMulti",
//           answerMeta: "xx|xx|bb|mm|",
//           min: null,
//           max: null,
//           isAutoReset: false,
//           isRequired: true,
//           sortOrder: 1
//         }
//       ]
//     },
//     totalLocations: 3,
//     locations: [
//       {
//         cqcId: "1-12345540354",
//         responses: [
//           { questionId: 269, response: "true" },
//           { questionId: 270, response: "xx|xx|" }
//         ]
//       },
//       {
//         cqcId: "1-X0005",
//         responses: [
//           { questionId: 269, response: "true" },
//           { questionId: 270, response: "xx|xx|bb|mm|" }
//         ]
//       },
//       {
//         cqcId: "1-752918925",
//         responses: [
//           { questionId: 269, response: "false" },
//           { questionId: 270, response: "mm|" }
//         ]
//       }
//     ]
//   };

//   const targetLocations: Location[] = [
//     {
//       cqcId: "1-12345540354",
//       responses: [
//         { questionId: 269, response: "true" },
//         { questionId: 270, response: "xx|xx|" }
//       ]
//     },
//     {
//       cqcId: "1-752918925",
//       responses: [
//         { questionId: 269, response: "false" },
//         { questionId: 270, response: "mm|" }
//       ]
//     }
//   ];

//   const extractedPayload = extractPayload(payload, targetLocations);
//   console.log(JSON.stringify(extractedPayload, null, 2));

export const readJSONFromWebAndSaveToFile = async (
  url: string,
  filePath: string
): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch JSON from ${url}. Status: ${response.status} ${response.statusText}`
      );
    }

    const jsonData = await response.json();

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log("JSON data saved to file:", filePath);
  } catch (error: any) {
    console.error("Error occurred:", error.message);
  }
};

// Example usage
// const url = "https://example.com/data.json";
// const filePath = "data.json";

// readJSONFromWebAndSaveToFile(url, filePath);
