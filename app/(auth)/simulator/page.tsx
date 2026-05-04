"use client";

import { SimulatorContainer } from "@/components/simulator/SimulatorContainer";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function SimulatorPage() {
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
            <span className="w-1.5 h-1.5 rounded-full bg-primary blink"></span>
            <span>Risk-free trading</span>
          </div>
          <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
            Trading
            <br />
            <span className="text-primary">Simulator</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Practice carbon credit trading in a risk-free environment with real
            market data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <SimulatorContainer />
        </motion.div>
      </div>
    </div>
  );
}
