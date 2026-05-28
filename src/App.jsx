import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("beginner");
  const [lastLesson, setLastLesson] = useState("");
  const [mode, setMode] = useState("learn");

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    const userMessage = {
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          level,
          mode
        }),
      });

      if (!response.ok) {
        throw new Error("API Error: " + response.status);
      }

      const data = await response.json();

      const aiMessage = {
        role: "ai",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setLastLesson(data.reply);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong. Try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const sendQuiz = async (type) => {
    if (loading) return;
    if (!lastLesson) return;

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Generate a ${type} from this lesson`,
          lesson: lastLesson,
          mode: type,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        role: "ai",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen font-[Inter] bg-[var(--bg-dark)] text-[var(--text-dark)] p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        STEMFlow
      </h1>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-4">
        {["beginner", "intermediate", "advanced"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`px-4 py-2 rounded-[var(--radius)] text-sm transition ${level === lvl
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--card-dark)] text-[var(--text-dark)] border border-[var(--border-dark)]"
              }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {["learn", "quiz", "exam"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-[var(--radius)] text-sm ${mode === m
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--card-dark)] text-[var(--text-dark)]"
              }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-5 py-4 rounded-[var(--radius)] max-w-[75%]
                leading-7 text-[15px] whitespace-pre-wrap
                shadow-sm
                ${msg.role === "user"
                ? "bg-[var(--primary)] text-white ml-auto"
                : "bg-[var(--card-dark)] text-[var(--text-dark)] border border-[var(--border-dark)]"
              }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="bg-[var(--card-dark)] text-[var(--text-dark)] p-4 rounded-[var(--radius)] w-fit animate-pulse border border-[var(--border-dark)]">
            AI is thinking...
          </div>
        )}
      </div>

      {lastLesson && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => sendQuiz("quiz")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Generate Quiz
          </button>

          <button
            onClick={() => sendQuiz("exam")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Generate Exam
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Ask anything about STEM..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1 px-4 py-3 rounded-[var(--radius)] bg-[var(--card-dark)] text-[var(--text-dark)] border border-[var(--border-dark)] outline-none focus:border-[var(--primary)]"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-6 py-3 rounded-[var(--radius)] font-medium transition ${loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
            }`}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;