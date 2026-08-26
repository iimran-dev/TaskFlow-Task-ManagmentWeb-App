"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl sm:rounded-[36px] bg-white dark:bg-black text-black dark:text-white p-8 sm:p-16 text-center relative overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6 sm:space-y-8 transition-colors duration-300"
      >
        {/* Glow ambient effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,218,113,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#3bda71]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/15 border border-[#3bda71]/30 text-[11px] font-semibold tracking-wider text-[#3bda71] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Building Momentum</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-black dark:text-white tracking-tight uppercase leading-none">
            Ready to Reclaim Your <span className="text-[#3bda71]">Focus?</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Join thousands of developers and creators who organize their daily targets with lightning speed and zero friction.
          </p>
        </div>

        <div className="relative z-10 pt-2 flex flex-col items-center gap-3">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 sm:h-16 px-10 sm:px-12 rounded-2xl bg-[#3bda71] hover:bg-[#34c666] text-black text-lg sm:text-xl font-bold shadow-xl gap-3 transition-all duration-200 hover:scale-105 active:scale-95 border-0 group"
          >
            Launch Workspace Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>

          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-normal pt-2">
            <ShieldCheck className="w-4 h-4 text-[#3bda71]" />
            <span>Instant Access &bull; No Login Required &bull; Free Forever</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
