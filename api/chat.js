import { prompts } from "./prompts.js";
import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function handler(req, res) {
  try {
    // Method check
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { message, lesson, mode = "learn" } = req.body;

    // Select prompt
    const systemPrompt = prompts[mode] || prompts.learn;

    // Call model
    const completion = await client.chat.completions.create({
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

    const raw = completion?.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        error: "Empty response from model",
      });
    }

    // Default reply
    let reply = raw;

    // Parse JSON for quiz/exam modes
    if (mode === "quiz" || mode === "exam") {
      try {
        reply = JSON.parse(raw);
      } catch (err) {
        console.error("JSON Parse Error:", err);

        reply = {
          title: "Failed to generate quiz/exam",
          questions: [],
        };
      }
    }

    return res.status(200).json({
      reply,
    });

  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}