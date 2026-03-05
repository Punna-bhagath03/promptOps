import { Command } from "commander";
import type { CommandContext } from "./types";

interface AnalyzeOptions {
  json?: boolean;
}

export function registerAnalyzeCommand(program: Command, context: CommandContext): void {
  program
    .command("analyze")
    .description("Analyze prompt quality metrics")
    .argument("<prompt>", "Prompt text to analyze")
    .option("--json", "Print analysis as JSON")
    .action(async (prompt: string, options: AnalyzeOptions) => {
      const result = await context.services.analyze.analyze({ prompt });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      console.log(`Characters: ${result.charCount}`);
      console.log(`Words: ${result.wordCount}`);
      console.log(`Sentences: ${result.sentenceCount}`);
      console.log(`Estimated tokens: ${result.tokenEstimate}`);
      console.log(`Lexical diversity: ${result.lexicalDiversity}`);
    });
}
