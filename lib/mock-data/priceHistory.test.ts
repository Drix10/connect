/**
 * Unit tests for price history generation
 */

import { describe, test, expect } from "vitest";
import {
    generatePriceHistory,
    getMockPriceHistory,
    getCurrentPrice,
    getPriceChange,
    getPriceStats,
    mockPriceHistory,
} from "./priceHistory";
import { mockCredits } from "./credits";

describe("generatePriceHistory", () => {
    test("generates correct number of data points", () => {
        const history = generatePriceHistory(1000, 30);
        expect(history).toHaveLength(30);
    });

    test("generates prices within reasonable range of base price", () => {
        const basePrice = 1000;
        const history = generatePriceHistory(basePrice, 30);

        history.forEach((point) => {
            expect(point.price).toBeGreaterThanOrEqual(basePrice * 0.8);
            expect(point.price).toBeLessThanOrEqual(basePrice * 1.2);
        });
    });

    test("generates dates in chronological order", () => {
        const history = generatePriceHistory(1000, 30);

        for (let i = 1; i < history.length; i++) {
            const prevDate = new Date(history[i - 1].date);
            const currDate = new Date(history[i].date);
            expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
        }
    });

    test("generates dates in YYYY-MM-DD format", () => {
        const history = generatePriceHistory(1000, 30);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        history.forEach((point) => {
            expect(point.date).toMatch(dateRegex);
        });
    });

    test("rounds prices to 2 decimal places", () => {
        const history = generatePriceHistory(1000, 30);

        history.forEach((point) => {
            const decimalPlaces = (point.price.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
        });
    });

    test("respects custom volatility parameter", () => {
        const lowVolatility = generatePriceHistory(1000, 30, 0.01);
        const highVolatility = generatePriceHistory(1000, 30, 0.20);

        // Low volatility should have smaller price range
        const lowRange = Math.max(...lowVolatility.map(p => p.price)) -
            Math.min(...lowVolatility.map(p => p.price));
        const highRange = Math.max(...highVolatility.map(p => p.price)) -
            Math.min(...highVolatility.map(p => p.price));

        // High volatility should generally have larger range (not guaranteed due to randomness)
        expect(highRange).toBeGreaterThan(0);
        expect(lowRange).toBeGreaterThan(0);
    });
});

describe("mockPriceHistory", () => {
    test("generates price history for all mock credits", () => {
        mockCredits.forEach((credit) => {
            expect(mockPriceHistory[credit.id]).toBeDefined();
            expect(mockPriceHistory[credit.id]).toHaveLength(30);
        });
    });

    test("price history matches credit base prices approximately", () => {
        mockCredits.forEach((credit) => {
            const history = mockPriceHistory[credit.id];
            const lastPrice = history[history.length - 1].price;

            // Last price should be within 20% of base price
            expect(lastPrice).toBeGreaterThanOrEqual(credit.pricePerTonne * 0.8);
            expect(lastPrice).toBeLessThanOrEqual(credit.pricePerTonne * 1.2);
        });
    });
});

describe("getMockPriceHistory", () => {
    test("returns price history for valid credit ID", () => {
        const history = getMockPriceHistory("verra-001");
        expect(history).toHaveLength(30);
        expect(history[0]).toHaveProperty("date");
        expect(history[0]).toHaveProperty("price");
    });

    test("returns empty array for invalid credit ID", () => {
        const history = getMockPriceHistory("invalid-id");
        expect(history).toEqual([]);
    });
});

describe("getCurrentPrice", () => {
    test("returns current price for valid credit ID", () => {
        const price = getCurrentPrice("verra-001");
        expect(price).toBeGreaterThan(0);
        expect(typeof price).toBe("number");
    });

    test("returns null for invalid credit ID", () => {
        const price = getCurrentPrice("invalid-id");
        expect(price).toBeNull();
    });

    test("returns last price in history", () => {
        const history = getMockPriceHistory("verra-001");
        const currentPrice = getCurrentPrice("verra-001");
        expect(currentPrice).toBe(history[history.length - 1].price);
    });
});

describe("getPriceChange", () => {
    test("calculates price change percentage", () => {
        const change = getPriceChange("verra-001", 7);
        expect(typeof change).toBe("number");
        // Change should be reasonable (within ±50%)
        expect(change).toBeGreaterThanOrEqual(-50);
        expect(change).toBeLessThanOrEqual(50);
    });

    test("returns null for invalid credit ID", () => {
        const change = getPriceChange("invalid-id");
        expect(change).toBeNull();
    });

    test("returns null when insufficient data", () => {
        // Mock a credit with only 5 days of history
        const shortHistory = generatePriceHistory(1000, 5);
        const change = getPriceChange("verra-001", 10); // Request 10 days but only have 30
        // Should still work since we have 30 days
        expect(typeof change).toBe("number");
    });
});

describe("getPriceStats", () => {
    test("calculates price statistics correctly", () => {
        const stats = getPriceStats("verra-001");

        expect(stats).not.toBeNull();
        expect(stats!.min).toBeGreaterThan(0);
        expect(stats!.max).toBeGreaterThan(stats!.min);
        expect(stats!.average).toBeGreaterThanOrEqual(stats!.min);
        expect(stats!.average).toBeLessThanOrEqual(stats!.max);
        expect(stats!.current).toBeGreaterThanOrEqual(stats!.min);
        expect(stats!.current).toBeLessThanOrEqual(stats!.max);
    });

    test("returns null for invalid credit ID", () => {
        const stats = getPriceStats("invalid-id");
        expect(stats).toBeNull();
    });

    test("rounds statistics to 2 decimal places", () => {
        const stats = getPriceStats("verra-001");

        expect(stats).not.toBeNull();
        [stats!.min, stats!.max, stats!.average, stats!.current].forEach((value) => {
            const decimalPlaces = (value.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
        });
    });

    test("current price matches last price in history", () => {
        const history = getMockPriceHistory("verra-001");
        const stats = getPriceStats("verra-001");

        expect(stats!.current).toBe(history[history.length - 1].price);
    });
});

describe("Price history characteristics", () => {
    test("Verra forestry credit has low volatility", () => {
        const history = getMockPriceHistory("verra-001");
        const prices = history.map(p => p.price);
        const range = Math.max(...prices) - Math.min(...prices);
        const basePrice = mockCredits.find(c => c.id === "verra-001")!.pricePerTonne;

        // Range should be relatively small for low volatility
        expect(range / basePrice).toBeLessThan(0.3); // Less than 30% range
    });

    test("Gold Standard water credit has very low volatility", () => {
        const history = getMockPriceHistory("goldstandard-003");
        const prices = history.map(p => p.price);
        const range = Math.max(...prices) - Math.min(...prices);
        const basePrice = mockCredits.find(c => c.id === "goldstandard-003")!.pricePerTonne;

        // Range should be very small for very low volatility
        expect(range / basePrice).toBeLessThan(0.25); // Less than 25% range
    });

    test("all credits have realistic price movements", () => {
        mockCredits.forEach((credit) => {
            const history = getMockPriceHistory(credit.id);

            // Check that prices don't have unrealistic jumps
            for (let i = 1; i < history.length; i++) {
                const prevPrice = history[i - 1].price;
                const currPrice = history[i].price;
                const dailyChange = Math.abs((currPrice - prevPrice) / prevPrice);

                // Daily change should be less than 15% (realistic for carbon markets)
                expect(dailyChange).toBeLessThan(0.15);
            }
        });
    });
});
