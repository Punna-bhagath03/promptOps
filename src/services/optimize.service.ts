import { normalizeWhitespace } from "../utils/text";
import type { OptimizeInput, OptimizeResult } from "./types";
import { LlmService } from "./llmService";

export class OptimizeService {
  constructor(private readonly llmService: LlmService) {}

  async optimize(input: OptimizeInput): Promise<OptimizeResult> {
    const cleanPrompt = normalizeWhitespace(input.prompt);
    const optimizationPrompt = [
      "Rewrite this prompt to make it more detailed and clear for an AI system.",
      "Return only the optimized prompt text.",
      `Original prompt: ${cleanPrompt}`,
    ].join("\n\n");

    const optimizedPrompt = await this.llmService.sendPrompt(optimizationPrompt);

    return {
      optimizedPrompt,
    };
  }
}
