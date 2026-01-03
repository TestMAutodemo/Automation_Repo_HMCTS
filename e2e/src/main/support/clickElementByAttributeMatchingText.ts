import { Page } from 'playwright/test';

export async function clickElementByAttributeMatchingText(
  page: Page,
  attribute: string,
  partialText: string,
  attributeStartsWith: string = '',
  logPrefix: string = ''
): Promise<boolean> {
  const selector = attributeStartsWith
    ? `[${attribute}^="${attributeStartsWith}"]:not([${attribute}^="${attributeStartsWith}Description"])`
    : `[${attribute}]`;

  const elements = page.locator(selector);
  const count = await elements.count();

  for (let i = 0; i < count; i++) {
    const element = elements.nth(i);
    const innerText = (await element.innerText()).trim();

    console.log(`${logPrefix}🔍 Checking element #${i} text: "${innerText}"`);

    if (innerText.toLowerCase().includes(partialText.toLowerCase())) {
      console.log(`${logPrefix}✅ Match found: "${innerText}". Clicking...`);
      await element.click();
      return true;
    }
  }

  console.warn(`${logPrefix}❌ No element with [${attribute}^="${attributeStartsWith}"] matched text "${partialText}"`);
  return false;
}