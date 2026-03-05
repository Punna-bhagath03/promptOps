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

      const response = await axios.post<ChatCompletionsResponse>(
        this.apiUrl,
        {
          model,
          messages: [
            {
              role: "user",
              content: sanitizedPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      const text = response.data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        logger.error("LLM API returned an empty response payload.");
        throw new Error("LLM API returned empty response text.");
      }

      logger.debug("LLM response received successfully.");
      return text;
    } catch (error: unknown) {
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
}
