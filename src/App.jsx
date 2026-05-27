import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        },
      );

      const data = await response.json();

      const aiMessage = {
        role: "ai",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    }

    setInput("");
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        STEMFlow
      </h1>

      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl max-w-[70%]
            ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-lg text-black"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;