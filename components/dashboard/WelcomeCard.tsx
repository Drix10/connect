"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Leaf } from "lucide-react";
import { LocalStorageService, STORAGE_KEYS } from "@/lib/storage/localStorage";
import type { Portfolio } from "@/lib/types";

export function WelcomeCard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    const loadedPortfolio = LocalStorageService.get<Portfolio>(
      STORAGE_KEYS.PORTFOLIO,
      { credits: [], totalValue: 0, totalVolume: 0 },
    );
    setPortfolio(loadedPortfolio);
  }, []);

  if (!portfolio) {
    return null;
  }

  const hasCredits = portfolio.credits.length > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Welcome to Carbon Trade X
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasCredits ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Total Verified Credits
                </p>
                <p className="text-3xl font-bold text-white">
                  {portfolio.totalVolume.toLocaleString()}
                  <span className="text-lg text-gray-400 ml-2">tCO₂e</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Potential Portfolio Value
                </p>
                <p className="text-3xl font-bold text-white">
                  ₹{portfolio.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="h-16 w-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Your Carbon Credit Journey
            </h3>
            <p className="text-gray-400 mb-4">
              You don&apos;t have any credits in your portfolio yet. Explore the
              simulator to start trading or verify credits from major
              registries.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
