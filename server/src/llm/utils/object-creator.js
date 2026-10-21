const geminiConfig = {
  detectionModel: "gemini-3.5-flash-lite",
  generationModel: "gemini-3.6-flash",
  cleanupModel: "gemini-3.6-flash",
};

export const createProvidersInstances = (
  providerPriority,
  GeminiProvider,
  SarvamProvider,
  TokenHarborProvider,
) => {
  const useTokenHarborAsMain =
    TokenHarborProvider &&
    (Boolean(process.env.TOKENHARBOR_API_KEY) ||
      process.env.USE_TOKENHARBOR_AS_MAIN === "true");

  if (!providerPriority) {
    const primary = useTokenHarborAsMain
      ? new TokenHarborProvider()
      : new GeminiProvider(geminiConfig);
    return [primary, new SarvamProvider()];
  }

  return providerPriority.map((provider) => {
    switch (provider) {
      case "tokenharbor":
        return TokenHarborProvider
          ? new TokenHarborProvider()
          : new SarvamProvider();

      case "gemini":
        if (useTokenHarborAsMain) {
          return new TokenHarborProvider();
        }
        return new GeminiProvider(geminiConfig);

      case "sarvam":
      case "radox":
      case "deepseek":
        return new SarvamProvider();

      default:
        throw new Error(`Provider ${provider} is not supported`);
    }
  });
};
