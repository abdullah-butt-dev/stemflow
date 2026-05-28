import { prompts } from "./prompts.js";

import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, level, mode } = req.body;

    // fallback mode
    const selectedMode = mode || "learn";

    const systemPrompt = prompts[selectedMode] || prompts.learn;

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `
Student Level: ${level || "beginner"}

Level Rules:

If level is BEGINNER:
- Use very simple language
- Explain slowly
- Use analogies and simple examples
- Avoid complex jargon
- Focus on intuition first

If level is INTERMEDIATE:
- Use proper STEM terminology
- Include formulas when helpful
- Explain reasoning step-by-step
- Balance simplicity with technical depth

If level is ADVANCED:
- Use technical depth
- Include derivations and deeper theory
- Assume stronger background knowledge
- Focus on analytical understanding

Student Request:
${message}
`,
        },
      ],
    });

    const reply = completion?.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "No response from AI",
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}
