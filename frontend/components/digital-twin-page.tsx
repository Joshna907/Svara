"use client";

import {
  ArrowRight,
  Browser,
  CheckCircle,
  Code,
  FileText,
  GithubLogo,
  GraduationCap,
  HeadCircuit,
  Lightning,
  Microphone,
  Robot,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { VoiceStage, type ConnectionDetails } from "./voice-stage";

const questions = [
  "What did you build?",
  "How does pause and resume work?",
  "What tradeoffs did you make?",
  "Why should we hire you?",
];

const experience = [
  {
    icon: GraduationCap,
    title: "B.Tech Computer Science",
    text: "A foundation in software engineering, algorithms, and practical problem solving.",
  },
  {
    icon: Code,
    title: "Full-stack and backend development",
    text: "Building web applications with attention to architecture, performance, and user experience.",
  },
  {
    icon: GithubLogo,
    title: "Open-source engineering",
    text: "Learning in public, reading real codebases, and collaborating with other builders.",
  },
  {
    icon: Wrench,
    title: "Workflow automation",
    text: "Designing tools that reduce friction and make complex work easier to operate.",
  },
];

const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#engineering";

export function DigitalTwinPage() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [connection, setConnection] = useState<ConnectionDetails | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = useCallback(async () => {
    stageRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (connection || isStarting) return;

    setIsStarting(true);
    setError(null);
    try {
      const response = await fetch("/api/connection-details", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not start the conversation.");
      setConnection(payload as ConnectionDetails);
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Could not start the conversation.");
    } finally {
      setIsStarting(false);
    }
  }, [connection, isStarting, reduceMotion]);

  const disconnect = useCallback(() => setConnection(null), []);

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <main>
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Svara by Jothsana, home">
          <span className="brand-mark">SV</span>
          <span>Svara <em>by Jothsana</em></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#engineering">Engineering</a>
          <a href={githubUrl}>GitHub</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Svara · Live voice portfolio</p>
          <h1>Meet the engineer. Ask Svara.</h1>
          <p className="hero-summary">A real-time voice conversation with Svara about Jothsana&apos;s work, decisions, and experience.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={startConversation} disabled={isStarting}>
              <Microphone weight="bold" aria-hidden="true" />
              {isStarting ? "Preparing room" : "Start conversation"}
            </button>
            <a className="text-link" href="#engineering">
              How it works <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="proof-points" aria-label="Project highlights">
            <div>
              <HeadCircuit aria-hidden="true" />
              <strong>Talk naturally</strong>
              <span>Ask about projects, skills, or decisions</span>
            </div>
            <div>
              <Code aria-hidden="true" />
              <strong>Real experience</strong>
              <span>Grounded in Jothsana&apos;s own profile</span>
            </div>
            <div>
              <Sparkle aria-hidden="true" />
              <strong>Built end to end</strong>
              <span>Voice AI from backend to interface</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={stageRef}
          className="hero-stage"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <VoiceStage
            connection={connection}
            isStarting={isStarting}
            error={error}
            onStart={startConversation}
            onDisconnected={disconnect}
          />
        </motion.div>
      </section>

      <section className="conversation-section shell" id="about">
        <motion.div className="section-intro" {...reveal}>
          <h2>A portfolio you can talk to.</h2>
          <p>Ask about the work, then challenge the decisions behind it.</p>
        </motion.div>

        <div className="question-layout">
          <div className="question-list">
            {questions.map((question, index) => (
              <motion.button
                key={question}
                type="button"
                className="question-row"
                onClick={startConversation}
                initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <span>{question}</span>
                <ArrowRight aria-hidden="true" />
              </motion.button>
            ))}
          </div>

          <motion.div className="conversation-preview" {...reveal}>
            <div className="preview-wave" aria-hidden="true">
              {Array.from({ length: 34 }, (_, index) => (
                <span key={index} style={{ height: `${14 + ((index * 17) % 46)}%` }} />
              ))}
            </div>
            <div className="preview-message preview-user">
              <small>You</small>
              <p>What did you build?</p>
            </div>
            <div className="preview-message preview-agent">
              <small>Svara · Jothsana&apos;s voice twin</small>
              <p>I built a real-time voice portfolio that connects low-latency conversation to knowledge about my actual work.</p>
            </div>
            <button className="preview-action" type="button" onClick={startConversation}>
              <Microphone weight="bold" aria-hidden="true" /> Try a question
            </button>
          </motion.div>
        </div>
      </section>

      <section className="engineering-section shell" id="engineering">
        <motion.div className="section-intro engineering-intro" {...reveal}>
          <h2>Built with intention.</h2>
          <p>The demo is simple. The engineering decisions are not.</p>
        </motion.div>

        <motion.div className="architecture" {...reveal} aria-label="System architecture">
          <ArchitectureStep icon={Browser} title="Browser" text="You speak naturally" />
          <ArrowRight className="architecture-arrow" aria-hidden="true" />
          <ArchitectureStep icon={Microphone} title="LiveKit room" text="Low-latency audio" />
          <ArrowRight className="architecture-arrow" aria-hidden="true" />
          <ArchitectureStep icon={Robot} title="Svara agent" text="Understands and responds" />
          <ArrowRight className="architecture-arrow" aria-hidden="true" />
          <ArchitectureStep icon={FileText} title="Knowledge profile" text="Work and decisions" />
        </motion.div>

        <div className="tradeoff-grid">
          <motion.article className="tradeoff tradeoff-featured" {...reveal}>
            <Lightning weight="fill" aria-hidden="true" />
            <h3>Latency before verbosity</h3>
            <p>Voice feels natural when answers arrive quickly. Responses stay concise while LiveKit handles real-time streaming.</p>
          </motion.article>
          <motion.article className="tradeoff" {...reveal}>
            <HeadCircuit aria-hidden="true" />
            <h3>Explicit voice controls</h3>
            <p>Pause and resume are modeled as real conversation state, with context preserved between turns.</p>
          </motion.article>
          <motion.article className="tradeoff" {...reveal}>
            <FileText aria-hidden="true" />
            <h3>Grounded personal answers</h3>
            <p>A structured Markdown profile keeps responses relevant to Jothsana&apos;s actual experience.</p>
          </motion.article>
        </div>

        <div className="quality-strip">
          <div><CheckCircle weight="bold" aria-hidden="true" /><span><strong>Tested</strong> Core logic covered</span></div>
          <div><FileText aria-hidden="true" /><span><strong>Documented</strong> Setup and tradeoffs</span></div>
          <div><Robot aria-hidden="true" /><span><strong>Deployable</strong> Local or cloud</span></div>
        </div>
      </section>

      <section className="about-section shell">
        <motion.div className="about-copy" {...reveal}>
          <h2>Curious by default. Responsible in practice.</h2>
          <p>I build end-to-end software, learn quickly, and care about the details that make AI useful.</p>
          <div className="experience-list">
            {experience.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span className="experience-icon"><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.aside className="final-cta" {...reveal}>
          <Microphone aria-hidden="true" />
          <h2>The best way to review this project is to talk to it.</h2>
          <p>Ask about the work, the decisions, or the person behind the code.</p>
          <button className="button button-primary" type="button" onClick={startConversation}>
            <Microphone weight="bold" aria-hidden="true" /> Start conversation
          </button>
          <a className="text-link" href={githubUrl}>
            <GithubLogo weight="fill" aria-hidden="true" /> View source on GitHub <ArrowRight aria-hidden="true" />
          </a>
        </motion.aside>
      </section>

      <footer className="site-footer shell">
        <a className="brand" href="#top" aria-label="Svara by Jothsana, home"><span className="brand-mark">SV</span><span>Svara <em>by Jothsana</em></span></a>
        <span>Built with LiveKit</span>
      </footer>
    </main>
  );
}

function ArchitectureStep({ icon: Icon, title, text }: { icon: typeof Browser; title: string; text: string }) {
  return (
    <div className="architecture-step">
      <Icon aria-hidden="true" />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
