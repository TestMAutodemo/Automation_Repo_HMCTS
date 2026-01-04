import { logger } from "../../logger";
import { maskValueIfSensitive } from "./mask-sensitive";

export function logData(
  action: string,
  token: string,
  value: string,
  meta?: Record<string, unknown>
) {
  const masked = maskValueIfSensitive(token, value);
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";

  logger.log(
    `[DATA] action="${action}" token="${token}" value="${masked}"${metaStr}`
  );
}