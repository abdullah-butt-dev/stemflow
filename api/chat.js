import { prompts } from "./prompts.js";
import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { message, lesson, mode = "learn" } = req.body;

    const systemPrompt =
      prompts[mode] || prompts.learn;

    const completion =
      await client.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324",

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

    const raw =
      completion?.choices?.[0]?.message?.content;

    // Quiz & Exam return JSON later
    if (mode === "quiz" || mode === "exam") {
      try {
        const parsed = JSON.parse(raw);

        return res.status(200).json({
          reply: parsed,
        });
      } catch (err) {
        console.error("JSON Parse Error:", err);

        return res.status(500).json({
          error: "Invalid AI JSON response",
        });
      }
    }

    return res.status(200).json({
      reply: raw || "No response from AI",
    });

  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}