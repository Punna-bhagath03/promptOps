import { normalizeWhitespace } from "../utils/text";
import type { ExecuteInput, ExecuteResult } from "./types";
import { LlmService } from "./llmService";

export class ExecuteService {
  constructor(private readonly llmService: LlmService) {}

  async execute(input: ExecuteInput): Promise<ExecuteResult> {
    const prompt = normalizeWhitespace(input.prompt);

    if (input.dryRun) {
      return {
        model: input.model,
        dryRun: true,
        output: `Dry run complete. Prompt would be sent to ${input.model}: \"${prompt}\"`,
      };
    }

    const output = await this.llmService.sendPrompt(prompt, input.model);

    return {
      model: input.model,
      dryRun: false,
      output,
    };
  }
}
