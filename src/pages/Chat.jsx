import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState("beginner");
    const [lastLesson, setLastLesson] = useState("");
    const [mode, setMode] = useState("learn");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const chatRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const streamText = async (text, setMessages, index) => {
        let output = "";

        for (let i = 0; i < text.length; i++) {
            output += text[i];

            setMessages((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    content: output,
                };
                return updated;
            });

            await sleep(8); // typing speed
        }
    };

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

            // const aiMessage = {
            //     role: "ai",
            //     content: data.reply,
            // };

            const newMsgIndex = messages.length + 1;

            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "" },
            ]);

            await streamText(data.reply, setMessages, newMsgIndex);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex bg-[var(--bg)] text-[var(--text)]">

            {/* LEFT SIDEBAR */}
            <motion.div
                animate={{ width: sidebarOpen ? 260 : 70 }}
                className="h-full border-r border-white/10 bg-black/30 backdrop-blur-xl"
            >
                <div className="p-4 flex justify-between items-center">
                    <span className="text-white font-semibold">
                        {sidebarOpen ? "STEMFlow" : "SF"}
                    </span>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white/60 hover:text-white"
                    >
                        ☰
                    </button>
                </div>
            </motion.div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col">

                {/* TOP BAR */}
                <div className="border-b border-[var(--border)] p-4 flex justify-between items-center">
                    <div className="font-medium">AI Tutor</div>

                    <div className="flex gap-2">
                        {["learn", "quiz", "exam"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-3 py-1 rounded-[var(--radius)] text-sm hover-lift ${mode === m
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-[var(--card)] text-[var(--muted)]"
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MESSAGES */}

                <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6">

                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
            ${msg.role === "user"
                                            ? "bg-purple-600 text-white"
                                            : "bg-white/5 border border-white/10 text-white"
                                        }`}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ))}

                        {/* Loading as animated message bubble */}
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-start"
                            >
                                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm animate-pulse">
                                    AI is thinking...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>


                {/* QUIZ BUTTONS */}
                {lastLesson && (
                    <div className="px-6 pb-2 flex gap-2">
                        <button
                            onClick={() => sendQuiz("quiz")}
                            className="px-3 py-2 rounded-[var(--radius)] bg-green-600 hover:opacity-90 hover-lift text-white text-sm"
                        >
                            Generate Quiz
                        </button>

                        <button
                            onClick={() => sendQuiz("exam")}
                            className="px-3 py-2 rounded-[var(--radius)] bg-purple-600 hover:opacity-90 hover-lift text-white text-sm"
                        >
                            Generate Exam
                        </button>
                    </div>
                )}

                {/* INPUT AREA */}
                <div className="p-4 border-t border-white/10 flex gap-3 bg-black/20 backdrop-blur-xl">

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask anything about STEM..."
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
