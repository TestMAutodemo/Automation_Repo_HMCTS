import { When } from '@cucumber/cucumber';
import { request, expect } from 'playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { ScenarioWorld } from "./setup/world";
import { Then } from '@cucumber/cucumber';
import { validateBookingData } from '../support/validators'; // ad
type BookingData = {
  roomid: string;
  firstname: string;
  lastname: string;
  depositpaid: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
};

When('the user books a room with the following details:', async function (this: ScenarioWorld, dataTable: DataTable) {
  const apiContext = await request.newContext();
  const bookingData = dataTable.rowsHash() as BookingData;

  console.log('📤 Sending booking request with data:', bookingData);

  const response = await apiContext.post('https://automationintesting.online/api/booking', {
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    data: {
      roomid: Number(bookingData.roomid),
      firstname: bookingData.firstname,
      lastname: bookingData.lastname,
      depositpaid: bookingData.depositpaid === 'false',
      bookingdates: {
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
      },
      email: bookingData.email,
      phone: bookingData.phone,
    },
  });

  console.log(`📡 Received response with status: ${response.status()}`);

  // Try to parse raw response text to help with debugging
  const rawBody = await response.text();
  console.log('📥 Raw response body:', rawBody);

  // Check response status
  try {
    expect(response.ok()).toBeTruthy();
  } catch (error) {
    console.error('❌ API call failed with non-2xx status:', response.status());
    throw new Error(`API call failed.\nStatus: ${response.status()}\nBody: ${rawBody}`);
  }

  try {
    const body = JSON.parse(rawBody);
    console.log('✅ Parsed response JSON:', body);
    this.bookingId = body.bookingid;
    this.lastBookingResponse = body;
  } catch (e) {
    console.error('❌ Failed to parse JSON:', rawBody);
    throw e;
  }
});




Then(/^the booking response should match the input details$/, async function (this: ScenarioWorld) {
  const responseBody = this.lastBookingResponse;
  const expected = this.bookingData as BookingData;

  const booking = responseBody.booking;

  expect(responseBody).toHaveProperty('bookingid');
  expect(typeof responseBody.bookingid).toBe('number');

  expect(booking.firstname).toBe(expected.firstname);
  expect(booking.lastname).toBe(expected.lastname);
  expect(booking.email).toBe(expected.email);
  expect(booking.phone).toBe(expected.phone);
  expect(booking.depositpaid).toBe(expected.depositpaid === 'false');
  expect(booking.bookingdates.checkin).toBe(expected.checkin);
  expect(booking.bookingdates.checkout).toBe(expected.checkout);

  console.log('✅ Booking response matches expected data');
});

