
import fs from "fs";
import path from "path";
import { maskValueIfSensitive } from "../support/test-data/mask-sensitive";
import { logger } from "../logger";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const worker = process.env.PW_WORKER_INDEX ?? "0";
const logFile = path.join(logDir, `worker-${worker}.log`);

const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB

export function logData(label: string, token: string, value: string) {
  logger.log(
    `[DATA] ${label}="${token}" value="${maskValueIfSensitive(token, value)}"`
  );
}

const rotateIfNeeded = () => {
  if (!fs.existsSync(logFile)) return;

  const { size } = fs.statSync(logFile);
  if (size < MAX_LOG_SIZE) return;

  const rotated = `${logFile}.${Date.now()}`;
  fs.renameSync(logFile, rotated);
};


const MAX_FILES = 5;

const cleanupOldLogs = () => {
  const files = fs.readdirSync(logDir)
    .filter(f => f.startsWith(`worker-${worker}.log.`))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(logDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  files.slice(MAX_FILES).forEach(f =>
    fs.unlinkSync(path.join(logDir, f.name))
  );
};


const writeToFile = (level: string, messages: any[]) => {
  rotateIfNeeded();

  const line =
    `${new Date().toISOString()} [${level.toUpperCase()}] ` +
    messages.map(m => (typeof m === "string" ? m : JSON.stringify(m))).join(" ") +
    "\n";

  fs.appendFileSync(logFile, line);
};

import dotenv from "dotenv";
// Load COMMON config first (your bat sets COMMON_CONFIG_FILE)
dotenv.config({ path: process.env.COMMON_CONFIG_FILE || "settings/settings.env" });

// Then load environment-specific config
const envName = process.env.NODE_ENV || "localhost";
dotenv.config({ path: `./main/env/${envName}.env` });

import { env } from "../env/parseEnv";

const DEBUG = "debug";
const LOG = "log";
const OFF = "off";

const LOG_LEVELS = [DEBUG, LOG, OFF] as const;
export type LogLevel = typeof LOG_LEVELS[number];

type LogFunction = (...msg: any[]) => void;

type Logger = {
  debug: LogFunction;
  log: LogFunction;
};

const logFuncAtLevels =
  (logLevels: LogLevel[], logFunction: Logger = console) =>
  (logLevel: LogLevel, ...msg: any[]) => {
    if (
      logLevel !== OFF &&
      logLevels.indexOf(logLevel) !== -1 &&
      msg.length > 0
    ) {
      // existing console logging
      logFunction[logLevel](...msg);

      // NEW: file logging
      writeToFile(logLevel, msg);
    }
  };

const getLogLevel = (logLevel: LogLevel): LogLevel[] => {
  const dynamicLogLevelIndex = LOG_LEVELS.indexOf(logLevel);
  return LOG_LEVELS.slice(dynamicLogLevelIndex);
};

const createLogger = (logLevel: LogLevel): Logger => {
  const activeLogLevels = getLogLevel(logLevel);
  const logger = logFuncAtLevels(activeLogLevels);

  return LOG_LEVELS.reduce(
    (accumulator: Record<string, LogFunction>, level: LogLevel) => ({
      ...accumulator,
      [level]: (...msg: any[]) => logger(level, ...msg),
    }),
    {}
  ) as Logger;
};

const logLevelIsT = <T extends string>(
  logLevel: string,
  options: readonly string[]
): logLevel is T => {
  return options.includes(logLevel);
};

export const stringIsOfOptions = <T extends string>(
  logLevel: string,
  options: readonly string[]
): T => {
  if (logLevelIsT(logLevel, options)) {
    return logLevel as T;
  }
  throw Error(`🧨 Logger '${logLevel}' needs to be one of ${options} 🧨`);
  
};



let loggerSingleton: Logger | null = null;
export const getLogger = (): Logger => {
  if (!loggerSingleton) {
    const logLevel = env("LOG_LEVEL");
    const validLogLevel = stringIsOfOptions<LogLevel>(logLevel, LOG_LEVELS);
    loggerSingleton = createLogger(validLogLevel);
  }
  return loggerSingleton;
};
