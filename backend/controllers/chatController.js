import axios from "axios";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const MODEL = process.env.MODEL;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(JSON.stringify(error.response?.data, null, 2));

    res.status(500).json({
      error: "AI request failed",
    });
  }
};
