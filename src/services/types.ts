export interface OptimizeInput {
  prompt: string;
}

export interface OptimizeResult {
  optimizedPrompt: string;
}

export interface AnalyzeInput {
  prompt: string;
}

export interface AnalyzeResult {
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  tokenEstimate: number;
  lexicalDiversity: number;
}

export interface ExecuteInput {
  prompt: string;
  model: string;
  dryRun: boolean;
}

export interface ExecuteResult {
  model: string;
  dryRun: boolean;
  output: string;
}
