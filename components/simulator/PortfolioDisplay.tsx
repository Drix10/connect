"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
        <CardDescription>
          Track your carbon credit holdings and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-carbon-green-400" />
              <p className="text-sm text-gray-400">Total Value</p>
            </div>
            <p className="text-2xl font-bold text-carbon-green-400">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Total Volume</p>
            <p className="text-2xl font-bold text-gray-200">
              {portfolio.totalVolume.toLocaleString()} tCO₂e
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Holdings</p>
            <p className="text-2xl font-bold text-gray-200">
              {portfolio.credits.length}{" "}
              {portfolio.credits.length === 1 ? "Credit" : "Credits"}
            </p>
          </div>
        </div>

        {/* Portfolio Table */}
        {portfolio.credits.length > 0 ? (
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900/50 hover:bg-gray-900/50">
                  <TableHead>Registry ID</TableHead>
                  <TableHead>Quantity (tCO₂e)</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Current Value</TableHead>
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
                      className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                    >
                      <TableCell className="font-medium text-carbon-green-400">
                        {credit.registryId}
                      </TableCell>
                      <TableCell>{credit.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        {formatCurrency(credit.purchasePrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(credit.pricePerTonne)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(currentValue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isProfit ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={
                              isProfit ? "text-green-400" : "text-red-400"
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
          <div className="p-8 text-center border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500 mb-2">Your portfolio is empty</p>
            <p className="text-sm text-gray-600">
              Buy credits from the marketplace to start building your portfolio
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
