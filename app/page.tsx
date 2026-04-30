"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Verify. Onboard. Trade.{" "}
            <span className="text-primary">High-Quality Carbon Credits</span> in
            One Place
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Comprehensive platform for verifying, onboarding, and simulating
            carbon credits from Verra, Gold Standard, and CCTS registries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Powered by CAD Trust Data Model 2.0</span>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Verify Credits",
                description:
                  "Search and verify carbon credits from major registries using live CAD Trust API data. Get instant access to project details, methodology, and quality indicators.",
              },
              {
                icon: BookOpen,
                title: "Learn & Onboard",
                description:
                  "Access educational content on carbon quality criteria and get step-by-step guidance for registry onboarding with Verra and Gold Standard.",
              },
              {
                icon: TrendingUp,
                title: "Simulate Trading",
                description:
                  "Practice carbon credit trading in a realistic simulator with portfolio management, price charts, and market analysis tools.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="container mx-auto px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          >
            Trusted by Leading Registries
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center"
          >
            {[
              {
                name: "Verra",
                url: "https://verra.org",
                description: "Verra Registry",
              },
              {
                name: "Gold Standard",
                url: "https://www.goldstandard.org",
                description: "Gold Standard Registry",
              },
              {
                name: "CAD Trust",
                url: "https://climateactiondata.org",
                description: "Climate Action Data Trust",
              },
              {
                name: "CCTS",
                url: "https://ccts.gov.in",
                description: "India CCTS Registry",
              },
            ].map((registry) => (
              <a
                key={registry.name}
                href={registry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-primary/50 transition-colors w-full h-32"
              >
                <span className="text-lg font-semibold text-white">
                  {registry.name}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {registry.description}
                </span>
              </a>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <a
              href="https://climateactiondata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-lg font-medium">
                Powered by CAD Trust Data Model 2.0
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Carbon Trade X. Demo platform for
            educational purposes.
          </p>
        </div>
      </footer>
    </main>
  );
}
