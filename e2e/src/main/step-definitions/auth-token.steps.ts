import { When, Then } from '@cucumber/cucumber';
import { expect, request, APIResponse } from 'playwright/test';
import { ScenarioWorld } from './setup/world';


When(
  'the user logs in and stores the token',
  async function (this: ScenarioWorld, dataTable) {
    
     const token = dataTable.rowsHash().token;
    this.token = token;
     console.log('📌 Using manually provided token:', token);
    
    const apiContext = await request.newContext();

    const loginResponse = await apiContext.post('https://automationintesting.online/admin', {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      data: {
        username: 'admin',
        password: 'password',
      },
    });

    const status = loginResponse.status();
    const bodyText = await loginResponse.text();
    console.log('🔐 Login HTTP Status:', status);
    console.log('📄 Login Body Text:', bodyText);

    expect(status).toBe(200); // Ensure login success

    try {
      const json = JSON.parse(bodyText);
      this.token = json.token;
      this.loginResponse = loginResponse;

      console.log('✅ Token stored:', this.token);
    } catch (e) {
      console.error('❌ Failed to parse login response:', e);
      throw e;
    }
  }
);

When('the user sends a token validation request with token {string}',
  async function (this: ScenarioWorld, token: string) {
    const apiContext = await request.newContext();

    const authResponse = await apiContext.post(
      'https://automationintesting.online/api/auth/validate',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        data: {
          token: token,
        },
      }
    );

    this.authResponse = authResponse;
    console.log('📨 Token validation response received');
  }
);
Then('the token should be valid', async function (this: ScenarioWorld) {
  const status = this.authResponse?.status();
  const bodyText = await this.authResponse?.text();

  console.log('🧪 Validating token...');
  console.log('HTTP Status:', status);
  console.log('Raw Response:', bodyText);

  expect(status).toBe(200);

  const json = JSON.parse(bodyText || '{}');
  expect(json.authenticated).toBe(true);
});

Then('the token should be invalid', async function (this: ScenarioWorld) {
  const status = this.authResponse!.status();
  const bodyText = await this.authResponse!.text();

  console.log('Invalid token validation status:', status);
  console.log('Invalid token response body:', bodyText);

  expect(status).toBeGreaterThanOrEqual(400);
  const json = JSON.parse(bodyText);
  if ('authenticated' in json) {
    expect(json.authenticated).toBe(false);
  } else if ('error' in json) {
    expect(json.error.toLowerCase()).toContain('invalid');
  } else {
    throw new Error(`Unexpected response: ${bodyText}`);
  }
});

