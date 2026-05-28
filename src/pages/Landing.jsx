import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Zap,
  Layout,
  MessageSquare
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-[#0B0F19] text-white font-[Plus_Jakarta_Sans]">

      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/20 blur-[140px]" />
      </div>

      {/* NAV */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-semibold tracking-wide">STEMFlow</h1>

        <a
          href="/chat"
          className="px-5 py-2 rounded-xl bg-white text-black hover:scale-105 transition"
        >
          Open App
        </a>
      </div>

      {/* HERO */}
      <section className="relative z-10 px-8 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between gap-12">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-5xl font-bold leading-tight">
            AI Tutor for
            <span className="text-purple-400"> STEM Learning</span>
          </h2>

          <p className="mt-6 text-gray-300 text-lg">
            Learn smarter, not harder. STEMFlow transforms any topic into structured lessons,
            quizzes, and exams using AI.
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="/chat"
              className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition flex items-center gap-2"
            >
              Start Learning <ArrowRight size={18} />
            </a>

            <a
              href="#features"
              className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* illustration */}
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          src="https://illustrations.popsy.co/amber/digital-nomad.svg"
          className="w-[400px]"
        />
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-8 md:px-20 py-20">

        <h3 className="text-3xl font-bold mb-10 text-center">
          Everything you need to learn STEM
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          <Feature
            icon={<Brain />}
            title="AI Tutor"
            desc="Structured explanations based on beginner, intermediate, and advanced levels."
          />

          <Feature
            icon={<BookOpen />}
            title="Smart Lessons"
            desc="Turn any topic into clean, structured learning notes instantly."
          />

          <Feature
            icon={<MessageSquare />}
            title="Interactive Learning"
            desc="Ask questions, generate quizzes, and test yourself instantly."
          />

          <Feature
            icon={<Zap />}
            title="Fast Responses"
            desc="Optimized AI prompts for quick and high-quality answers."
          />

          <Feature
            icon={<Layout />}
            title="Clean UI"
            desc="Minimal, distraction-free learning experience."
          />

          <Feature
            icon={<Sparkles />}
            title="Adaptive Modes"
            desc="Switch between Learn, Quiz, and Exam modes anytime."
          />

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-8 md:px-20 py-20">

        <h3 className="text-3xl font-bold text-center mb-10">
          How it works
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          <Step num="1" title="Enter Topic" />
          <Step num="2" title="AI Generates Lesson" />
          <Step num="3" title="Learn & Test Yourself" />

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center py-20">

        <h2 className="text-4xl font-bold">
          Start learning smarter today
        </h2>

        <p className="mt-4 text-gray-400">
          Join the STEMFlow community and unlock your learning potential.
        </p>

        <a
          href="/chat"
          className="inline-block mt-8 px-8 py-4 bg-purple-600 rounded-xl hover:bg-purple-500 transition"
        >
          Launch App
        </a>

      </section>

    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
      <div className="text-purple-400 mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

function Step({ num, title }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
      <div className="text-purple-400 text-2xl font-bold">{num}</div>
      <div className="mt-2 font-medium">{title}</div>
    </div>
  );
}