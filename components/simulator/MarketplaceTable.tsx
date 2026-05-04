"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

interface MarketplaceTableProps {
  credits: CarbonCredit[];
  onBuy: (creditId: string) => void;
  onSelectCredit: (creditId: string) => void;
  selectedCreditId: string | null;
}

type SortField = "pricePerTonne" | "volume" | "qualityScore";

export function MarketplaceTable({
  credits,
  onBuy,
  onSelectCredit,
  selectedCreditId,
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
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const getQualityColor = (score: number) => {
    if (score >= 90) return "accent";
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50 hover:bg-background/50 border-b-border">
            <TableHead>Project</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("pricePerTonne")}
                className="px-0"
              >
                Price <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("volume")}
                className="px-0"
              >
                Volume <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("qualityScore")}
                className="px-0"
              >
                Quality <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCredits.map((credit) => (
            <TableRow
              key={credit.id}
              className={cn(
                "border-b-border hover:bg-background/30 transition-colors cursor-pointer",
                selectedCreditId === credit.id && "bg-primary/10",
              )}
              onClick={() => onSelectCredit(credit.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCredit(credit.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Select ${credit.projectName}`}
            >
              <TableCell>
                <div className="font-medium text-foreground">
                  {credit.projectName}
                </div>
                <div className="text-sm text-foreground/80">
                  {credit.registryId}
                </div>
              </TableCell>
              <TableCell>₹{credit.pricePerTonne.toLocaleString()}</TableCell>
              <TableCell>{credit.volume.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={getQualityColor(credit.qualityScore)}>
                  {credit.qualityScore}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuy(credit.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onBuy(credit.id);
                    }
                  }}
                  className="gap-2 bg-primary/90 hover:bg-primary text-primary-foreground"
                  aria-label={`Buy ${credit.projectName}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sortedCredits.length === 0 && (
        <div className="p-8 text-center text-foreground/60">
          No credits available in the marketplace.
        </div>
      )}
    </div>
  );
}
