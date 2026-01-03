import faker from "faker";

export const getFakeEmail = async (): Promise<string> => {
  const email = faker.internet.email();
  const modifiedEmail = email.replace(/@.*$/, "@email.fake"); // Replace the domain
  console.log(modifiedEmail);
  return modifiedEmail;
};

export const getFakeFirstName = async (): Promise<string> => {
  const firstName = faker.name.firstName();
  console.log(firstName);
  return firstName;
};

export const getFakeLastName = async (): Promise<string> => {
  const lastName = faker.name.lastName();
  console.log(lastName);
  return lastName;
};

export const getFakeFullName = async (): Promise<string> => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  console.log(`${firstName} ${lastName}`);
  return `${firstName} ${lastName}`;
};

export const getFakeFileName = async (): Promise<string> => {
  const fileName = faker.system.fileName();
  console.log(`${fileName}`);
  return fileName;
};

export const getFakePhoneNumber = async (): Promise<string> => {
  const phoneNumber = faker.phone.phoneNumber("01#########");
  console.log(phoneNumber);
  //   const phoneNumber = faker.phone.phoneNumber();
  //   console.log(`${phoneNumber}`);
  return phoneNumber;
};

export const getFakeJobTitle = async (): Promise<string> => {
  const jobTitle = faker.name.jobTitle();
  console.log(`${jobTitle}`);
  return jobTitle;
};

export const getFakePassword = async (length: number): Promise<string> => {
  const password = faker.internet.password(length, true, true, true);
  console.log(password);
  return password;
};

export const getFakeStreetAddress = async (): Promise<string> => {
  const streetAddress = faker.address.streetAddress();
  console.log(streetAddress);
  return streetAddress;
};

export const getFakeCityAddress = async (): Promise<string> => {
  const city = faker.address.city();
  console.log(city);
  return city;
};

export const getFakeCompanyName = async (): Promise<string> => {
  const companyName = faker.company.companyName();
  console.log(companyName);
  return companyName;
};

export const getFakeStateAddress = async (): Promise<string> => {
  const state = faker.address.state();
  console.log(state);
  return state;
};

export const getFakeCompanyAddress = async (): Promise<string> => {
  const companyAddress = {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    county: faker.address.county(),
    postalCode: faker.address.zipCode("??# #??"),
    country: "United Kingdom",
  };
  const formattedAddress = `${companyAddress.street}, ${companyAddress.city}, ${companyAddress.county}, ${companyAddress.postalCode}, ${companyAddress.country}`;

  return formattedAddress;
};

export const getFakeCountryAddress = async (): Promise<string> => {
  const country = faker.address.country();
  console.log(country);
  return country;
};

export const getFakePostcodeAddress = async (): Promise<string> => {
  const postcode = faker.address.zipCode("??# #??");
  console.log(postcode);
  return postcode;
};

export const getFakeCountryCodeAddress = async (): Promise<string> => {
  const countryCode = faker.address.countryCode();
  console.log(countryCode);
  return countryCode;
};

export const getFakeGender = async (): Promise<string> => {
  const gender = faker.name.gender();
  console.log(gender);
  return gender;
};

export const getFakeDOB = async (): Promise<string> => {
  const randomDOB = faker.date.past().toLocaleDateString("en-GB");
  console.log(randomDOB);
  return randomDOB;
};


export const getFakeDate = async (): Promise<string> => {
  const startDate = new Date(1970, 0, 1); // Start date for generating random dates (e.g., January 1, 1970)
  const endDate = new Date(); // End date (current date) to limit the range of random dates

  // Generate a random date between startDate and endDate
  const randomDate = faker.date.between(startDate, endDate);

  // Format the random date to "dd/MM/yyyy" (e.g., "23/11/2022")
  const formattedDate = randomDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  console.log(formattedDate);
  return formattedDate;
};

export function getRandomNumber(): number {
  // Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
  const randomDecimal = Math.random();

  // Multiply the random decimal by 3 to get a number between 0 (inclusive) and 3 (exclusive)
  const randomZeroToThree = randomDecimal * 3;

  // Add 1 and take the ceiling to get a random number between 1 and 3
  const randomNumber = Math.ceil(randomZeroToThree);

  return randomNumber;
};

export function getRandomRangeNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAlphabet(alphabet: string[]): string {
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

//? Data Generator
export const getFakeTenCharUniqueId = async (): Promise<string> => {
  const postcode = faker.address.zipCode("??#####??#");
  console.log(postcode);
  return postcode;
};

export function getRandomBooleanAsString(): string {
  return Math.random() >= 0.5 ? "Y" : "N";
}

export function getRandomDecimal(
  min: number,
  max: number,
  decimalPlaces: number
): number {
  // Generate a random decimal number between 0 and 1
  const randomDecimal = Math.random();

  // Scale and shift the random number to the desired range
  const scaledNumber = randomDecimal * (max - min) + min;

  // Round the scaled number to the specified decimal places
  const roundedNumber = Number(scaledNumber.toFixed(decimalPlaces));
  console.log(roundedNumber);
  return roundedNumber;
}
