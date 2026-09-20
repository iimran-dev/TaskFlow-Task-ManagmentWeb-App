"use client";

import { motion } from "framer-motion";
import { Search, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryType } from "@/types/todo";

interface TodoSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export function TodoSearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  searchInputRef,
}: TodoSearchBarProps) {
  const categories: { type: CategoryType; label: string }[] = [
    { type: "all", label: "All Tags" },
    { type: "work", label: "Work" },
    { type: "personal", label: "Personal" },
    { type: "urgent", label: "Urgent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-2"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
        <Input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter or search tasks..."
          className="h-9 sm:h-10 pl-9 sm:pl-10 pr-10 sm:pr-16 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[14px] sm:text-[15px] leading-[20px] sm:leading-[22px] font-normal text-black dark:text-white placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:font-normal placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-[#3bda71] shadow-sm transition-all"
        />

        {searchQuery ? (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[11px] leading-[14px] font-mono font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 pointer-events-none">
            ⌘F
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-0.5 px-0.5">
        <Tag className="w-3 h-3 text-neutral-400 shrink-0 ml-0.5 mr-0.5" />
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.type;
          return (
            <button
              key={cat.type}
              onClick={() => setSelectedCategory(cat.type)}
              className={`px-2.5 py-1 rounded-lg text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] transition-all shrink-0 cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                  : "bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 font-medium border border-neutral-200 dark:border-neutral-800 hover:border-[#3bda71]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
