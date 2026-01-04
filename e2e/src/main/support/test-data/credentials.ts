import * as fs from "fs";
import * as path from "path";

type AnyObj = Record<string, any>;

let cache: AnyObj = {};
let loaded = false;

function loadCredentialsFile(): AnyObj {
  if (loaded) return cache;

const filePath = path.resolve(
  process.cwd(),
  "src",
  "tests",
  "config",
  "auth",
  "credentials.json"
);
  if (!fs.existsSync(filePath)) {
    throw new Error(`credentials.json not found at: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw) as AnyObj;
  loaded = true;

  return cache;
}

export function getCredentialByPath(pathKey: string): string {
  const data = loadCredentialsFile();

  const parts = pathKey.split(".").map(p => p.trim()).filter(Boolean);
  let current: any = data;

  for (const part of parts) {
    if (current == null || !(part in current)) {
      throw new Error(
        `Credential path not found: "${pathKey}". Missing part: "${part}"`
      );
    }
    current = current[part];
  }

  if (typeof current !== "string") {
    throw new Error(
      `Credential path "${pathKey}" did not resolve to a string (got ${typeof current})`
    );
  }

  return current;
}
