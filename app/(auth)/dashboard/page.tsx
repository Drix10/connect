"use client";

import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to Carbon Trade X. Manage your carbon credit portfolio and
          explore platform features.
        </p>
      </div>

      <WelcomeCard />
      <QuickActionsGrid />
    </div>
  );
}
