type LogLevel = "debug" | "info" | "warn" | "error";

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[currentLevel];
}

export const logger = {
  debug(message: string): void {
    if (shouldLog("debug")) {
      console.debug(`[debug] ${message}`);
    }
  },
  info(message: string): void {
    if (shouldLog("info")) {
      console.info(`[info] ${message}`);
    }
  },
  warn(message: string): void {
    if (shouldLog("warn")) {
      console.warn(`[warn] ${message}`);
    }
  },
  error(message: string): void {
    if (shouldLog("error")) {
      console.error(`[error] ${message}`);
    }
  },
};
