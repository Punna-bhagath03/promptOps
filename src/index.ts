#!/usr/bin/env node

import { Command } from "commander";
import { createContainer } from "./config/container";
import { registerCommands } from "./commands";

async function bootstrap(): Promise<void> {
  const container = createContainer();
  const program = new Command();

  program
    .name("promptops")
    .description("PromptOps CLI for optimizing, analyzing, and executing prompts")
    .version("1.0.0");

  registerCommands(program, {
    services: container.services,
    config: container.config,
  });

  await program.parseAsync(process.argv);
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unexpected CLI error";
  console.error(`[promptops] ${message}`);
  process.exit(1);
});
