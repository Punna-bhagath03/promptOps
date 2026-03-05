import { normalizeWhitespace } from "../utils/text";
import { logger } from "../utils/logger";
import type { OptimizeInput, OptimizeResult } from "./types";
import { LlmService } from "./llmService";

const OPTIMIZER_SYSTEM_PROMPT = `
You are a prompt optimization engine. Your sole job is to rewrite user prompts to be clearer, more structured, and more detailed for use with an AI assistant.

Strict rules:
- Output ONLY the rewritten prompt. Nothing else.
- Do NOT ask the user for more information or clarification.
- Do NOT use phrases like "please provide", "could you clarify", "provide more context", or any similar phrase.
- Do NOT refuse or decline the task under any circumstances.
- Do NOT add any introduction, explanation, label, or commentary such as "Here is the rewritten prompt:" or "Optimized prompt:".
- Do NOT wrap the output in quotes.
- Preserve the original intent of the prompt exactly.
- Expand short or vague prompts into clear, structured instructions.
- If the prompt is already detailed, improve its structure and clarity.
`.trim();

const BOILERPLATE_PREFIXES = [
  /^here\s+is\s+(a\s+)?(the\s+)?(rewritten|optimized|improved|revised|updated)\s+prompt[:\s]*/i,
  /^optimized\s+prompt[:\s]*/i,
  /^rewritten\s+prompt[:\s]*/i,
  /^prompt[:\s]*/i,
  /^sure[,!.\s]+/i,
  /^certainly[,!.\s]+/i,
  /^of\s+course[,!.\s]+/i,
];

function cleanOptimizerOutput(raw: string): string {
  let cleaned = raw.trim();

  for (const pattern of BOILERPLATE_PREFIXES) {
    cleaned = cleaned.replace(pattern, "").trim();
  }

  // Strip surrounding quotes added by the model
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  return cleaned;
}

function isValidOptimizedPrompt(text: string, originalPrompt: string): boolean {
  if (text.length < 10) return false;

  // Reject if the model is asking for more information instead of rewriting
  const refusalPatterns = [
    /please\s+provide/i,
    /provide\s+(the\s+)?(original|more|additional)/i,
    /could\s+you\s+(please\s+)?(provide|share|give)/i,
    /more\s+context/i,
    /need\s+more\s+information/i,
    /i\s+need\s+you\s+to\s+provide/i,
    /don't\s+have\s+(enough|any)\s+(information|context)/i,
  ];

  return !refusalPatterns.some((pattern) => pattern.test(text));
}

export class OptimizeService {
  constructor(private readonly llmService: LlmService) {}

  async optimize(input: OptimizeInput): Promise<OptimizeResult> {
    const cleanPrompt = normalizeWhitespace(input.prompt);

    try {
      const raw = await this.llmService.sendWithSystem(
        OPTIMIZER_SYSTEM_PROMPT,
        cleanPrompt,
      );

      const optimizedPrompt = cleanOptimizerOutput(raw);

      if (!isValidOptimizedPrompt(optimizedPrompt, cleanPrompt)) {
        logger.warn("Optimizer returned an invalid response. Falling back to original prompt.");
        return { optimizedPrompt: cleanPrompt };
      }

      return { optimizedPrompt };
    } catch (error: unknown) {
      logger.warn("Optimizer failed. Falling back to original prompt.");
      return { optimizedPrompt: cleanPrompt };
    }
  }
}
