import type { AppConfig } from "../config/env";
import type { ServiceContainer } from "../config/container";

export interface CommandContext {
  services: ServiceContainer;
  config: AppConfig;
}
