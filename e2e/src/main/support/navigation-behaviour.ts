import { Page } from "playwright";
import { GlobalConfig, PageId } from "../env/global";

export const navigateToPage = async (
  page: Page,
  pageId: PageId,
  { pagesConfig, hostConfig }: GlobalConfig
): Promise<void> => {
  // Determine the environment based on NODE_ENV or default to 'localhost'
  const env = process.env.NODE_ENV || "localhost";

  console.log(`currently processing ${env} environment`);

  // Retrieve the host path based on the environment from the hostConfig
  console.log("DEBUG hostConfig =", hostConfig);
  console.log("DEBUG env =", env)

  const hostPath = hostConfig[env];

  console.log(`currently processing hostPath: ${hostPath}`);

  // Ensure that hostPath is defined before proceeding
  if (!hostPath) {
    throw new Error(`No valid hostPath found for env=${env}`);
  }

  // Retrieving the page configuration based on the pageId from the pagesConfig
  const pageConfigItem = pagesConfig[pageId];

  if (!pageConfigItem) {
    throw new Error(`No valid configuration found for pageId=${pageId}`);
  }

  // Creating a new URL object with the full URL
  const url = new URL(pageConfigItem.route, hostPath);

  // Navigating the provided page to the constructed URL
  await page.goto(url.href);
};

const pathMatchesPageId = (
  path: string,
  pageId: PageId,
  { pagesConfig }: GlobalConfig
): boolean => {
  const pageRegexString = pagesConfig[pageId].regex;
  const pageRegex = new RegExp(pageRegexString);
  return pageRegex.test(path);
};

export const currentPathMatchesPageId = (
  page: Page,
  pageId: PageId,
  globalConfig: GlobalConfig
): boolean => {
  const { pathname: currentPath } = new URL(page.url());
  return pathMatchesPageId(currentPath, pageId, globalConfig);
};

export const extractPageIdFromPath = (
  path: string,
  globalConfig: GlobalConfig
): PageId => {
  const { pagesConfig } = globalConfig;

  // Remove trailing slashes and leading slash if present
  path = path.replace(/^\/+|\/+$/g, "");

  // Iterate through the pagesConfig to find a matching route
  for (const pageId in pagesConfig) {
    const route = pagesConfig[pageId].route;

    // Remove trailing slashes and leading slash if present from the route
    const normalizedRoute = route.replace(/^\/+|\/+$/g, "");

    // Split both path and route into segments
    const pathSegments = path.split("/");
    const routeSegments = normalizedRoute.split("/");

    // Check if the path segments match the route segments
    if (pathSegments.length === routeSegments.length) {
      let isMatch = true;
      for (let i = 0; i < pathSegments.length; i++) {
        if (routeSegments[i] !== pathSegments[i]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return pageId;
      }
    }
  }

  // If no match is found, you can return a default value or handle it as needed.
  return "";
};

export const getCurrentPageId = async (
  page: Page,
  globalConfig: GlobalConfig
): Promise<PageId> => {
  const { pagesConfig } = globalConfig;

  const pageConfigPageIds = Object.keys(pagesConfig);

  const currentUrl = await page.url(); // ✅ await it
  const { pathname: currentPath } = new URL(currentUrl); // parse after await

  const currentPageId = pageConfigPageIds.find((pageId) =>
    pathMatchesPageId(currentPath, pageId, globalConfig)
  );

  if (!currentPageId) {
    throw Error(
      `Failed to get page name from current route ${currentPath}, \
        possible pages: ${JSON.stringify(pagesConfig)}`
    );
  }

  return currentPageId;
};

export const reloadPage = async (page: Page): Promise<void> => {
  await page.reload();
};
