import { When, Then } from '@cucumber/cucumber';
import { request, expect } from 'playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { ScenarioWorld } from "./setup/world";
import { validateBookingData } from '../support/validators'; // ad
import { APIResponse } from 'playwright/test';

let messageResponse: APIResponse;


import { resolveTestValue } from "../support/test-data/resolve-value";
import { logData } from "../support/test-data/logger-data";

When("the user submits a contact message with:", async function (dataTable) {
  const raw = dataTable.rowsHash();

  // Resolve all values (supports cred:, env:, gen:, literal:)
  const payload = {
    name: await resolveTestValue(raw.name),
    email: await resolveTestValue(raw.email),
    phone: await resolveTestValue(raw.phone),
    subject: await resolveTestValue(raw.subject),
    description: await resolveTestValue(raw.description),
  };

  // Safe logging (no secrets leaked)
  logData("api-payload", "contact-message", JSON.stringify(payload), {
    fields: Object.keys(payload),
  });

  const apiContext = await request.newContext();

  const baseUrl = await resolveTestValue("cred:apis.bb.baseUrl");

  messageResponse = await apiContext.post(`${baseUrl}/api/message`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    data: payload,
  });

  console.log(`📡 Status: ${messageResponse.status()}`);
});



Then("the message should be sent successfully", async function () {
  const status = messageResponse.status();
  const bodyText = await messageResponse.text();

expect(
  status,
  `Expected status=200 but got status=${status}, body=${bodyText}`
).toBe(200);

  // Parse JSON safely (only if JSON)
  let json: any = null;
try {
  json = bodyText ? JSON.parse(bodyText) : null;
} catch {
  // Keep failure message helpful
  throw new Error(`Expected JSON response but got: ${bodyText}`);
}

if (json) expect(json).not.toHaveProperty("error");
});

Then("the message should be rejected with status {int}", async function (expectedStatus: number) {
  const status = messageResponse.status();
  const bodyText = await messageResponse.text();

  expect(
    status,
    `Expected status=${expectedStatus} but got status=${status}, body=${bodyText}`
  ).toBe(expectedStatus);
});