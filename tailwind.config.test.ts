import { describe, test, expect } from "vitest";
import tailwindConfig from "./tailwind.config";

describe("Tailwind Configuration", () => {
    test("should have carbon-green color palette defined", () => {
        const colors = tailwindConfig.theme?.extend?.colors;
        expect(colors).toBeDefined();

        // @ts-ignore - accessing extended colors
        const carbonGreen = colors?.["carbon-green"];
        expect(carbonGreen).toBeDefined();
        expect(carbonGreen.DEFAULT).toBe("#10b981");
        expect(carbonGreen[500]).toBe("#10b981");
    });

    test("should have forest-green (secondary) color palette defined", () => {
        const colors = tailwindConfig.theme?.extend?.colors;

        // @ts-ignore - accessing extended colors
        const forestGreen = colors?.["forest-green"];
        expect(forestGreen).toBeDefined();
        expect(forestGreen.DEFAULT).toBe("#166534");
        expect(forestGreen[700]).toBe("#166534");
    });

    test("should have dark mode configured as class-based", () => {
        expect(tailwindConfig.darkMode).toEqual(["class"]);
    });

    test("should have responsive breakpoints configured", () => {
        const screens = tailwindConfig.theme?.extend?.screens;
        expect(screens).toBeDefined();
        expect(screens).toHaveProperty("xs", "475px");
        expect(screens).toHaveProperty("sm", "640px");
        expect(screens).toHaveProperty("md", "768px");
        expect(screens).toHaveProperty("lg", "1024px");
        expect(screens).toHaveProperty("xl", "1280px");
        expect(screens).toHaveProperty("2xl", "1536px");
    });

    test("should have content paths configured", () => {
        expect(tailwindConfig.content).toContain("./pages/**/*.{js,ts,jsx,tsx,mdx}");
        expect(tailwindConfig.content).toContain("./components/**/*.{js,ts,jsx,tsx,mdx}");
        expect(tailwindConfig.content).toContain("./app/**/*.{js,ts,jsx,tsx,mdx}");
    });

    test("should have tailwindcss-animate plugin configured", () => {
        expect(tailwindConfig.plugins).toBeDefined();
        expect(tailwindConfig.plugins).toHaveLength(1);
    });

    test("should have border radius variables configured", () => {
        const borderRadius = tailwindConfig.theme?.extend?.borderRadius;
        expect(borderRadius).toBeDefined();
        expect(borderRadius).toHaveProperty("lg", "var(--radius)");
        expect(borderRadius).toHaveProperty("md", "calc(var(--radius) - 2px)");
        expect(borderRadius).toHaveProperty("sm", "calc(var(--radius) - 4px)");
    });
});
