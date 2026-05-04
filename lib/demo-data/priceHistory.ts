/**
 * Demo Price History Data
 * 
 * Realistic price history for carbon credits
 */

import { PriceHistoryPoint } from "@/lib/types";

/**
 * A simple seeded pseudo-random number generator (PRNG) to ensure deterministic output.
 * This is the mulberry32 algorithm.
 * @param a The seed.
 * @returns A function that returns a random number between 0 and 1.
 */
function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Generate realistic price history for a credit
 */
function generatePriceHistory(
    basePrice: number,
    volatility: number = 0.05,
    days: number = 90,
    seed: number = 1
): PriceHistoryPoint[] {
    const history: PriceHistoryPoint[] = [];
    const today = new Date();
    let currentPrice = basePrice * 0.9; // Start 10% lower
    const rand = mulberry32(seed);

    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Add some realistic price movement
        const change = (rand() - 0.48) * volatility * currentPrice;
        currentPrice = Math.max(currentPrice + change, basePrice * 0.7);

        // Trend towards current price
        const trendFactor = 1 - (i / days);
        currentPrice = currentPrice * (1 - trendFactor * 0.001) + basePrice * trendFactor * 0.001;

        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(currentPrice),
        });
    }

    return history;
}

/**
 * Price history for all demo credits
 */
export const demoPriceHistory: Record<string, PriceHistoryPoint[]> = {
    "verra-001": generatePriceHistory(850, 0.06, 90, 1),
    "verra-002": generatePriceHistory(720, 0.05, 90, 2),
    "verra-003": generatePriceHistory(950, 0.07, 90, 3),
    "goldstandard-001": generatePriceHistory(1100, 0.06, 90, 4),
    "goldstandard-002": generatePriceHistory(780, 0.05, 90, 5),
    "goldstandard-003": generatePriceHistory(1250, 0.08, 90, 6),
    "ccts-001": generatePriceHistory(680, 0.06, 90, 7),
    "ccts-002": generatePriceHistory(590, 0.05, 90, 8),
};

/**
 * Get price history for a specific credit
 */
export function getDemoPriceHistory(creditId: string): PriceHistoryPoint[] {
    return demoPriceHistory[creditId] || [];
}