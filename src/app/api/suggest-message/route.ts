import { normalizeError } from "@/lib/ai/normalizeError";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "OPENROUTER_API_KEY not set" }),
        { status: 500 }
      );
    }

const prompt = `Create a list of ten open-ended and engaging messages.
Each message should be a short sentence that can be sent to someone anonymously.
Do NOT just return plain questions; include a friendly message for each.
Separate each message with "||".
Avoid personal or sensitive topics.
Return ONLY the messages in a single string, no commentary.
Example: "Hey, just curious, what's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"`;


    const res = await fetch("https://openrouter.ai/api/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini", // GPT-4.1-mini zyada reliable hai
        prompt,
        max_tokens: 500,
        temperature: 0.8,
        stream: false
      }),
    });

    const data = await res.json();

    // GPT-4.1-mini ke liye text is field me milega
    const text = data?.completion || data?.choices?.[0]?.text?.trim();

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: "AI returned empty response" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, questions: text }),
      { status: 200 }
    );

  } catch (error) {
    const err = normalizeError(error);
    console.error("AI error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: { name: err.name, status: err.status, message: err.message },
      }),
      { status: err.status || 500 }
    );
  }
}