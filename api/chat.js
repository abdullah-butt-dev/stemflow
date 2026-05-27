import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({
          error: "Method not allowed",
        });
    }

    const { message } = req.body;

    const completion =
      await client.chat.completions.create({
        model:
          "deepseek/deepseek-chat-v3-0324",

        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

    res.status(200).json({
      reply:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI request failed",
    });
  }
}