export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function countSentences(value: string): number {
  const matches = value.match(/[.!?]+/g);
  return matches?.length ?? 1;
}

export function estimateTokenCount(value: string): number {
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words * 1.33);
}

export function lexicalDiversity(value: string): number {
  const words = value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9']/g, ""))
    .filter(Boolean);

  if (words.length === 0) {
    return 0;
  }

  const unique = new Set(words);
  return Number((unique.size / words.length).toFixed(2));
}
