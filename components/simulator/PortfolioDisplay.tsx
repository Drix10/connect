"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Portfolio } from "@/lib/types";
import {
  calculateCurrentValue,
  calculateProfitLoss,
  calculateProfitLossPercentage,
} from "@/lib/utils/transactions";

interface PortfolioDisplayProps {
  portfolio: Portfolio;
  onSell: (creditId: string) => void;
}

export function PortfolioDisplay({ portfolio, onSell }: PortfolioDisplayProps) {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(portfolio.totalValue)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Total Volume</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {portfolio.totalVolume.toLocaleString()} tCO₂e
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Holdings</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {portfolio.credits.length}{" "}
            {portfolio.credits.length === 1 ? "Credit" : "Credits"}
          </p>
        </div>
      </div>

      {/* Portfolio Table */}
      {portfolio.credits.length > 0 ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Registry ID</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.credits.map((credit, index) => {
                const currentValue = calculateCurrentValue(
                  credit,
                  credit.pricePerTonne,
                );
                const profitLoss = calculateProfitLoss(
                  credit,
                  credit.pricePerTonne,
                );
                const profitLossPercentage = calculateProfitLossPercentage(
                  credit,
                  credit.pricePerTonne,
                );
                const isProfit = profitLoss >= 0;

                return (
                  <motion.tr
                    key={credit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <TableCell className="font-medium text-primary">
                      {credit.registryId}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {credit.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(credit.purchasePrice)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(credit.pricePerTonne)}
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      {formatCurrency(currentValue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {isProfit ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span
                          className={
                            isProfit ? "text-success" : "text-destructive"
                          }
                        >
                          {formatPercentage(profitLossPercentage)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSell(credit.id)}
                      >
                        Sell
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/30">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-foreground mb-2 font-medium">
            Your portfolio is empty
          </p>
          <p className="text-sm text-muted-foreground">
            Buy credits from the marketplace to start building your portfolio
          </p>
        </div>
      )}

      {/* Registry Badges */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          Verra
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          Gold Standard
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          CAD Trust
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
          CCTS
        </div>
      </div>
    </div>
  );
}
