"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();
  const emailInputId = useId();
  const passwordInputId = useId();
  const nameInputId = useId();

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=/#app`
            : undefined;

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name.trim() || cleanEmail.split("@")[0],
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // If user is immediately active (email confirmation off)
        if (data.session) {
          await fetch("/api/auth/sync", { method: "POST" }).catch(() => {});
          setSuccessMessage("Account created successfully!");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 800);
        } else {
          // Email confirmation is required
          setSuccessMessage(
            "Account registered! Please check your email to confirm your account."
          );
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // Verify with database that user still has access
        const syncRes = await fetch("/api/auth/sync", { method: "POST" });
        if (!syncRes.ok) {
          await supabase.auth.signOut().catch(() => {});
          setError("Account not found or access has been revoked");
          setLoading(false);
          return;
        }

        setSuccessMessage("Welcome back!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 600);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 z-10 my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-[20px] leading-[26px] font-bold text-black dark:text-white tracking-[-0.02em]">
                    {mode === "signin" ? "Sign in to TaskFlow" : "Create an Account"}
                  </h2>
                  <p className="text-[13px] leading-[18px] text-neutral-500 dark:text-neutral-400 font-normal">
                    {mode === "signin"
                      ? "Access your personal workspace across any device"
                      : "Keep your tasks private and synced in the cloud"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 text-[13px] leading-[18px] font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 text-[13px] leading-[18px] font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[13px] leading-[18px]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#3bda71]/15 border border-[#3bda71]/30 text-emerald-700 dark:text-[#3bda71] text-[13px] leading-[18px]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor={nameInputId}
                    className="text-[12px] leading-[16px] font-medium text-neutral-600 dark:text-neutral-400 block"
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id={nameInputId}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[14px] leading-[20px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3bda71] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor={emailInputId}
                  className="text-[12px] leading-[16px] font-medium text-neutral-600 dark:text-neutral-400 block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id={emailInputId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[14px] leading-[20px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3bda71] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={passwordInputId}
                  className="text-[12px] leading-[16px] font-medium text-neutral-600 dark:text-neutral-400 block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id={passwordInputId}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[14px] leading-[20px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3bda71] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-[11px] leading-[14px] text-neutral-400">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black font-semibold text-[14px] leading-[20px] shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer switcher info */}
            <div className="pt-2 text-center text-[12px] leading-[16px] text-neutral-500 dark:text-neutral-400">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
