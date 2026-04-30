"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceTable } from "./MarketplaceTable";
import { PortfolioDisplay } from "./PortfolioDisplay";
import { PriceChart } from "./PriceChart";
import { Portfolio, CarbonCredit, PriceHistoryPoint } from "@/lib/types";
import { buyCredit, sellCredit } from "@/lib/utils/transactions";
import { getMockCredits } from "@/lib/mock-data/credits";
import { getMockPriceHistory } from "@/lib/mock-data/priceHistory";
import { toast } from "sonner";

const STORAGE_KEY = "carbon-trade-x:portfolio";

export function SimulatorContainer() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    credits: [],
    totalValue: 0,
    totalVolume: 0,
  });
  const [marketplaceCredits, setMarketplaceCredits] = useState<CarbonCredit[]>(
    [],
  );
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedPortfolio: Portfolio = JSON.parse(stored);
        setPortfolio(loadedPortfolio);
      }
    } catch (error) {
      console.error("Failed to load portfolio:", error);
      toast.error("Failed to load portfolio from storage");
    }

    // Load marketplace credits
    const allCredits = getMockCredits();
    setMarketplaceCredits(allCredits);
    setIsLoading(false);
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && !isSaving) {
      setIsSaving(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
      } catch (error) {
        console.error("Failed to save portfolio:", error);
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          toast.error(
            "Storage quota exceeded. Please clear some data to continue.",
            { duration: 5000 },
          );
        } else {
          toast.error("Failed to save portfolio");
        }
      } finally {
        setIsSaving(false);
      }
    }
  }, [portfolio, isLoading, isSaving]);

  // Update marketplace credits when portfolio changes
  const availableCredits = marketplaceCredits.filter(
    (credit) => !portfolio.credits.some((pc) => pc.id === credit.id),
  );

  const handleBuy = (creditId: string) => {
    if (isSaving) {
      toast.error("Please wait for the previous transaction to complete");
      return;
    }

    const credit = marketplaceCredits.find((c) => c.id === creditId);
    if (!credit) {
      toast.error("Credit not found");
      return;
    }

    try {
      const updatedPortfolio = buyCredit(credit, portfolio);
      setPortfolio(updatedPortfolio);
      toast.success(`Successfully purchased ${credit.registryId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to purchase credit");
      }
    }
  };

  const handleSell = (creditId: string) => {
    if (isSaving) {
      toast.error("Please wait for the previous transaction to complete");
      return;
    }

    const credit = portfolio.credits.find((c) => c.id === creditId);
    if (!credit) {
      toast.error("Credit not found in portfolio");
      return;
    }

    try {
      const updatedPortfolio = sellCredit(creditId, portfolio);
      setPortfolio(updatedPortfolio);
      toast.success(`Successfully sold ${credit.registryId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sell credit");
      }
    }
  };

  const handleSelectCredit = (creditId: string) => {
    setSelectedCreditId(creditId);
    const history = getMockPriceHistory(creditId);
    setPriceHistory(history);
  };

  const selectedCredit = marketplaceCredits.find(
    (c) => c.id === selectedCreditId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carbon-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="portfolio">
            Portfolio ({portfolio.credits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <MarketplaceTable
            credits={availableCredits}
            onBuy={handleBuy}
            onSelectCredit={handleSelectCredit}
          />

          <PriceChart
            creditId={selectedCreditId}
            priceHistory={priceHistory}
            creditName={selectedCredit?.projectName}
          />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioDisplay portfolio={portfolio} onSell={handleSell} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
