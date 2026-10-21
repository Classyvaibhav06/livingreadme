import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

vi.mock("axios");

const { TokenHarborProvider } = await import("../tokenharbor.provider.js");

function response(content) {
  return { data: { choices: [{ message: { content } }] } };
}

describe("TokenHarborProvider (DeepSeek v4.1 Flash)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test";
    process.env.TOKENHARBOR_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("throws on any call when no API key is set in test environment", async () => {
    delete process.env.TOKENHARBOR_API_KEY;
    const provider = new TokenHarborProvider();
    await expect(provider.generate("prompt")).rejects.toThrow(
      /No API key configured for TokenHarbor/,
    );
  });

  it("returns the completion content on generate()", async () => {
    axios.post.mockResolvedValue(response("# Generated README"));
    const provider = new TokenHarborProvider();
    await expect(provider.generate("prompt")).resolves.toBe(
      "# Generated README",
    );
  });

  it("strips <think> tags from completion content", async () => {
    axios.post.mockResolvedValue(
      response("<think>internal thoughts</think># Clean Output"),
    );
    const provider = new TokenHarborProvider();
    await expect(provider.generate("prompt")).resolves.toBe("# Clean Output");
  });

  it("throws when empty response is returned", async () => {
    axios.post.mockResolvedValue(response(""));
    const provider = new TokenHarborProvider();
    await expect(provider.generate("prompt")).rejects.toThrow(
      /empty generation response/,
    );
  });

  it("parses JSON from detect()", async () => {
    axios.post.mockResolvedValue(
      response('{"mode":"full","reason":"empty readme"}'),
    );
    const provider = new TokenHarborProvider();
    await expect(provider.detect("# existing")).resolves.toEqual({
      mode: "full",
      reason: "empty readme",
    });
  });

  it("calls cleanup() and returns markdown content", async () => {
    axios.post.mockResolvedValue(response("# Cleaned README"));
    const provider = new TokenHarborProvider();
    await expect(provider.cleanup("# raw markdown")).resolves.toBe(
      "# Cleaned README",
    );
  });

  it("returns a prompt context limit that reserves completion tokens", () => {
    const provider = new TokenHarborProvider();
    expect(provider.getContextTokenLimit()).toBe(64_000 - 8_000);
  });
});
