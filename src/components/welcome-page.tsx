"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BentoFeatures } from "@/components/home/bento-features";
import { WorkflowTimeline } from "@/components/home/workflow-timeline";
import { FAQAccordion } from "@/components/home/faq-accordion";
import { CTASection } from "@/components/home/cta-section";

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Hyper focus mode",
      desc: "start by organizing your daily targets with smart priorities",
      image: "/papercut2.svg",
      fallback: "https://images.unsplash.com/",
      tag: "Focus",
    },
    {
      num: "02",
      title: "Lightning fast execution",
      desc: "instant optimistic updates ensure zero lag on every task",
      image: "/papercut3.svg",
      tag: "Speed",
    },
    {
      num: "03",
      title: "Minimalist designer ui",
      desc: "fluid interactive transitions and experience",
      image: "/papercut1.svg",
      tag: "Design",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50 dark:bg-black selection:bg-[#3bda71] selection:text-black font-sans"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* Theme toggle in top-right */}
      <div className="fixed top-6 right-6 z-50">
        <div className="p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 sm:py-14 max-w-5xl mx-auto w-full text-center space-y-10 sm:space-y-16">

        {/* Badge & Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8 max-w-4xl mx-auto"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3bda71]/15 border border-[#3bda71]/30 backdrop-blur-md">
            <img src="/logo.png" alt="TaskFlow Logo" className="w-4 h-4 rounded-full object-cover" />
            <span className="text-[11px] sm:text-xs font-medium tracking-wide text-neutral-800 dark:text-[#3bda71] uppercase">
              TaskFlow 2.0 &bull; Next-Gen Todo Experience
            </span>
          </div>

          {/* Main Headline - Viewport display text */}
          <div className="space-y-4 sm:space-y-5">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-black dark:text-white uppercase flex flex-col items-center justify-center gap-1 sm:gap-3 leading-none">
              <span className="inline-flex items-center justify-center gap-1.5 sm:gap-3 leading-none">
                <span>Effort</span>
                <span className="bg-[#3bda71] text-black dark:text-black px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl leading-none">
                  less
                </span>
              </span>
              <span className="text-[#3bda71] leading-none">
                Flow
              </span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal pt-1">
              A responsive task workspace designed for clarity and seamless productivity.
            </p>
          </div>

          {/* Try Now Button directly below headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="pt-4 sm:pt-6 flex flex-col items-center gap-3"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black shadow-md text-base sm:text-lg font-semibold gap-2.5 group transition-all duration-200 hover:scale-105 active:scale-95 border-0 mb-5"
            >
              Try Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Button>

            <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-normal">
              <ShieldCheck className="w-4 h-4 text-[#3bda71]" />
              <span>No signup required &bull; Persistent local database</span>
            </div>

            {/* App Preview Image Showcase with Floating Motion Badges */}
            <div className="mt-6 sm:mt-8 max-w-3xl w-full mx-auto relative group">
              {/* Floating Glassmorphic Motion Badge Left */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:flex absolute -top-5 -left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg text-xs font-semibold text-black dark:text-white"
              >
                <div className="w-5 h-5 rounded-md bg-[#3bda71] text-black flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Daily Targets 100%</span>
              </motion.div>

              {/* Floating Glassmorphic Motion Badge Right */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:flex absolute -bottom-5 -right-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg text-xs font-semibold text-black dark:text-white"
              >
                <Zap className="w-4 h-4 text-[#3bda71] fill-[#3bda71]" />
                <span>Optimistic Sync &bull; 0ms</span>
              </motion.div>

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 shadow-xl bg-black p-2 sm:p-2.5">
                <img
                  src="/image.png"
                  alt="TaskFlow Workspace Preview"
                  className="w-full h-auto rounded-xl sm:rounded-2xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll-Driven / Interactive Step Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto pt-6 sm:pt-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left">

            {/* Left Card Frame: Active Step Illustration */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full aspect-square max-w-sm rounded-3xl bg-[#f8fafc] dark:bg-neutral-900/50 p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full flex flex-col items-center justify-center relative"
                  >
                    <img
                      src={steps[activeStep].image}
                      alt={steps[activeStep].title}
                      className="w-full h-full max-h-[260px] sm:max-h-[280px] object-contain p-0"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Middle Vertical Indicator Pill */}
            <div className="hidden lg:flex flex-col items-center gap-2.5 lg:col-span-1 justify-center h-full">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-2 transition-all duration-300 rounded-full ${activeStep === index
                      ? "h-8 bg-[#3bda71]"
                      : "h-2 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400"
                    }`}
                />
              ))}
            </div>

            {/* Right Numbered Steps List */}
            <div className="lg:col-span-5 space-y-5 pl-0 lg:pl-2">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveStep(index)}
                    className={`cursor-pointer transition-all duration-300 space-y-1.5 group p-3.5 rounded-xl ${isActive
                        ? "bg-white dark:bg-neutral-900/80 shadow-sm"
                        : "opacity-40 hover:opacity-75"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${isActive
                            ? "bg-[#3bda71]/20 text-[#3bda71]"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                          }`}
                      >
                        {step.num}
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-bold tracking-tight lowercase transition-colors ${isActive
                            ? "text-black dark:text-white"
                            : "text-neutral-400 dark:text-neutral-600"
                          }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className={`text-xs leading-relaxed lowercase font-normal pl-9 ${isActive
                          ? "text-neutral-500 dark:text-neutral-400"
                          : "text-neutral-400 dark:text-neutral-600"
                        }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>

        {/* Bento Features Grid */}
        <BentoFeatures />

        {/* 3-Step Routine Visual Timeline */}
        <WorkflowTimeline />

        {/* FAQ Accordion Section */}
        <FAQAccordion />

        {/* High Impact Call-to-Action Banner */}
        <CTASection onGetStarted={onGetStarted} />

      </div>

      {/* Ultra Modern Display Footer (ResuMatch Style) */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 pt-4">
        <div className="bg-white dark:bg-black rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-neutral-200 dark:border-neutral-900 shadow-xl space-y-6 transition-colors duration-300">
          {/* Subtle Ambient Glow behind logo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,218,113,0.14),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* Giant Brand Typography */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none uppercase select-none">
              <span className="text-[#3bda71]">Task</span>
              <span className="text-black dark:text-white">Flow</span>
            </h2>

            {/* Sub-links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 pt-2 font-medium">
              <button onClick={onGetStarted} className="hover:text-[#3bda71] transition-colors">Workspace</button>
              <span className="text-neutral-700">•</span>
              <a href="#bento" className="hover:text-[#3bda71] transition-colors">Features</a>
              <span className="text-neutral-700">•</span>
              <a href="#demo" className="hover:text-[#3bda71] transition-colors">Interactive Demo</a>
              <span className="text-neutral-700">•</span>
              <a href="#faq" className="hover:text-[#3bda71] transition-colors">FAQ</a>
            </div>

            {/* Copyright Subtext */}
            <p className="text-[10px] sm:text-xs text-neutral-500 font-normal tracking-widest uppercase pt-2">
              &copy; {new Date().getFullYear()} TaskFlow 2.0 &bull; Crafted with Next.js, Framer Motion & TailwindCSS
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
