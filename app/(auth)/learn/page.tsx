"use client";

import { QualityTabsContainer } from "@/components/learn/QualityTabsContainer";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function LearnPage() {
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
            <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Education center</span>
          </div>
          <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
            Carbon Credit
            <br />
            <span className="text-primary">Quality</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Learn about the key criteria that determine carbon credit quality
            and integrity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <QualityTabsContainer />
        </motion.div>
      </div>
    </div>
  );
}
