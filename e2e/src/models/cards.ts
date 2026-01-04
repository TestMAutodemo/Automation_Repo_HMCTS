import { Page, Locator } from "playwright/test";

const metricCard = async (
  page: Page,
  elementIdentifier: string,
  cardToSelect: string
): Promise<Locator | null> => {
  const elements: Locator[] = await page.locator(elementIdentifier).all();
  let locator: Locator | null = null; // Initialize to null
  for (const element of elements) {
    let cardHeader = element.locator(".card-header");
    if (!(await cardHeader.locator("div.row").isVisible())) {
      break;
    }
    let cardHeaderRow = cardHeader.locator("div.row");
    let headerLeft = cardHeaderRow.locator("div").first();

    let actual = (await headerLeft.innerText()).trim();
    if (actual === cardToSelect) {
      locator = element;
      return locator;
    }
  }

  return locator;
};

const closedMetricCard = async (
  page: Page,
  elementIdentifier: string,
  cardToSelect: string
): Promise<Locator | null> => {
  const elements: Locator[] = await page.locator(elementIdentifier).all();
  let locator: Locator | null = null; // Initialize to null
  for (const element of elements) {
    let cardHeader = element.locator(".card-header");
    let headerLeft = cardHeader.locator("span").first();

    let actual = (await headerLeft.innerText()).trim();
    if (actual === cardToSelect) {
      return (locator = element);
    }
  }

  return locator;
};

export const expandMetricCard = async (
  page: Page,
  elementIdentifier: string,
  cardToSelect: string
): Promise<void> => {
  let card = await closedMetricCard(page, elementIdentifier, cardToSelect);

  if (card) {
    let expand = card.locator("button");
    await expand.highlight();
    await expand.click();
  }
};

export const closedMetricCardFooter = async (
  page: Page,
  elementIdentifier: string,
  cardToSelect: string,
  criteriaToSearch: string
): Promise<void> => {
  let card = await closedMetricCard(page, elementIdentifier, cardToSelect);
  if (card) {
    const selectedCard = card.locator(".show");
    await page.waitForTimeout(parseInt("2", 10) * 1000);

    let footer = await selectedCard.locator("form > div.p-2 > button").all();
    for (const button of footer) {
      await button.waitFor();
      let buttonText = (await button.innerText()).toLowerCase();
      if (buttonText === criteriaToSearch.toLowerCase()) {
        await button.scrollIntoViewIfNeeded();
        await button.highlight();
        await button.click();
        return;
      }
    }
  }
};

export const ClickMetricCardOperation2 = async (
  page: Page,
  elementIdentifier: string,
  criteriaToSearch: string,
  cardToSelect: string,
  secondCriteriaToClick?: string
): Promise<void> => {
  let card: Locator | null = null; // Initialize to null

  card = await closedMetricCard(page, elementIdentifier, cardToSelect);

  if (card) {
    const selectedCard = card.locator(".show");
    await page.waitForTimeout(parseInt("4", 10) * 1000);
    let isForm = await selectedCard
      .locator("form > div.card-body > div")
      .count();
    if (isForm > 0) {
      let body = await selectedCard.locator("form > div.card-body > div").all();

      for (const item of body) {
        await item.waitFor();
        let elementText = await item.innerText();

        if (secondCriteriaToClick) {
          let result = elementText.includes(secondCriteriaToClick);
          if (result) {
            let collections = item.locator("div > div > label").all();
            for (const collection of await collections) {
              await collection.waitFor();
              let collectionText = await collection.innerText();

              if (criteriaToSearch === collectionText) {
                console.log(`label to click is ${collectionText}`);
                await collection.first().highlight();
                await collection.first().click();
                await page.waitForTimeout(parseInt("4", 10) * 1000);

                return;
              }
            }
          }
        }
      }
    }
  }
};

export const ClickAndSelectMetricCardOperation2 = async (
  page: Page,
  elementIdentifier: string,
  criteriaToSearch: string,
  cardToSelect: string,
  selectCriteria: string,
  secondCriteriaToClick?: string
): Promise<void> => {
  let card: Locator | null = null; // Initialize to null

  card = await closedMetricCard(page, elementIdentifier, cardToSelect);

  if (card) {
    const selectedCard = card.locator(".show");
    await page.waitForTimeout(parseInt("4", 10) * 1000);
    let isForm = await selectedCard
      .locator("form > div.card-body > div")
      .count();
    if (isForm > 0) {
      let body = await selectedCard.locator("form > div.card-body > div").all();

      for (const item of body) {
        await item.waitFor();
        let elementText = await item.innerText();

        if (secondCriteriaToClick) {
          let result = elementText.includes(secondCriteriaToClick);
          if (result) {
            let collections = item.locator("div > div > label").all();
            for (const collection of await collections) {
              await collection.waitFor();
              let collectionText = await collection.innerText();

              if (criteriaToSearch === collectionText) {
                console.log(`label to click is ${collectionText}`);
                await collection.first().highlight();
                await collection.first().click();
                await page.waitForTimeout(parseInt("4", 10) * 1000);
                let select = item.locator("div > div > select");
                if (await select.isVisible()) {
                  await select.selectOption(selectCriteria);
                }
                return;
              }
            }
          }
        }
      }
    }
  }
};

