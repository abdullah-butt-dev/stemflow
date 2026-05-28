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

    const { message, lesson, mode } = req.body;

    // fallback mode
    // const selectedMode = mode || "learn";

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",

      messages: [
        {
          role: "system",
          content:
            mode === "quiz"
              ? `
You are a strict quiz generator for STEM education.

Rules:
- Generate ONLY questions (no explanations first)
- Mix MCQs + short answers
- Base everything strictly on provided lesson
- Keep difficulty appropriate to student's level
- After quiz, say: "Submit your answers when ready"
`
              : mode === "exam"
                ? `
You are an exam generator for STEM education.

Rules:
- Create a structured exam (10–15 questions)
- Mix easy, medium, hard questions
- Include MCQs, short answers, and one or two long questions
- Do NOT provide answers yet
- End with: "Submit your answers for grading"
`
                : `
You are a world-class STEM tutor.

Rules:
- Explain clearly and structured
- Adapt to student level naturally (beginner/intermediate/advanced)
- Use markdown formatting
- Avoid childish tone
- Be academically respectful and engaging
`,
        },
        {
          role: "user",
          content: lesson || message,
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
