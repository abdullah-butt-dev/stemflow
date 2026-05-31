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

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",

      messages: [
        {
          role: "system",
          content: `
You are an expert STEM examiner.

Evaluate every answer carefully.

Rules:

- MCQs must be graded exactly.
- Short answers may be partially correct.
- Long answers should be graded based on understanding.
- Accept equivalent wording.
- Do not require exact phrasing.
- Award marks fairly.

Return ONLY valid JSON.

{
  "feedback":[
    {
      "question":"...",
      "result":"Correct",
      "correctAnswer":"...",
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

    const raw = completion.choices?.[0]?.message?.content || "";

    const parsed = extractJSON(raw);

    if (!parsed) {
      return res.status(200).json({
        reply: {
          score: "0/0",
          feedback: [
            {
              question: "Evaluation Error",
              result: "error",
              explanation: "AI returned invalid grading data.",
            },
          ],
        },
      });
    }

    const feedback = parsed.feedback || [];

    let points = 0;

    feedback.forEach((item) => {
      const result = item.result?.toLowerCase() || "";

      if (result.includes("partially")) {
        points += 0.5;
      } else if (result === "correct") {
        points += 1;
      }
    });

    const score = `${points}/${feedback.length}`;

    return res.status(200).json({
      reply: {
        score,
        feedback,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Grading failed",
    });
  }
}