export const ClickMetricCardOperation = async (
  page: Page,
  elementIdentifier: string,
  criteriaToSearch: string,
  cardToSelect: string,
  secondCriteriaToClick?: string
): Promise<void> => {
  let card: Locator | null = null; // Initialize to null

  if (await metricCard(page, elementIdentifier, cardToSelect)) {
    card = await metricCard(page, elementIdentifier, cardToSelect);
  } else if (await closedMetricCard(page, elementIdentifier, cardToSelect)) {
    card = await closedMetricCard(page, elementIdentifier, cardToSelect);
  }

  if (card) {
    const selectedCard = card.locator(".show");
    await page.waitForTimeout(parseInt("4", 10) * 1000);
    let isForm = await selectedCard
      .locator("form > div.card-body > div")
      .count();
    if (isForm > 0) {
      let body = await selectedCard.locator("form > div.card-body > div").all();

      for (const item of body) {
        await item.waitFor();
        let elementText = await item.innerText();

        if (secondCriteriaToClick) {
          let result = elementText.includes(secondCriteriaToClick);
          if (result) {
            let collections = item.locator("div > div > label").all();
            for (const collection of await collections) {
              await collection.waitFor();
              let collectionText = await collection.innerText();

              if (criteriaToSearch === collectionText) {
                console.log(`label to click is ${collectionText}`);
                await collection.first().highlight();
                await collection.first().click();
                return;
              }
            }
          }
        }
      }
    }
  }

  if (card) {
    if ((await card.locator("button").count()) > 0) {
      const buttons: Locator[] = await card.locator("button").all();
      for (const button of buttons) {
        let actual = (await button.innerText()).trim();
        console.log(`The button is: ${actual}`);
        if (await button.isVisible()) {
          if (criteriaToSearch === actual) {
            await button.highlight();
            console.log(
              `Clicked ${(await button.innerText()).trim()} on Metric Card.`
            );
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            await button.click();
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            return;
          }
        }
      }
    }

    if ((await card.locator("label").count()) > 0) {
      const labels: Locator[] = await card.locator("label").all();
      for (const label of labels) {
        let actual = (await label.innerText()).trim();
        console.log(`The label is: ${actual}`);
        if (await label.isVisible()) {
          if (criteriaToSearch === actual) {
            await label.highlight();
            console.log(
              `Clicked ${(await label.innerText()).trim()} on Metric Card.`
            );
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            await label.scrollIntoViewIfNeeded();
            await label.click();
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            return;
          }
        }
      }
    }

    if ((await card.locator("a").count()) > 0) {
      const aTags: Locator[] = await card.locator("a").all();
      for (const aTag of aTags) {
        let actual = (await aTag.innerText()).trim();
        console.log(`The aTag is: ${actual}`);
        if (await aTag.isVisible()) {
          if (criteriaToSearch === actual) {
            await aTag.highlight();
            console.log(
              `Clicked ${(await aTag.innerText()).trim()} on Metric Card.`
            );
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            await aTag.scrollIntoViewIfNeeded();
            await aTag.click();
            await page.waitForTimeout(parseInt("2", 10) * 1000);
            return;
          }
        }
      }
    }
  }
};

export const VerifyTextOnMetricCard = async (
  page: Page,
  elementIdentifier: string,
  criteriaToSearch: string,
  cardToSelect: string
): Promise<string> => {
  let result;
  let card;

  if (await metricCard(page, elementIdentifier, cardToSelect)) {
    card = await metricCard(page, elementIdentifier, cardToSelect);
  } else if (await closedMetricCard(page, elementIdentifier, cardToSelect)) {
    card = await closedMetricCard(page, elementIdentifier, cardToSelect);
  }

  if ((await card.locator("ul").count()) > 0) {
    const ul: Locator[] = await card.locator("ul > li > span").all();
    for (const span of ul) {
      let actual = (await span.innerText()).trim();
      console.log(`The span is: ${actual}`);
      if (await span.isVisible()) {
        if (criteriaToSearch === actual) {
          await span.scrollIntoViewIfNeeded();
          await span.highlight();
          console.log(
            `verify: ${(await span.innerText()).trim()} on Metric Card.`
          );
          await page.waitForTimeout(parseInt("2", 10) * 1000);
          result = (await span.innerText()).trim();
          break;
        }
      }
    }
  }

  return result;
};
