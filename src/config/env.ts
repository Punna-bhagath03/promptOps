import { config as loadDotenv } from "dotenv";

loadDotenv({ quiet: true });

export interface AppConfig {
  defaultModel: string;
  logLevel: "debug" | "info" | "warn" | "error";
  llmApiKey: string;
  llmApiUrl: string;
}

export function loadConfig(): AppConfig {
  return {
    defaultModel: process.env.PROMPTOPS_DEFAULT_MODEL ?? "gpt-4.1-mini",
    logLevel: parseLogLevel(process.env.PROMPTOPS_LOG_LEVEL),
    llmApiKey: process.env.PROMPTOPS_LLM_API_KEY ?? "",
    llmApiUrl: process.env.PROMPTOPS_LLM_API_URL ?? "https://api.openai.com/v1/chat/completions",
  };
}

function parseLogLevel(value: string | undefined): AppConfig["logLevel"] {
  if (value === "debug" || value === "info" || value === "warn" || value === "error") {
    return value;
  }

  return "info";
}
