import { useEffect, useRef, useState } from "react";
import { Menu, X, RefreshCw, ClipboardList, FileText } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [lastLesson, setLastLesson] = useState("");

    const [view, setView] = useState("chat");
    const [quizData, setQuizData] =
        useState(null);

    const [answers, setAnswers] =
        useState({});

    const [score, setScore] =
        useState(null);

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [input]);

    const chatRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.ctrlKey && e.key === "b") {
                e.preventDefault();
                setSidebarOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, []);

    const sendMessage = async (customMessage) => {
        const finalMessage = customMessage || input;

        if (!finalMessage.trim() || loading) return;

        const userMessage = {
            role: "user",
            content: finalMessage,
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
                    message: finalMessage,
                }),
            });

            const data = await response.json();

            const aiMessage = {
                role: "ai",
                content: data.reply,
            };

            setMessages((prev) => [...prev, aiMessage]);

            setLastLesson(data.reply);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    const gradeQuiz = () => {
        let correct = 0;

        quizData.questions.forEach((q, index) => {
            const userAnswer = answers[index];

            if (!userAnswer) return;

            if (
                userAnswer.toLowerCase().trim() ===
                q.answer.toLowerCase().trim()
            ) {
                correct++;
            }
        });

        setScore(
            `${correct}/${quizData.questions.length}`
        );
    };

    const generateQuiz = async () => {
        if (!lastLesson || loading) return;

        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Generate a quiz from this lesson",
                    lesson: lastLesson,
                    mode: "quiz",
                }),
            });

            const data = await res.json();

            setQuizData(data.reply);
            setView("quiz");
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    const generateExam = async () => {
        if (!lastLesson || loading) return;

        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Generate an exam from this lesson",
                    lesson: lastLesson,
                    mode: "exam",
                }),
            });

            const data = await res.json();

            setQuizData(data.reply);
            setView("exam");
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="h-screen bg-[#0B0F19] text-white flex overflow-hidden">
            {/* SIDEBAR */}

            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                        />

                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 24,
                            }}
                            className="fixed left-0 top-0 h-full w-[280px]
              bg-[#111827] z-50 border-r border-white/10 p-5"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-semibold">STEMFlow</h2>

                                <button onClick={() => setSidebarOpen(false)}>
                                    <X />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setMessages([]);
                                    setView("chat");
                                }}
                                className="w-full bg-purple-600 hover:bg-purple-700
                transition rounded-xl py-3"
                            >
                                New Chat
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN */}

            <div className="flex-1 flex flex-col">
                {/* TOPBAR */}

                <div
                    className="h-[70px] border-b border-white/10
        flex items-center justify-between px-4"
                >
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)}>
                            <Menu />
                        </button>

                        <h1 className="text-lg font-semibold">STEMFlow</h1>
                    </div>
                </div>

                {/* CHAT VIEW */}

                {view === "chat" && (
                    <>
                        <div
                            ref={chatRef}
                            className="flex-1 overflow-y-auto px-4 md:px-10 py-8"
                        >
                            <div className="max-w-4xl mx-auto space-y-10">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {msg.role === "user" ? (
                                            <div className="flex justify-end">
                                                <div
                                                    className="bg-purple-600 px-5 py-3
                        rounded-2xl max-w-[80%] text-sm"
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full">
                                                <div
                                                    className="prose prose-invert max-w-none
                        prose-headings:text-white
                        prose-p:text-gray-300
                        prose-strong:text-white
                        prose-code:text-purple-300
                        prose-pre:bg-[#111827]
                        prose-pre:border prose-pre:border-white/10"
                                                >
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>

                                                {/* ACTIONS */}

                                                <div className="flex flex-wrap gap-3 mt-6">
                                                    <button
                                                        onClick={() =>
                                                            sendMessage(`
Explain this lesson differently:

${lastLesson}
`)
                                                        }
                                                        className="flex items-center gap-2
                            px-4 py-2 rounded-xl bg-white/5
                            hover:bg-white/10 transition"
                                                    >
                                                        <RefreshCw size={16} />
                                                        Regenerate
                                                    </button>

                                                    <button
                                                        onClick={generateQuiz}
                                                        className="flex items-center gap-2
                            px-4 py-2 rounded-xl bg-white/5
                            hover:bg-white/10 transition"
                                                    >
                                                        <ClipboardList size={16} />
                                                        Quiz Me
                                                    </button>

                                                    <button
                                                        onClick={generateExam}
                                                        className="flex items-center gap-2
                            px-4 py-2 rounded-xl bg-white/5
                            hover:bg-white/10 transition"
                                                    >
                                                        <FileText size={16} />
                                                        Generate Exam
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {loading && (
                                    <div className="animate-pulse text-gray-400">
                                        <div className="flex items-center gap-1 px-2 py-4">
                                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INPUT */}

                        <div className="border-t border-white/10 p-4">
                            <div className="max-w-4xl mx-auto flex gap-3">
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();

                                            if (!loading) {
                                                sendMessage();
                                            }
                                        }
                                    }}
                                    placeholder="Ask anything about STEM..."
                                    className="
    flex-1
    resize-none
    px-4
    py-4
    rounded-2xl
    bg-transparent
    outline-none
    text-white
    placeholder:text-white/40
    max-h-[200px]
  "
                                />

                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700
                  transition px-6 rounded-2xl"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* QUIZ VIEW */}

                {view === "quiz" && quizData && (
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-6">

                            <h1 className="text-3xl font-bold">
                                {quizData.title}
                            </h1>

                            {quizData.questions.map((q, index) => (
                                <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/10">

                                    <p className="mb-3 font-medium">
                                        {index + 1}. {q.question}
                                    </p>

                                    {q.type === "mcq" && q.options?.map((opt, i) => (
                                        <label key={i} className="block p-2 hover:bg-white/10 rounded">
                                            <input
                                                type="radio"
                                                name={`q-${index}`}
                                                onChange={() =>
                                                    setAnswers(prev => ({
                                                        ...prev,
                                                        [index]: opt
                                                    }))
                                                }
                                            />
                                            <span className="ml-2">{opt}</span>
                                        </label>
                                    ))}

                                    {q.type !== "mcq" && (
                                        <input
                                            className="w-full mt-3 p-3 bg-black/30 rounded"
                                            onChange={(e) =>
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [index]: e.target.value
                                                }))
                                            }
                                        />
                                    )}

                                </div>
                            ))}

                            <button
                                onClick={gradeQuiz}
                                className="px-6 py-3 bg-purple-600 rounded-xl"
                            >
                                Submit Quiz
                            </button>

                            {score && (
                                <p className="text-xl font-bold">Score: {score}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* EXAM VIEW */}

                {view === "exam" && quizData && (
                    <div className="flex-1 overflow-y-auto p-6">

                        <div className="max-w-4xl mx-auto space-y-6">

                            <h1 className="text-3xl font-bold">
                                {quizData.title}
                            </h1>

                            {quizData.questions.map((q, index) => (
                                <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/10">

                                    <p className="mb-3 font-medium">
                                        {index + 1}. {q.question}
                                    </p>

                                    {q.type === "mcq" && q.options?.map((opt, i) => (
                                        <label key={i} className="block p-2 hover:bg-white/10 rounded">
                                            <input
                                                type="radio"
                                                name={`q-${index}`}
                                                onChange={() =>
                                                    setAnswers(prev => ({
                                                        ...prev,
                                                        [index]: opt
                                                    }))
                                                }
                                            />
                                            <span className="ml-2">{opt}</span>
                                        </label>
                                    ))}

                                    {q.type !== "mcq" && (
                                        <textarea
                                            className="w-full mt-3 p-3 bg-black/30 rounded"
                                            onChange={(e) =>
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [index]: e.target.value
                                                }))
                                            }
                                        />
                                    )}

                                </div>
                            ))}

                            <button
                                onClick={gradeQuiz}
                                className="px-6 py-3 bg-green-600 rounded-xl"
                            >
                                Submit Exam
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
