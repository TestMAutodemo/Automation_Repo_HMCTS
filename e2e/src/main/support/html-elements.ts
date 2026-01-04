import { Page, Locator } from "playwright";

export const isList = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator[] | null> => {
  const listLocator: Locator[] = [];

  const list = await page
    .locator(elementIdentifier)
    .locator("li")
    .first()
    .isVisible();

  if (list) {
    const listElements = await page
      .locator(elementIdentifier)
      .locator("li")
      .all();
    listElements.map((element) => listLocator.push(element));
    return listLocator;
  }

  return null;
};

//#region - Links:
// <a>: Creates hyperlinks.
export const isLink = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator[] | null> => {
  const linkLocator: Locator[] = [];

  const link = await page.locator(elementIdentifier).locator("a").isVisible();

  if (link) {
    const listLinks = await page.locator(elementIdentifier).locator("a").all();
    listLinks.map((element) => linkLocator.push(element));
    return linkLocator;
  }
  return null;
};
// <href>: Specifies the URL the link points to.
export const isHref = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator | null> => {
  let hrefLocator: Locator = page.locator("body"); // Assign a default locator or use another appropriate default

  const href = await page
    .locator(elementIdentifier)
    .locator("href")
    .isVisible();

  if (href) {
    return (hrefLocator = page.locator(elementIdentifier).locator("href"));
  }
  return null;
};
// <target>: Defines where to open the linked content (e.g., "_blank" for a new tab).
export const isTarget = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator | null> => {
  let targetLocator: Locator = page.locator("body"); // Assign a default locator or use another appropriate default
  const target = await page
    .locator(elementIdentifier)
    .locator("target")
    .isVisible();

  if (target) {
    return (targetLocator = page.locator(elementIdentifier).locator("target"));
  }
  return null;
};

//#endregion

//#region - Images and Multimedia:
// <img>: Embeds images.
export const isImage = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const image = await page
    .locator(elementIdentifier)
    .locator("img")
    .isVisible();

  let imageLocator;
  if (image) imageLocator = page.locator(elementIdentifier).locator("img");
  return imageLocator;
};
// <audio>: Embeds audio.
export const isAudio = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const audio = await page
    .locator(elementIdentifier)
    .locator("audio")
    .isVisible();

  let audioLocator;
  if (audio) audioLocator = page.locator(elementIdentifier).locator("audio");
  return audioLocator;
};
// <video>: Embeds video.
export const isVideo = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const video = await page
    .locator(elementIdentifier)
    .locator("video")
    .isVisible();

  let videoLocator;
  if (video) videoLocator = page.locator(elementIdentifier).locator("video");
  return videoLocator;
};

//#endregion

//#region - Forms:
// <form>: Defines a form.
export const isForm = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const form = await page
    .locator(elementIdentifier)
    .locator("form")
    .isVisible();

  let formLocator;
  if (form) formLocator = page.locator(elementIdentifier).locator("form");
  return formLocator;
};
// <input>: Creates form input elements (text fields, checkboxes, radio buttons, etc.).
export const isInput = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const input = await page
    .locator(elementIdentifier)
    .locator("input")
    .isVisible();

  let inputLocator;
  if (input) inputLocator = page.locator(elementIdentifier).locator("input");
  return inputLocator;
};
// <textarea>: Defines a multiline text input.
export const isTextarea = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const textarea = await page
    .locator(elementIdentifier)
    .locator("textarea")
    .isVisible();

  let textareaLocator;
  if (textarea)
    textareaLocator = page.locator(elementIdentifier).locator("textarea");
  return textareaLocator;
};
// <select>: Creates a dropdown list.
export const isSelect = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const select = await page
    .locator(elementIdentifier)
    .locator("select")
    .isVisible();

  let selectLocator;
  if (select) selectLocator = page.locator(elementIdentifier).locator("select");
  return selectLocator;
};
// <button>: Defines a clickable button.
export const isButton = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator | null> => {
  let buttonLocator: Locator = page.locator("body"); // Assign a default locator or use another appropriate default

  const button = await page
    .locator(elementIdentifier)
    .locator("button")
    .isVisible();

  if (button) {
    return (buttonLocator = page.locator(elementIdentifier).locator("button"));
  }

  return null;
};
// <label>: Labels form elements.
export const isLabel = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator | null> => {
  let labelLocator: Locator = page.locator("body"); // Assign a default locator or use another appropriate default

  const label = await page
    .locator(elementIdentifier)
    .locator("label")
    .isVisible();

  if (label) {
    return (labelLocator = page.locator(elementIdentifier).locator("label"));
  }

  return null;
};
// <fieldset>: Groups form elements.
export const isFieldset = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const fieldset = await page
    .locator(elementIdentifier)
    .locator("fieldset")
    .isVisible();

  let fieldsetLocator;
  if (fieldset)
    fieldsetLocator = page.locator(elementIdentifier).locator("fieldset");
  return fieldsetLocator;
};
// <legend>: Provides a title for a <fieldset>.
export const isLegend = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const legend = await page
    .locator(elementIdentifier)
    .locator("legend")
    .isVisible();

  let legendLocator;
  if (legend) legendLocator = page.locator(elementIdentifier).locator("legend");
  return legendLocator;
};
//#endregion

