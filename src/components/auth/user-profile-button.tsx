"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

interface UserProfileButtonProps {
  className?: string;
}

export function UserProfileButton({ className }: UserProfileButtonProps) {
  const { user, loading, openAuthModal, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button
        onClick={() => openAuthModal("signin")}
        className={cn(
          "h-10 px-4 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black font-semibold text-[13px] leading-[18px] shadow-sm transition-all flex items-center gap-2 cursor-pointer border-0",
          className
        )}
      >
        <User className="w-4 h-4 text-black stroke-[2.2]" />
        <span>Sign In</span>
      </Button>
    );
  }

  const displayName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 pl-2 pr-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 transition-all cursor-pointer shadow-sm group",
          className
        )}
        title="Account options"
      >
        <div className="w-6 h-6 rounded-lg bg-[#3bda71] text-black font-bold text-[12px] flex items-center justify-center shrink-0">
          {initial}
        </div>
        <span className="text-[13px] leading-[18px] font-medium text-black dark:text-white max-w-[100px] sm:max-w-[140px] truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 shadow-xl z-50 space-y-3"
          >
            {/* User Details */}
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#3bda71] text-black font-bold text-[11px] flex items-center justify-center">
                  {initial}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[13px] leading-[18px] font-semibold text-black dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] leading-[14px] text-neutral-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[11px] leading-[14px] text-[#3bda71] font-medium border-t border-neutral-200/60 dark:border-neutral-800/80">
                <span>Cloud Sync Enabled</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] leading-[18px] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
