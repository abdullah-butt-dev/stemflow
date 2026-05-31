import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export default async function handler(req, res) {
  try {
    const { assessment, answers } = req.body;

    const completion =
      await client.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324",

        messages: [
          {
            role: "system",
            content: `
You are an expert STEM examiner.

Grade the student's answers.

Return ONLY valid JSON.

Format:

{
  "score":"4/5",
  "feedback":[
    {
      "question":"...",
      "result":"correct",
      "explanation":"..."
    }
  ]
}
`,
          },
          {
            role: "user",
            content: `
ASSESSMENT:
${JSON.stringify(assessment)}

STUDENT ANSWERS:
${JSON.stringify(answers)}
`,
          },
        ],
      });

    const raw =
      completion.choices[0].message.content;

    const parsed = extractJSON(raw);

    return res.status(200).json({
      reply: parsed,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Grading failed",
    });
  }
}