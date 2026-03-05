import axios from "axios";
import { logger } from "../utils/logger";

interface ChatCompletionsResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class LlmService {
  constructor(
    private readonly apiKey: string,
    private readonly apiUrl: string,
    private readonly model: string,
  ) {}

  async sendPrompt(prompt: string, modelOverride?: string): Promise<string> {
    const sanitizedPrompt = prompt.trim();
    const model = modelOverride ?? this.model;
    const timeoutMs = Number(process.env.PROMPTOPS_LLM_TIMEOUT_MS ?? "120000");

    if (!sanitizedPrompt) {
      logger.warn("sendPrompt called with empty prompt.");
      throw new Error("Prompt cannot be empty.");
    }

    if (!this.apiKey) {
      logger.error("Missing LLM API key. Set PROMPTOPS_LLM_API_KEY.");
      throw new Error("LLM API key is not configured.");
    }

    try {
      logger.info(`Sending prompt to LLM API using model ${model}.`);

      const response = await this.postMessages(
        [{ role: "user", content: sanitizedPrompt }],
        model,
        timeoutMs,
      );

      return response;
    } catch (error: unknown) {
      this.handleAxiosError(error);
    }
  }

  async sendWithSystem(
    systemPrompt: string,
    userPrompt: string,
    modelOverride?: string,
  ): Promise<string> {
    const sanitizedUser = userPrompt.trim();
    const sanitizedSystem = systemPrompt.trim();
    const model = modelOverride ?? this.model;
    const timeoutMs = Number(process.env.PROMPTOPS_LLM_TIMEOUT_MS ?? "120000");

    if (!sanitizedUser) {
      logger.warn("sendWithSystem called with empty user prompt.");
      throw new Error("Prompt cannot be empty.");
    }

    if (!this.apiKey) {
      logger.error("Missing LLM API key. Set PROMPTOPS_LLM_API_KEY.");
      throw new Error("LLM API key is not configured.");
    }

    try {
      logger.info(`Sending prompt to LLM API using model ${model}.`);

      return await this.postMessages(
        [
          { role: "system", content: sanitizedSystem },
          { role: "user", content: sanitizedUser },
        ],
        model,
        timeoutMs,
      );
    } catch (error: unknown) {
      this.handleAxiosError(error);
    }
  }

  private async postMessages(
    messages: Array<{ role: string; content: string }>,
    model: string,
    timeoutMs: number,
  ): Promise<string> {
    const response = await axios.post<ChatCompletionsResponse>(
      this.apiUrl,
      { model, messages },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 120000,
      },
    );

    const text = response.data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      logger.error("LLM API returned an empty response payload.");
      throw new Error("LLM API returned empty response text.");
    }

    logger.debug("LLM response received successfully.");
    return text;
  }

  private handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      logger.error(
        `LLM API request failed${status ? ` with status ${status}${statusText ? ` ${statusText}` : ""}` : ""}.`,
      );
      throw new Error("Failed to send prompt to LLM API.");
    }

    logger.error("Unexpected error while sending prompt to LLM API.");
    throw error instanceof Error ? error : new Error("Unexpected LLM service error.");
  }
}
