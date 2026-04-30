/**
 * Unit tests for mock carbon credit data
 * 
 * Validates that all mock credits and projects are properly structured
 * and that accessor functions work correctly.
 */

import { describe, test, expect } from "vitest";
import {
    mockCredits,
    mockProjects,
    mockProjectsByRegistryId,
    getMockProject,
    getMockCredit,
    getMockProjectByRegistryId,
} from "./credits";

describe("Mock Carbon Credits", () => {
    test("should have exactly 8 credits", () => {
        expect(mockCredits).toHaveLength(8);
    });

    test("should have 3 Verra VCUs", () => {
        const verraCredits = mockCredits.filter((c) => c.registry === "Verra");
        expect(verraCredits).toHaveLength(3);
    });

    test("should have 3 Gold Standard VERs", () => {
        const gsCredits = mockCredits.filter((c) => c.registry === "GoldStandard");
        expect(gsCredits).toHaveLength(3);
    });

    test("should have 2 CCTS CCCs", () => {
        const cctsCredits = mockCredits.filter((c) => c.registry === "CCTS");
        expect(cctsCredits).toHaveLength(2);
    });

    test("all credits should have complete required fields", () => {
        mockCredits.forEach((credit) => {
            expect(credit.id).toBeTruthy();
            expect(credit.registryId).toBeTruthy();
            expect(credit.registry).toBeTruthy();
            expect(credit.projectName).toBeTruthy();
            expect(credit.projectUid).toBeTruthy();
            expect(credit.location).toBeTruthy();
            expect(credit.methodology).toBeTruthy();
            expect(credit.vintage).toBeGreaterThan(2000);
            expect(credit.issuanceDate).toBeTruthy();
            expect(credit.volume).toBeGreaterThan(0);
            expect(credit.pricePerTonne).toBeGreaterThan(0);
            expect(credit.qualityScore).toBeGreaterThanOrEqual(0);
            expect(credit.qualityScore).toBeLessThanOrEqual(100);
            expect(credit.status).toBe("available");
        });
    });

    test("Verra credits should include forestry, renewable energy, and cookstoves", () => {
        const verraCredits = mockCredits.filter((c) => c.registry === "Verra");
        const projectTypes = verraCredits.map((c) => c.projectName.toLowerCase());

        const hasForestry = projectTypes.some((name) =>
            name.includes("forest") || name.includes("redd")
        );
        const hasRenewable = projectTypes.some((name) =>
            name.includes("solar") || name.includes("renewable")
        );
        const hasCookstoves = projectTypes.some((name) =>
            name.includes("cookstove")
        );

        expect(hasForestry).toBe(true);
        expect(hasRenewable).toBe(true);
        expect(hasCookstoves).toBe(true);
    });

    test("Gold Standard credits should include solar, wind, and water purification", () => {
        const gsCredits = mockCredits.filter((c) => c.registry === "GoldStandard");
        const projectTypes = gsCredits.map((c) => c.projectName.toLowerCase());

        const hasSolar = projectTypes.some((name) => name.includes("solar"));
        const hasWind = projectTypes.some((name) => name.includes("wind"));
        const hasWater = projectTypes.some((name) =>
            name.includes("water") || name.includes("purification")
        );

        expect(hasSolar).toBe(true);
        expect(hasWind).toBe(true);
        expect(hasWater).toBe(true);
    });

    test("CCTS credits should include afforestation and energy efficiency", () => {
        const cctsCredits = mockCredits.filter((c) => c.registry === "CCTS");
        const projectTypes = cctsCredits.map((c) => c.projectName.toLowerCase());

        const hasAfforestation = projectTypes.some((name) =>
            name.includes("afforestation") || name.includes("forest")
        );
        const hasEnergyEfficiency = projectTypes.some((name) =>
            name.includes("energy efficiency") || name.includes("efficiency")
        );

        expect(hasAfforestation).toBe(true);
        expect(hasEnergyEfficiency).toBe(true);
    });
});

