import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

const envName = process.env.NODE_ENV || "localhost";

const envFile = path.resolve(
  process.cwd(),
  "src",
  "main",
  "env",
  `${envName}.env`
);

if (!fs.existsSync(envFile)) {
  throw new Error(`[ENV] Cannot find env file: ${envFile}`);
}

// Do NOT override variables already set (CI secrets win)
dotenv.config({ path: envFile, override: false });

console.log(`[ENV] Loaded ${envName}.env from ${envFile}`);
console.log("[ENV CHECK] ADMIN_USERNAME set?", Boolean(process.env.ADMIN_USERNAME));
