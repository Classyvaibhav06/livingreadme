import axios from "axios";
import { buildDetectPrompt } from "../prompts/detect.prompt.js";
import { buildCleanupPrompt } from "../prompts/cleanup.prompt.js";
import { extractJson } from "../utils/response.js";
import { providerLog } from "../../utils/logger.js";

const log = providerLog("DeepSeek");

// Radox AI endpoint for DeepSeek chat completions
const DEFAULT_BASE_URL = "https://radoxai.com/v1";
const DEFAULT_MODEL = "deepseek-v4-flash-0731";

// DeepSeek's context window is 64K+ tokens for prompt + completion combined.
// Reserve headroom for the generated README and let the rest go to the prompt.
const CONTEXT_WINDOW_TOKENS = 64_000;
const COMPLETION_RESERVE_TOKENS = 8_000;
const PROMPT_TOKEN_BUDGET = CONTEXT_WINDOW_TOKENS - COMPLETION_RESERVE_TOKENS;

// Rough chars-per-token, matching the estimate the pipelines use elsewhere.
const MAX_PROMPT_CHARS = PROMPT_TOKEN_BUDGET * 4;

function clampReadme(existingReadme) {
  const text = (existingReadme || "").trim();
  if (text.length <= MAX_PROMPT_CHARS) return text;

  log.warn("Existing README exceeds context window — clamping", {
    chars: text.length,
    limit: MAX_PROMPT_CHARS,
  });
  return `${text.slice(0, MAX_PROMPT_CHARS)}\n\n... (truncated to fit context window)`;
}

function describe(error) {
  const status = error?.response?.status ?? error?.statusCode ?? error?.status;
  const data = error?.response?.data;
  const body =
    typeof data === "string"
      ? data.slice(0, 200)
      : data
        ? JSON.stringify(data).slice(0, 200)
        : null;

  const prefix = status ? `HTTP ${status}` : "network error";
  return body ? `${prefix} — ${body}` : `${prefix} — ${error?.message}`;
}

export class SarvamProvider {
  constructor(options = {}) {
    this.name = "DeepSeek";
    this.apiKey =
      options.apiKey ??
      process.env.RADOX_API_KEY?.trim() ??
      process.env.SARVAM_API_KEY?.trim();
    this.baseUrl =
      options.baseUrl ?? process.env.RADOX_BASE_URL?.trim() ?? DEFAULT_BASE_URL;
    this.model =
      options.model ?? process.env.RADOX_MODEL?.trim() ?? DEFAULT_MODEL;
  }

  getName() {
    return this.name;
  }

  getContextTokenLimit() {
    return PROMPT_TOKEN_BUDGET;
  }

  async #call(label, prompt, { temperature = 0.2 } = {}) {
    if (!this.apiKey) {
      throw new Error(
        "No API key configured for fallback provider — set RADOX_API_KEY or SARVAM_API_KEY.",
      );
    }

    const startedAt = Date.now();

    let response;
    try {
      response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 90_000,
        },
      );
    } catch (error) {
      log.error(`${label} call failed`, {
        model: this.model,
        detail: describe(error),
      });
      throw error;
    }

    const rawContent = response?.data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error(`${this.name} returned an empty ${label} response`);
    }

    // Strip reasoning <think>...</think> tags if emitted by DeepSeek
    const content = rawContent
      .replace(/<think>[\s\S]*?<\/think>\s*/gi, "")
      .trim();

    log.info(`${label} call completed`, {
      model: this.model,
      durationMs: Date.now() - startedAt,
    });

    return content;
  }

  async generate(prompt) {
    return this.#call("generation", prompt, { temperature: 0.2 });
  }

  async detect(existingReadme) {
    const content = await this.#call(
      "detection",
      buildDetectPrompt(clampReadme(existingReadme)),
      { temperature: 0.1 },
    );

    return extractJson(content);
  }

  async cleanup(existingReadme) {
    return this.#call(
      "cleanup",
      buildCleanupPrompt(clampReadme(existingReadme)),
      { temperature: 0.1 },
    );
  }
}

export { SarvamProvider as RadoxProvider };
