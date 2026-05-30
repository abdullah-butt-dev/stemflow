import { prompts } from "./prompts.js";
import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// helper: extract JSON safely
function extractJSON(text) {
  try {
    // remove ```json blocks if present
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // try direct parse first
    return JSON.parse(cleaned);
  } catch (e) {
    // fallback: extract first JSON object from text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, lesson, mode = "learn" } = req.body;

    const systemPrompt = prompts[mode] || prompts.learn;

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",
      temperature: 0.7,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: lesson || message,
        },
      ],
    });

    const raw = completion?.choices?.[0]?.message?.content;

    // default response
    let reply = raw;

    // ONLY parse for quiz/exam
    if (mode === "quiz" || mode === "exam") {
      const parsed = extractJSON(raw);

      if (!parsed) {
        return res.status(200).json({
          reply: {
            title: "Generation failed",
            questions: [],
            error: true,
          },
        });
      }

      return res.status(200).json({
        reply: parsed,
      });
    }

    // normal learn mode
    return res.status(200).json({
      reply,
    });

  } catch (err) {
    console.error("AI Error:", err);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}