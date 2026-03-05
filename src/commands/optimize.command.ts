import { Command } from "commander";
import type { CommandContext } from "./types";

export function registerOptimizeCommand(program: Command, context: CommandContext): void {
  program
    .command("optimize")
    .description("Rewrite a prompt to be clearer and more structured")
    .argument("<prompt>", "Prompt text to optimize")
    .action(async (prompt: string) => {
      const result = await context.services.optimize.optimize({ prompt });

      console.log(result.optimizedPrompt);
    });
}
