import { Command } from "commander";
import readline from "node:readline";
import type { CommandContext } from "./types";

function printSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

function waitForEnter(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("\nPress ENTER to execute the optimized prompt...", () => {
      rl.close();
      resolve();
    });
  });
}

export function registerRunCommand(program: Command, context: CommandContext): void {
  program
    .command("run")
    .description("Run the full prompt workflow: analyze, optimize, then execute")
    .argument("<prompt>", "Prompt text to process")
    .action(async (prompt: string) => {
      printSection("Original Prompt");
      console.log(prompt);

      const analysis = await context.services.analyze.analyze({ prompt });

      printSection("Analysis");
      console.log(`Words: ${analysis.wordCount}`);
      console.log(`Sentences: ${analysis.sentenceCount}`);
      console.log(`Token estimate: ${analysis.tokenEstimate}`);

      const optimization = await context.services.optimize.optimize({ prompt });

      printSection("Optimized Prompt");
      console.log(optimization.optimizedPrompt);

      await waitForEnter();

      const execution = await context.services.execute.execute({
        prompt: optimization.optimizedPrompt,
        model: context.config.defaultModel,
        dryRun: false,
      });

      printSection("Response");
      console.log(execution.output);
    });
}