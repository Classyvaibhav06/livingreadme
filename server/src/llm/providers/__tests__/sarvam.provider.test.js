import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

vi.mock("axios");

const { SarvamProvider, RadoxProvider } = await import("../sarvam.provider.js");

function response(content) {
  return { data: { choices: [{ message: { content } }] } };
}

describe("SarvamProvider (Radox DeepSeek)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test";
    process.env.RADOX_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("throws on any call when no API key is set in test environment", async () => {
    delete process.env.RADOX_API_KEY;
    delete process.env.SARVAM_API_KEY;
    const provider = new SarvamProvider();
    await expect(provider.generate("prompt")).rejects.toThrow(
      /No API key configured/,
    );
  });

  it("returns the completion content on generate()", async () => {
    axios.post.mockResolvedValue(response("# README body"));
    const provider = new SarvamProvider();
    await expect(provider.generate("prompt")).resolves.toBe("# README body");
  });

  it("strips <think> tags from completion content", async () => {
    axios.post.mockResolvedValue(
      response("<think>reasoning steps</think># Clean README"),
    );
    const provider = new SarvamProvider();
    await expect(provider.generate("prompt")).resolves.toBe("# Clean README");
  });

  it("throws when empty response is returned", async () => {
    axios.post.mockResolvedValue(response(""));
    const provider = new SarvamProvider();
    await expect(provider.generate("prompt")).rejects.toThrow(
      /empty generation response/,
    );
  });

  it("parses JSON from detect()", async () => {
    axios.post.mockResolvedValue(response('{"mode":"patch","reason":"ok"}'));
    const provider = new SarvamProvider();
    await expect(provider.detect("# existing")).resolves.toEqual({
      mode: "patch",
      reason: "ok",
    });
  });

  it("clamps an oversized existing README before building the detect prompt", async () => {
    axios.post.mockResolvedValue(response('{"mode":"full","reason":"x"}'));
    const provider = new SarvamProvider();

    const huge = "x".repeat(300_000);
    await provider.detect(huge);

    const callArgs = axios.post.mock.calls[0];
    const messages = callArgs[1].messages;
    expect(messages[0].content).toContain("truncated to fit context window");
    expect(messages[0].content.length).toBeLessThan(huge.length);
  });

  it("reports the prompt token budget minus completion reserve", () => {
    const provider = new SarvamProvider();
    expect(provider.getContextTokenLimit()).toBe(64_000 - 8_000);
  });

  it("propagates the underlying client error", async () => {
    const error = new Error("network down");
    error.response = { status: 503, data: "Service Unavailable" };
    axios.post.mockRejectedValue(error);
    const provider = new SarvamProvider();
    await expect(provider.generate("prompt")).rejects.toThrow("network down");
  });

  it("exports RadoxProvider as alias", () => {
    expect(RadoxProvider).toBe(SarvamProvider);
  });
});
