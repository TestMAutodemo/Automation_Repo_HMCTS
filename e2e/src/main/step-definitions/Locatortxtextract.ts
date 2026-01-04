import { Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';;
import { ScenarioWorld } from './setup/world';

Then(
  /^the address block inside "([^"]*)" should contain the following text:$/,
  async function (this: ScenarioWorld, selector: string, expectedText: string) {
    const {
      screen: { page },
    } = this;

    // Find <h5>Address and grab its following sibling <p>
    const addressLocator = page.locator(`${selector} >> h5:text("Address")`).locator('xpath=following-sibling::p');
    const actualText = await addressLocator.textContent();

    const normalizedActual = actualText
      ?.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join('\n'); // Normalize into newline-separated

    const normalizedExpected = expectedText.trim().replace(/\r?\n/g, '\n');

    console.log('🧾 Normalized actual text:\n', normalizedActual);
    console.log('📋 Expected text:\n', normalizedExpected);

    expect(normalizedActual).toBe(normalizedExpected);
  }
);