describe("Mock CADTrust Projects", () => {
    test("should have 8 projects in mockProjects map", () => {
        expect(Object.keys(mockProjects)).toHaveLength(8);
    });

    test("should have 8 projects in mockProjectsByRegistryId map", () => {
        expect(Object.keys(mockProjectsByRegistryId)).toHaveLength(8);
    });

    test("all projects should have complete CADTrustProject structure", () => {
        Object.values(mockProjects).forEach((project) => {
            expect(project.projectId).toBeTruthy();
            expect(project.projectName).toBeTruthy();
            expect(project.projectLink).toBeTruthy();
            expect(project.projectStatus).toBeTruthy();
            expect(project.projectStatusDate).toBeTruthy();
            expect(project.registryOfOrigin).toBeTruthy();
            expect(project.originProjectId).toBeTruthy();
            expect(project.program).toBeTruthy();
            expect(project.projectType).toBeTruthy();
            expect(project.coveredByNDC).toBeTruthy();
            expect(project.ndcInformation).toBeTruthy();
            expect(project.projectScale).toBeTruthy();
            expect(project.projectTags).toBeTruthy();
            expect(project.estimatedAnnualEmissionReductions).toBeGreaterThan(0);
            expect(project.location).toBeTruthy();
            expect(project.methodology).toBeTruthy();
            expect(project.validationBody).toBeTruthy();
            expect(project.validationDate).toBeTruthy();
        });
    });

    test("project links should match registry origin", () => {
        Object.values(mockProjects).forEach((project) => {
            if (project.registryOfOrigin === "Verra") {
                expect(project.projectLink).toContain("verra.org");
            } else if (project.registryOfOrigin === "Gold Standard") {
                expect(project.projectLink).toContain("goldstandard.org");
            } else if (project.registryOfOrigin === "CCTS") {
                expect(project.projectLink).toContain("ccts.gov.in");
            }
        });
    });
});

describe("Mock Data Accessor Functions", () => {
    test("getMockProject should return project by UID", () => {
        const project = getMockProject("verra-vcs-934");
        expect(project).toBeTruthy();
        expect(project?.projectId).toBe("verra-vcs-934");
        expect(project?.projectName).toContain("Rimba Raya");
    });

    test("getMockProject should return null for non-existent UID", () => {
        const project = getMockProject("non-existent-uid");
        expect(project).toBeNull();
    });

    test("getMockCredit should return credit by registry ID", () => {
        const credit = getMockCredit("VCS-934");
        expect(credit).toBeTruthy();
        expect(credit?.registryId).toBe("VCS-934");
        expect(credit?.registry).toBe("Verra");
    });

    test("getMockCredit should return null for non-existent registry ID", () => {
        const credit = getMockCredit("NON-EXISTENT");
        expect(credit).toBeNull();
    });

    test("getMockProjectByRegistryId should return project by registry ID", () => {
        const project = getMockProjectByRegistryId("GS-7845");
        expect(project).toBeTruthy();
        expect(project?.originProjectId).toBe("GS-7845");
        expect(project?.registryOfOrigin).toBe("Gold Standard");
    });

    test("getMockProjectByRegistryId should return null for non-existent registry ID", () => {
        const project = getMockProjectByRegistryId("NON-EXISTENT");
        expect(project).toBeNull();
    });

    test("all credits should have corresponding projects", () => {
        mockCredits.forEach((credit) => {
            const projectByUid = getMockProject(credit.projectUid!);
            const projectByRegistryId = getMockProjectByRegistryId(credit.registryId);

            expect(projectByUid).toBeTruthy();
            expect(projectByRegistryId).toBeTruthy();
            expect(projectByUid?.projectId).toBe(credit.projectUid);
            expect(projectByRegistryId?.originProjectId).toBe(credit.registryId);
        });
    });
});

describe("Data Quality Validation", () => {
    test("quality scores should be within valid range", () => {
        mockCredits.forEach((credit) => {
            expect(credit.qualityScore).toBeGreaterThanOrEqual(0);
            expect(credit.qualityScore).toBeLessThanOrEqual(100);
        });
    });

    test("prices should be realistic (between ₹500-₹1500 per tonne)", () => {
        mockCredits.forEach((credit) => {
            expect(credit.pricePerTonne).toBeGreaterThanOrEqual(500);
            expect(credit.pricePerTonne).toBeLessThanOrEqual(1500);
        });
    });

    test("volumes should be realistic (> 100,000 tCO₂e)", () => {
        mockCredits.forEach((credit) => {
            expect(credit.volume).toBeGreaterThan(100000);
        });
    });

    test("vintages should be recent (2023 or 2024)", () => {
        mockCredits.forEach((credit) => {
            expect(credit.vintage).toBeGreaterThanOrEqual(2023);
            expect(credit.vintage).toBeLessThanOrEqual(2024);
        });
    });

    test("issuance dates should match ISO 8601 format", () => {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        mockCredits.forEach((credit) => {
            expect(credit.issuanceDate).toMatch(isoDateRegex);
        });
    });

    test("validation dates should match ISO 8601 format", () => {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        Object.values(mockProjects).forEach((project) => {
            expect(project.validationDate).toMatch(isoDateRegex);
        });
    });
});
