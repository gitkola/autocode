import axios from "axios";

interface AIServiceSettings {
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  anthropic: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
}

export const getAIResponse = async (
  message: string,
  settings: AIServiceSettings,
  activeService: "openai" | "anthropic",
): Promise<string> => {
  if (activeService === "openai") {
    const { apiKey, model, temperature } = settings.openai;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: model,
          messages: [{ role: "user", content: message }],
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  } else if (activeService === "anthropic") {
    const { apiKey, model, maxTokens } = settings.anthropic;
    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/completions",
        {
          model: model,
          prompt: message,
          max_tokens_to_sample: maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.completion;
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  } else {
    throw new Error("Invalid AI service selected");
  }
};
