"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarbonCredit } from "@/lib/types";

interface MarketplaceTableProps {
  credits: CarbonCredit[];
  onBuy: (creditId: string) => void;
  onSelectCredit: (creditId: string) => void;
}

type SortField = "price" | "volume" | "qualityScore";

export function MarketplaceTable({
  credits,
  onBuy,
  onSelectCredit,
}: MarketplaceTableProps) {
  const [sortField, setSortField] = useState<SortField>("qualityScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedCredits = [...credits].sort((a, b) => {
    let aValue: number, bValue: number;

    switch (sortField) {
      case "price":
        aValue = a.pricePerTonne;
        bValue = b.pricePerTonne;
        break;
      case "volume":
        aValue = a.volume;
        bValue = b.volume;
        break;
      case "qualityScore":
        aValue = a.qualityScore;
        bValue = b.qualityScore;
        break;
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const getQualityColor = (score: number) => {
    if (score >= 85)
      return "bg-carbon-green-500/20 text-carbon-green-400 border-carbon-green-700";
    if (score >= 70) return "bg-blue-500/20 text-blue-400 border-blue-700";
    if (score >= 50)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-700";
    return "bg-red-500/20 text-red-400 border-red-700";
  };

  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-900/50 hover:bg-gray-900/50">
            <TableHead>Registry ID</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("price")}
                className="flex items-center gap-1 hover:text-carbon-green-400 transition-colors"
              >
                Price (₹/tCO₂e)
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("volume")}
                className="flex items-center gap-1 hover:text-carbon-green-400 transition-colors"
              >
                Volume (tCO₂e)
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("qualityScore")}
                className="flex items-center gap-1 hover:text-carbon-green-400 transition-colors"
              >
                Quality Score
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCredits.map((credit, index) => (
            <motion.tr
              key={credit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors cursor-pointer"
              onClick={() => onSelectCredit(credit.id)}
            >
              <TableCell className="font-medium text-carbon-green-400">
                {credit.registryId}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {credit.projectName}
              </TableCell>
              <TableCell>₹{credit.pricePerTonne.toLocaleString()}</TableCell>
              <TableCell>{credit.volume.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getQualityColor(credit.qualityScore)}
                >
                  {credit.qualityScore}/100
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuy(credit.id);
                  }}
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {sortedCredits.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No credits available in marketplace
        </div>
      )}
    </div>
  );
}
