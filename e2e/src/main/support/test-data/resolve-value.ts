import { getCredentialByPath } from "./credentials";
import { generateValue } from "./generators";
import { env } from "../../env/parseEnv";

/**
 * Supports:
 *  - cred:myAdmin.valid.username
 *  - cred:myAdmin.invalid.password
 *  - gen:fake.email
 *  - literal:hello
 *  - (no prefix) treated as literal
 */


export async function resolveTestValue(token: string): Promise<string> {
  const trimmed = token.trim();

  if (trimmed.startsWith("env:")) {
    const key = trimmed.replace("env:", "").trim();
    return env(key); // ✅ uses your existing helper
  }

  if (trimmed.startsWith("cred:")) {
    return getCredentialByPath(trimmed.replace("cred:", "").trim());
  }

  if (trimmed.startsWith("gen:")) {
    return generateValue(trimmed.replace("gen:", "").trim());
  }

  if (trimmed.startsWith("literal:")) {
    return trimmed.replace("literal:", "");
  }

  return trimmed;
}


