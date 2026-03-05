import { loadConfig } from "./env";
import { AnalyzeService } from "../services/analyze.service";
import { ExecuteService } from "../services/execute.service";
import { LlmService } from "../services/llmService";
import { OptimizeService } from "../services/optimize.service";

export interface ServiceContainer {
  optimize: OptimizeService;
  analyze: AnalyzeService;
  execute: ExecuteService;
}

export interface AppContainer {
  config: ReturnType<typeof loadConfig>;
  services: ServiceContainer;
}

export function createContainer(): AppContainer {
  const config = loadConfig();
  const llmService = new LlmService(config.llmApiKey, config.llmApiUrl, config.defaultModel);

  return {
    config,
    services: {
      optimize: new OptimizeService(llmService),
      analyze: new AnalyzeService(),
      execute: new ExecuteService(llmService),
    },
  };
}
