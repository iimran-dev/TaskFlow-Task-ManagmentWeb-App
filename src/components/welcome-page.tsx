"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { GitHub, LinkedIn } from "@/components/icons";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BentoFeatures } from "@/components/home/bento-features";
import { FAQAccordion } from "@/components/home/faq-accordion";

import { UserProfileButton } from "@/components/auth/user-profile-button";
import { useAuth } from "@/components/auth/auth-provider";

export const address = {
  email: "info.imran.ma@gmail.com",
  github: "https://github.com/iimran-dev",
  linkedin: "https://www.linkedin.com/in/imran-m-a-35a89128a/"
};

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const { user, openAuthModal } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const heroTriggerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (user) {
      onGetStarted();
    } else {
      openAuthModal("signin");
    }
  };

  const steps = [
    {
      num: "01",
      title: "Hyper focus mode",
      desc: "Start by organizing your daily targets with smart priorities",
      image: "/papercut2.svg",
      fallback: "https://images.unsplash.com/",
      tag: "Focus",
    },
    {
      num: "02",
      title: "Lightning fast execution",
      desc: "Instant optimistic updates ensure zero lag on every task",
      image: "/papercut3.svg",
      tag: "Speed",
    },
    {
      num: "03",
      title: "Minimalist designer ui",
      desc: "Fluid interactive transitions and experience",
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

  useEffect(() => {
    const handleScroll = () => {
      if (!heroTriggerRef.current) return;
      const rect = heroTriggerRef.current.getBoundingClientRect();
      setShowStickyBtn(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Top action bar: Sticky Workspace Button + Auth + Theme Toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 sm:gap-2.5">
        <AnimatePresence>
          {showStickyBtn && user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Button
                onClick={onGetStarted}
                className="h-10 px-4 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black shadow-md text-[13px] leading-[18px] font-semibold gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 border-0 cursor-pointer"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <UserProfileButton />

        <div className="h-10 w-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center p-0 shrink-0">
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
            <span className="text-[11px] leading-[14px] font-medium tracking-[0.04em] text-neutral-800 dark:text-[#3bda71]">
              taskflow &bull; Next-Gen Cloud Todo Experience
            </span>
          </div>

          {/* Main Headline - Viewport display text */}
          <div className="space-y-4 sm:space-y-5">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.02em] text-black dark:text-white uppercase flex flex-col items-center justify-center gap-1 sm:gap-3 leading-none">
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
            <p className="text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-normal pt-1">
              A responsive task workspace designed for clarity and seamless productivity across all your devices.
            </p>
          </div>

          {/* Try Now / Open Workspace Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="pt-4 sm:pt-6 flex flex-col items-center gap-3"
          >
            <Button
              onClick={handleStart}
              size="lg"
              className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black shadow-md text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] font-medium gap-2.5 group transition-all duration-200 hover:scale-105 active:scale-95 border-0 mb-5 cursor-pointer"
            >
              {user ? "Open Workspace" : "Get Started Free"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Button>

            <div
              ref={heroTriggerRef}
              className="flex items-center gap-2 text-[12px] leading-[16px] text-neutral-400 dark:text-neutral-500 font-normal"
            >
              <ShieldCheck className="w-4 h-4 text-[#3bda71]" />
              <span>Multi-device cloud sync &bull; Private user workspaces</span>
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
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] leading-[14px] font-semibold transition-all ${isActive
                            ? "bg-[#3bda71]/20 text-[#3bda71]"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                          }`}
                      >
                        {step.num}
                      </div>
                      <h3
                        className={`text-[16px] sm:text-[18px] leading-[24px] font-semibold tracking-[-0.02em] transition-colors ${isActive
                          ? "text-black dark:text-white"
                          : "text-neutral-400 dark:text-neutral-600"
                          }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className={`text-[13px] leading-[18px] font-normal pl-9 ${isActive
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


        {/* FAQ Accordion Section */}
        <FAQAccordion />

      </div>

      {/* Ultra Modern Display Footer (ResuMatch Style) */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 pt-4">
        <div className="bg-white dark:bg-black rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-neutral-200 dark:border-neutral-900 shadow-xl space-y-6 transition-colors duration-300">
          {/* Subtle Ambient Glow behind logo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,218,113,0.14),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* Giant Brand Typography */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none select-none">
              <span className="text-[#3bda71]">task</span>
              <span className="text-black dark:text-white">flow</span>
            </h2>

            {/* Sub-links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] leading-[18px] text-neutral-400 pt-2 font-medium">
              <button onClick={onGetStarted} className="hover:text-[#3bda71] transition-colors cursor-pointer">Workspace</button>
              <span className="text-neutral-700">•</span>
              <a href="#faq" className="hover:text-[#3bda71] transition-colors cursor-pointer">FAQ</a>
            </div>

            {/* Copyright Subtext */}
            <p className="text-[11px] leading-[14px] text-neutral-500 font-normal tracking-[0.04em] pt-2">
              &copy; {new Date().getFullYear()} taskflow, made by <span className="text-[#3bda71]">Imran</span>
            </p>
            <div className="flex items-center justify-center gap-3 pt-3">
              <a
                href={address.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub"
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
              >
                <GitHub className="w-4 h-4" />
              </a>
              <a
                href={address.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
              >
                <LinkedIn className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${address.email}`}
                aria-label="Send Email"
                title="Email"
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
