import { Command } from "commander";
import type { CommandContext } from "./types";

interface ExecuteOptions {
  model?: string;
  dryRun?: boolean;
}

export function registerExecuteCommand(program: Command, context: CommandContext): void {
  program
    .command("execute")
    .description("Execute a prompt against the configured model")
    .argument("<prompt>", "Prompt text to execute")
    .option("-m, --model <model>", "Model to use")
    .option("--dry-run", "Print execution plan without running")
    .action(async (prompt: string, options: ExecuteOptions) => {
      const result = await context.services.execute.execute({
        prompt,
        model: options.model ?? context.config.defaultModel,
        dryRun: Boolean(options.dryRun),
      });

      console.log(result.output);
    });
}
