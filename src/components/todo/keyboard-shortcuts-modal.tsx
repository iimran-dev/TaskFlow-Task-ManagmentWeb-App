"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { key: "⌘ N", label: "Focus new task input" },
    { key: "⌘ F", label: "Focus live search bar" },
    { key: "↵ Enter", label: "Submit new task" },
    { key: "?", label: "Toggle keyboard shortcuts modal" },
    { key: "Esc", label: "Close active popover or modal" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 z-10"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center font-bold">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black dark:text-white tracking-tight">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-xs text-neutral-400">Master TaskFlow at key speed</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {shortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/80 text-xs"
                >
                  <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                    {sc.label}
                  </span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm font-mono text-[11px] font-bold text-black dark:text-white">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] text-neutral-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border font-mono">Esc</kbd> anytime to dismiss
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
