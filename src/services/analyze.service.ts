import { countSentences, estimateTokenCount, lexicalDiversity, normalizeWhitespace } from "../utils/text";
import type { AnalyzeInput, AnalyzeResult } from "./types";

export class AnalyzeService {
  async analyze(input: AnalyzeInput): Promise<AnalyzeResult> {
    const prompt = normalizeWhitespace(input.prompt);
    const words = prompt.split(/\s+/).filter(Boolean);

    return {
      charCount: prompt.length,
      wordCount: words.length,
      sentenceCount: countSentences(prompt),
      tokenEstimate: estimateTokenCount(prompt),
      lexicalDiversity: lexicalDiversity(prompt),
    };
  }
}
