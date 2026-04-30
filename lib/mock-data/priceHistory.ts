/**
 * Mock price history data for Carbon Trade X MVP
 * 
 * This file generates realistic 30-day price history for all carbon credits
 * with daily granularity and realistic market fluctuations.
 */

import { PriceHistoryPoint } from "@/lib/types";
import { mockCredits } from "./credits";

/**
 * Generate realistic price history for a carbon credit
 * 
 * @param basePrice - The current price per tonne (₹)
 * @param days - Number of days of history to generate (default: 30)
 * @param volatility - Price volatility factor (0-1, default: 0.08 for 8% daily volatility)
 * @param trend - Overall trend direction (-1 to 1, default: 0.02 for slight upward trend)
 * @returns Array of price history points with date and price
 */
export function generatePriceHistory(
    basePrice: number,
    days: number = 30,
    volatility: number = 0.08,
    trend: number = 0.02
): PriceHistoryPoint[] {
    const history: PriceHistoryPoint[] = [];
    const today = new Date();

    // Start from 30 days ago and work forward to today
    let currentPrice = basePrice * (1 - trend * days / 100); // Adjust starting price based on trend

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic daily price movement
        // Combine random walk with slight trend
        const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
        const dailyChange = randomFactor * volatility + (trend / 100);
        currentPrice = currentPrice * (1 + dailyChange);

        // Ensure price doesn't deviate too far from base price (within ±20%)
        currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice));

        history.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
            price: Math.round(currentPrice * 100) / 100, // Round to 2 decimal places
        });
    }

    return history;
}

/**
 * Generate price history with specific characteristics for different credit types
 */
function generateCreditPriceHistory(creditId: string, basePrice: number): PriceHistoryPoint[] {
    // Different credit types have different volatility and trend characteristics
    switch (creditId) {
        // Verra Forestry - High quality, stable with slight upward trend
        case "verra-001":
            return generatePriceHistory(basePrice, 30, 0.05, 0.03);

        // Verra Renewable - Moderate volatility, stable trend
        case "verra-002":
            return generatePriceHistory(basePrice, 30, 0.07, 0.01);

        // Verra Cookstoves - Higher volatility due to smaller market
        case "verra-003":
            return generatePriceHistory(basePrice, 30, 0.10, 0.02);

        // Gold Standard Solar - Premium pricing, low volatility
        case "goldstandard-001":
            return generatePriceHistory(basePrice, 30, 0.04, 0.04);

        // Gold Standard Wind - Stable, slight upward trend
        case "goldstandard-002":
            return generatePriceHistory(basePrice, 30, 0.06, 0.02);

        // Gold Standard Water - Premium, very stable
        case "goldstandard-003":
            return generatePriceHistory(basePrice, 30, 0.03, 0.05);

        // CCTS Afforestation - Moderate volatility, neutral trend
        case "ccts-001":
            return generatePriceHistory(basePrice, 30, 0.08, 0.00);

        // CCTS Energy Efficiency - Higher volatility, slight downward pressure
        case "ccts-002":
            return generatePriceHistory(basePrice, 30, 0.09, -0.01);

        default:
            return generatePriceHistory(basePrice, 30, 0.08, 0.02);
    }
}

/**
 * Map of credit IDs to their 30-day price history
 */
export const mockPriceHistory: Record<string, PriceHistoryPoint[]> = {};

// Generate price history for all mock credits
mockCredits.forEach((credit) => {
    mockPriceHistory[credit.id] = generateCreditPriceHistory(credit.id, credit.pricePerTonne);
});

/**
 * Get price history for a specific credit
 * 
 * @param creditId - The credit ID
 * @returns Array of price history points, or empty array if not found
 */
export function getMockPriceHistory(creditId: string): PriceHistoryPoint[] {
    return mockPriceHistory[creditId] || [];
}

/**
 * Get current price for a credit (most recent price in history)
 * 
 * @param creditId - The credit ID
 * @returns Current price, or null if not found
 */
export function getCurrentPrice(creditId: string): number | null {
    const history = getMockPriceHistory(creditId);
    if (history.length === 0) return null;
    return history[history.length - 1].price;
}

/**
 * Get price change percentage over the last N days
 * 
 * @param creditId - The credit ID
 * @param days - Number of days to calculate change over (default: 7)
 * @returns Price change percentage, or null if insufficient data
 */
export function getPriceChange(creditId: string, days: number = 7): number | null {
    const history = getMockPriceHistory(creditId);
    if (history.length < days + 1) return null;

    const oldPrice = history[history.length - days - 1].price;
    const currentPrice = history[history.length - 1].price;

    return ((currentPrice - oldPrice) / oldPrice) * 100;
}

/**
 * Get price statistics for a credit
 * 
 * @param creditId - The credit ID
 * @returns Object with min, max, average, and current price
 */
export function getPriceStats(creditId: string): {
    min: number;
    max: number;
    average: number;
    current: number;
} | null {
    const history = getMockPriceHistory(creditId);
    if (history.length === 0) return null;

    const prices = history.map(point => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const current = prices[prices.length - 1];

    return {
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        average: Math.round(average * 100) / 100,
        current: Math.round(current * 100) / 100,
    };
}
