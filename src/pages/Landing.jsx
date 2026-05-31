import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Zap,
  Layout,
  MessageSquare,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-[#0B0F19] text-white font-[Plus_Jakarta_Sans] overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/20 blur-[140px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-semibold tracking-wide">
          STEMFlow
        </h1>

        <Link
          to="/chat"
          className="px-5 py-2 rounded-xl bg-white text-black hover:scale-105 transition"
        >
          Open App
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-8 md:px-20 py-24 flex flex-col lg:flex-row items-center justify-between gap-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles size={16} />
            <span className="text-sm">
              AI Powered STEM Learning Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Learn STEM
            <br />
            <span className="text-purple-400">
              Faster. Smarter.
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-300 max-w-2xl">
            Transform any topic into structured lessons, personalized quizzes,
            realistic exams, and AI-powered feedback.
            Built to help students understand concepts instead of memorizing them.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/chat"
              className="px-7 py-4 bg-purple-600 rounded-2xl hover:bg-purple-500 transition flex items-center gap-2"
            >
              Start Learning
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="px-7 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition"
            >
              Explore Features
            </a>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">
            <span>✓ AI Lessons</span>
            <span>✓ Smart Quizzes</span>
            <span>✓ Exam Practice</span>
            <span>✓ AI Evaluation</span>
          </div>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          src="https://illustrations.popsy.co/amber/digital-nomad.svg"
          alt="AI Learning"
          className="w-[450px] max-w-full"
        />
      </section>

      {/* STATS */}
      <section className="relative z-10 px-8 md:px-20 py-10">
        <div className="grid md:grid-cols-4 gap-6">

          <Stat value="24/7" label="AI Tutor" />
          <Stat value="∞" label="Practice Questions" />
          <Stat value="AI" label="Answer Evaluation" />
          <Stat value="STEM" label="Focused Learning" />

        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 px-8 md:px-20 py-24"
      >
        <h2 className="text-4xl font-bold text-center mb-4">
          Built for Modern STEM Education
        </h2>

        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-14">
          Everything needed to learn, practice, evaluate,
          and improve in one platform.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <Feature
            icon={<Brain />}
            title="AI Tutor"
            desc="Deep explanations with clean formatting, examples, and structured lessons."
          />

          <Feature
            icon={<BookOpen />}
            title="Smart Lessons"
            desc="Generate organized learning material from any STEM topic instantly."
          />

          <Feature
            icon={<ClipboardCheck />}
            title="Interactive Quizzes"
            desc="Practice with MCQs and short-answer questions generated from lessons."
          />

          <Feature
            icon={<GraduationCap />}
            title="Exam Preparation"
            desc="Generate realistic exam sets with mixed difficulty questions."
          />

          <Feature
            icon={<BarChart3 />}
            title="AI Evaluation"
            desc="Receive instant grading and feedback on your answers."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Focused Learning"
            desc="No distractions. Just learning, testing, and improvement."
          />
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative z-10 px-8 md:px-20 py-24">

        <h2 className="text-4xl font-bold text-center mb-14">
          How STEMFlow Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <Step
            num="01"
            title="Enter Topic"
            desc="Ask about any STEM concept."
          />

          <Step
            num="02"
            title="Learn"
            desc="Receive structured AI explanations."
          />

          <Step
            num="03"
            title="Practice"
            desc="Generate quizzes and exams."
          />

          <Step
            num="04"
            title="Improve"
            desc="Get AI evaluation and feedback."
          />

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 text-center px-8">

        <h2 className="text-5xl font-bold">
          Ready to Master STEM?
        </h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Learn concepts faster, test yourself continuously,
          and improve through AI-powered evaluation.
        </p>

        <Link
          to="/chat"
          className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 transition"
        >
          Launch STEMFlow
          <ArrowRight size={18} />
        </Link>

      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
      <div className="text-purple-400 mb-4">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm">
        {desc}
      </p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="text-purple-400 text-2xl font-bold">
        {num}
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        {desc}
      </p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
      <div className="text-3xl font-bold text-purple-400">
        {value}
      </div>

      <div className="text-gray-400 mt-2">
        {label}
      </div>
    </div>
  );
}