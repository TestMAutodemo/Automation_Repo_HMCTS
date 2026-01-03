import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load env file once when this module is imported
const envName = process.env.NODE_ENV || "localhost";
const envFile = path.resolve(process.cwd(), "src", "main", "env", `${envName}.env`);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: false });
} else {
  // Don't crash CI if secrets are injected; only warn
  console.warn(`[ENV] Env file not found (ok in CI if using secrets): ${envFile}`);
}

export const getJsonFromFile = <T = Record<string, string>>(p: string): T => {
  return require(`${process.cwd()}${p}`);
};

export const getJsonFromRecursiveFiles = <T = Record<string, string>>(p: string): T => {
  const data = fs.readFileSync(p, "utf8");
  return JSON.parse(data);
};


/**
 * Read an environment variable.
 * - If defaultValue is provided, returns defaultValue when missing.
 * - If defaultValue is not provided, throws when missing.
 */
export const env = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`No environment variable found for ${key}`);
  }
  return value;
};

export const envNumber = (key: string, defaultValue?: number): number => {
  const val = env(key, defaultValue !== undefined ? String(defaultValue) : undefined);
  const num = Number(val);
  if (Number.isNaN(num)) throw new Error(`Environment variable ${key} is not a valid number: '${val}'`);
  return num;
};
