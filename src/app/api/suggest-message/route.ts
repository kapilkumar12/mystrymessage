import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { normalizeError } from "@/lib/ai/normalizeError";

export const runtime = "edge";

export async function POST() {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by "||".

Rules:
- Anonymous social messaging platform
- Suitable for diverse audience
- No personal or sensitive topics
- Friendly and curiosity-driven
- Positive tone

Example:
"What’s a hobby you’ve recently started? || If you could have dinner with any historical figure, who would it be? || What’s a simple thing that makes you happy?"
`;

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const err = normalizeError(error);

    console.error("AI error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          name: err.name,
          status: err.status,
          message: err.message,
        },
      }),
      { status: err.status }
    );
  }
}