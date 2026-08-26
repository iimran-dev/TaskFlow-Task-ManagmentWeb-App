"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomePage } from "@/components/welcome-page";
import { TodoAppPage } from "@/components/todo-app-page";

export default function Page() {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.location.hash !== "#app";
    }
    return true;
  });

  useEffect(() => {
    // Listen to browser back/forward buttons
    const handlePopState = () => {
      const isApp = window.location.hash === "#app";
      setShowWelcome(!isApp);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    if (window.location.hash !== "#app") {
      window.history.pushState({ view: "app" }, "", "#app");
    }
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    if (window.location.hash === "#app") {
      window.history.pushState({ view: "welcome" }, "", window.location.pathname);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full min-h-screen"
          >
            <WelcomePage onGetStarted={handleGetStarted} />
          </motion.div>
        ) : (
          <motion.div
            key="todo"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35 }}
            className="w-full min-h-screen"
          >
            <TodoAppPage onBack={handleBackToWelcome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
