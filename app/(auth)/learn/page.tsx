"use client";

import { QualityTabsContainer } from "@/components/learn/QualityTabsContainer";

export default function LearnPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Carbon Credit Quality Standards
        </h1>
        <p className="text-gray-400">
          Learn about the key criteria that determine carbon credit quality and
          how to evaluate projects effectively.
        </p>
      </div>

      <QualityTabsContainer />
    </div>
  );
}
