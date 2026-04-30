"use client";

import { useState } from "react";
import { CreditSearchForm } from "@/components/verify/CreditSearchForm";
import { CreditDetailsCard } from "@/components/verify/CreditDetailsCard";
import { fetchCADTrustProject } from "@/lib/api/cadTrust";
import type { CADTrustProject } from "@/lib/types";
import { Loader2 } from "lucide-react";

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
      // Validate query
      if (!query || query.length < 2) {
        setError("Please enter a valid search query (at least 2 characters)");
        return;
      }

      if (query.length > 200) {
        setError("Search query is too long (maximum 200 characters)");
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
        err instanceof Error ? err.message : "Failed to fetch project data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Verify Carbon Credits
        </h1>
        <p className="text-gray-400">
          Search and verify carbon credits from Verra, Gold Standard, and CCTS
          registries using live CAD Trust data.
        </p>
      </div>

      <CreditSearchForm onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-3 text-gray-400">Searching registries...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {project && dataSource && (
        <CreditDetailsCard project={project} dataSource={dataSource} />
      )}
    </div>
  );
}
