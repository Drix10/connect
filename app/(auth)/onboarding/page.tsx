"use client";

import { RegistryOnboardingTabs } from "@/components/onboarding/RegistryOnboardingTabs";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 space-y-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 uppercase tracking-wider">
            <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Step-by-step guide</span>
          </div>
          <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
            Registry
            <br />
            <span className="text-primary">Onboarding</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            A comprehensive guide to preparing your project for verification and
            registry listing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <RegistryOnboardingTabs />
        </motion.div>
      </div>
    </div>
  );
}
