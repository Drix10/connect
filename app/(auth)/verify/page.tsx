"use client";

import { useState } from "react";
import { CreditSearchForm } from "@/components/verify/CreditSearchForm";
import { CreditDetailsCard } from "@/components/verify/CreditDetailsCard";
import { fetchCADTrustProject } from "@/lib/api/cadTrust";
import type { CADTrustProject } from "@/lib/types";
import { Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<CADTrustProject | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setProject(null);
    setDataSource(null);

    try {
      if (!query || query.length < 2 || query.length > 200) {
        setError("Please enter a valid search query (2-200 characters).");
        return;
      }
      const result = await fetchCADTrustProject(query);
      if (!result.project) {
        setError(
          result.error ||
            "Project not found. Please check the ID and try again.",
        );
        return;
      }
      setProject(result.project);
      setDataSource(result.dataSource);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch project data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <Shield className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Registry verification</span>
          </div>
          <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
            Verify Carbon
            <br />
            <span className="text-primary">Credits</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Search major registries using live CAD Trust data and verify credit
            authenticity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <CreditSearchForm onSearch={handleSearch} isLoading={isLoading} />
        </motion.div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2
                className="h-10 w-10 text-primary animate-spin"
                strokeWidth={2}
              />
              <span className="text-base text-muted-foreground font-light">
                Searching registries...
              </span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border-destructive/30"
          >
            <p className="text-destructive text-base">{error}</p>
          </motion.div>
        )}

        {project && dataSource && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CreditDetailsCard project={project} dataSource={dataSource} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
