export async function enhanceResponse(
  userInput: string,
  context?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    // Return original input if API key is not configured
    return userInput;
  }

  try {
    const prompt = context
      ? `You are helping an EMS clinician improve their documentation. Clean up and improve this response while keeping all important medical details: "${userInput}". Context: ${context}. Return only the improved text, no explanations.`
      : `Clean up and improve this EMS report response while keeping all important medical details: "${userInput}". Return only the improved text, no explanations.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical documentation assistant. Improve clarity and professionalism while preserving all medical details.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || userInput;
  } catch (error) {
    console.error("AI enhancement error:", error);
    // Return original input on error
    return userInput;
  }
}

export function isAIAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;
}