//#region - Tables
//<table>: Defines a table.
export const isTable = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const table = await page
    .locator(elementIdentifier)
    .locator("table")
    .isVisible();

  let tableLocator;
  if (table) tableLocator = page.locator(elementIdentifier).locator("table");
  return tableLocator;
};
// <tr>: Defines a table row.
export const isTableRow = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableRow = await page
    .locator(elementIdentifier)
    .locator("tr")
    .isVisible();

  let tableRowLocator;
  if (tableRow) tableRowLocator = page.locator(elementIdentifier).locator("tr");
  return tableRowLocator;
};
// <th>: Defines a table header cell.
export const isTableHeader = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableHead = await page
    .locator(elementIdentifier)
    .locator("th")
    .isVisible();

  let tableHeadLocator;
  if (tableHead)
    tableHeadLocator = page.locator(elementIdentifier).locator("th");
  return tableHeadLocator;
};
// <td>: Defines a table data cell.
export const isTableData = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableData = await page
    .locator(elementIdentifier)
    .locator("td")
    .isVisible();

  let tableDataLocator;
  if (tableData)
    tableDataLocator = page.locator(elementIdentifier).locator("td");
  return tableDataLocator;
};
// <thead>, <tbody>, <tfoot>: Groups table sections.
export const isTableHead = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableHead = await page
    .locator(elementIdentifier)
    .locator("thead")
    .isVisible();

  let tableHeadLocator;
  if (tableHead)
    tableHeadLocator = page.locator(elementIdentifier).locator("thead");
  return tableHeadLocator;
};
// <thead>, <tbody>, <tfoot>: Groups table sections.
export const isTableBody = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableBody = await page
    .locator(elementIdentifier)
    .locator("tbody")
    .isVisible();

  let tableBodyLocator;
  if (tableBody)
    tableBodyLocator = page.locator(elementIdentifier).locator("tbody");
  return tableBodyLocator;
};
// <thead>, <tbody>, <tfoot>: Groups table sections.
export const isTableFoot = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const tableFoot = await page
    .locator(elementIdentifier)
    .locator("tfoot")
    .isVisible();

  let tableFootLocator;
  if (tableFoot)
    tableFootLocator = page.locator(elementIdentifier).locator("tfoot");
  return tableFootLocator;
};
//#endregion

//#region - Divisions and Sections:
// <div>: Generic container for grouping content.
export const isDiv = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const div = await page.locator(elementIdentifier).locator("div").isVisible();

  let divLocator;
  if (div) divLocator = page.locator(elementIdentifier).locator("div");
  return divLocator;
};
// <section>: Defines a section of content.
export const isSection = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const section = await page
    .locator(elementIdentifier)
    .locator("section")
    .isVisible();

  let sectionLocator;
  if (section)
    sectionLocator = page.locator(elementIdentifier).locator("section");
  return sectionLocator;
};
// <header>: Represents the header of a section or page.
export const isHeader = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const header = await page
    .locator(elementIdentifier)
    .locator("header")
    .isVisible();

  let headerLocator;
  if (header) headerLocator = page.locator(elementIdentifier).locator("header");
  return headerLocator;
};
// <footer>: Represents the footer of a section or page.
export const isFooter = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const footer = await page
    .locator(elementIdentifier)
    .locator("footer")
    .isVisible();

  let footerLocator;
  if (footer) footerLocator = page.locator(elementIdentifier).locator("footer");
  return footerLocator;
};
// <nav>: Represents navigation links.
export const isNav = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const nav = await page.locator(elementIdentifier).locator("nav").isVisible();

  let navLocator;
  if (nav) navLocator = page.locator(elementIdentifier).locator("nav");
  return navLocator;
};
// <article>: Represents self-contained content.
export const isArticle = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const article = await page
    .locator(elementIdentifier)
    .locator("article")
    .isVisible();

  let articleLocator;
  if (article)
    articleLocator = page.locator(elementIdentifier).locator("article");
  return articleLocator;
};
//#endregion

//#region - Semantic Elements (HTML5):
// <main>: Represents the main content of the document.
export const isMain = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const main = await page
    .locator(elementIdentifier)
    .locator("main")
    .isVisible();

  let mainLocator;
  if (main) mainLocator = page.locator(elementIdentifier).locator("main");
  return mainLocator;
};
// <aside>: Represents content tangentially related to the content around it.
export const isAside = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const aside = await page
    .locator(elementIdentifier)
    .locator("aside")
    .isVisible();

  let asideLocator;
  if (aside) asideLocator = page.locator(elementIdentifier).locator("aside");
  return asideLocator;
};
// <time>: Represents a specific time or range of time.
export const isTime = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const time = await page
    .locator(elementIdentifier)
    .locator("time")
    .isVisible();

  let timeLocator;
  if (time) timeLocator = page.locator(elementIdentifier).locator("time");
  return timeLocator;
};
// <mark>: Highlights text for reference.
export const isMark = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const mark = await page
    .locator(elementIdentifier)
    .locator("mark")
    .isVisible();

  let markLocator;
  if (mark) markLocator = page.locator(elementIdentifier).locator("mark");
  return markLocator;
};
// <figure>: Represents any content that is referenced from the main content.
export const isFigure = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const figure = await page
    .locator(elementIdentifier)
    .locator("figure")
    .isVisible();

  let figureLocator;
  if (figure) figureLocator = page.locator(elementIdentifier).locator("figure");
  return figureLocator;
};
//#endregion
// The <i> tag in HTML is used to define text as italicized
export const isItalic = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const italic = await page.locator(elementIdentifier).locator("i").isVisible();

  let italicLocator;
  if (italic) italicLocator = page.locator(elementIdentifier).locator("i");
  return italicLocator;
};
//
export const isP = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const p = await page.locator(elementIdentifier).locator("p").isVisible();

  let pLocator;
  if (p) pLocator = page.locator(elementIdentifier).locator("p");
  return pLocator;
};
//  <em> tag for emphasizing text with a semantic meaning.
export const isEm = async (
  page: Page,
  elementIdentifier: string
): Promise<Locator> => {
  const em = await page.locator(elementIdentifier).locator("em").isVisible();

  let emLocator;
  if (em) emLocator = page.locator(elementIdentifier).locator("em");
  return emLocator;
};
