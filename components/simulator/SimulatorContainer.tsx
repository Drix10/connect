"use client";

import {
  useState,
  useEffect,
  lazy,
  Suspense,
  Component,
  ReactNode,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MarketplaceTable } from "./MarketplaceTable";
import { PortfolioDisplay } from "./PortfolioDisplay";
import { Portfolio, CarbonCredit, PriceHistoryPoint } from "@/lib/types";
import { buyCredit, sellCredit } from "@/lib/utils/transactions";
import { getDemoCredits } from "@/lib/demo-data/credits";
import { getDemoPriceHistory } from "@/lib/demo-data/priceHistory";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

// FIXED: Error boundary for lazy-loaded components
class ChartErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Chart loading error:", error);
    toast.error("Failed to load price chart");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[250px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load chart</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load the heavy PriceChart component (recharts is ~1000 modules)
const PriceChart = lazy(() =>
  import("./PriceChart").then((mod) => ({ default: mod.PriceChart })),
);

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPortfolio(JSON.parse(stored));
      }
      const allCredits = getDemoCredits();
      setMarketplaceCredits(allCredits);

      if (allCredits.length > 0) {
        const firstCreditId = allCredits[0].id;
        setSelectedCreditId(firstCreditId);
        setPriceHistory(getDemoPriceHistory(firstCreditId));
      }
    } catch (error) {
      console.error("Failed to initialize simulator:", error);
      toast.error("Failed to load simulator data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
      console.error("Failed to save portfolio:", error);
      toast.error("Failed to save portfolio. Storage might be full.");
    }
  }, [portfolio, isLoading]);

  const handleBuy = (creditId: string) => {
    const credit = marketplaceCredits.find((c) => c.id === creditId);
    if (!credit) {
      toast.error("Credit not found in marketplace.");
      return;
    }
    try {
      setPortfolio(buyCredit(credit, portfolio));
      toast.success(`Successfully purchased 1 tonne of ${credit.registryId}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to purchase credit.",
      );
    }
  };

  const handleSell = (creditId: string) => {
    const credit = portfolio.credits.find((c) => c.id === creditId);
    if (!credit) {
      toast.error("Credit not found in your portfolio.");
      return;
    }
    try {
      setPortfolio(sellCredit(creditId, portfolio));
      toast.success(`Successfully sold 1 tonne of ${credit.registryId}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sell credit.",
      );
    }
  };

  const handleSelectCredit = (creditId: string) => {
    setSelectedCreditId(creditId);
    setPriceHistory(getDemoPriceHistory(creditId));
  };

  const selectedCredit = marketplaceCredits.find(
    (c) => c.id === selectedCreditId,
  );
  const availableCredits = marketplaceCredits.filter(
    (credit) => !portfolio.credits.some((pc) => pc.id === credit.id),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Marketplace - Takes 2 columns */}
      <div className="lg:col-span-2">
        <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
          <CardHeader className="border-b border-border px-8 py-6">
            <CardTitle className="heading-display text-2xl text-white">
              Marketplace
            </CardTitle>
            <CardDescription className="text-base">
              Browse and purchase verified carbon credits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <MarketplaceTable
              credits={availableCredits}
              onBuy={handleBuy}
              onSelectCredit={handleSelectCredit}
              selectedCreditId={selectedCreditId}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right sidebar - Price Chart and Portfolio */}
      <div className="space-y-6">
        {/* Price Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
          <CardHeader className="border-b border-border px-6 py-5">
            <CardTitle className="heading-display text-xl text-white">
              Price Chart
            </CardTitle>
            <CardDescription className="truncate text-sm">
              {selectedCredit?.projectName ||
                "Select a credit to view price history"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartErrorBoundary>
              <Suspense
                fallback={
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <PriceChart
                  creditId={selectedCreditId}
                  priceHistory={priceHistory}
                />
              </Suspense>
            </ChartErrorBoundary>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
          <CardHeader className="border-b border-border px-6 py-5">
            <CardTitle className="heading-display text-xl text-white">
              My Portfolio
            </CardTitle>
            <CardDescription className="text-sm">
              Your carbon credit holdings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PortfolioDisplay portfolio={portfolio} onSell={handleSell} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
