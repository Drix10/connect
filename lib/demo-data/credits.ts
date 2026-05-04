/**
 * Demo Carbon Credit Data
 * 
 * Comprehensive demo data for carbon credits from various registries
 */

import { CarbonCredit, CADTrustProject } from "@/lib/types";

// ============================================================================
// Verra VCU Credits (3)
// ============================================================================

export const verraForestryCredit: CarbonCredit = {
    id: "verra-001",
    registryId: "VCS-934",
    registry: "Verra",
    projectName: "Rimba Raya Biodiversity Reserve REDD+ Project",
    projectUid: "verra-vcs-934",
    location: "Central Kalimantan, Indonesia",
    methodology: "VM0015 - Methodology for Avoided Unplanned Deforestation",
    vintage: 2023,
    issuanceDate: "2023-06-15",
    volume: 2500000,
    pricePerTonne: 850,
    qualityScore: 92,
    status: "available",
};

export const verraForestryProject: CADTrustProject = {
    projectId: "verra-vcs-934",
    projectName: "Rimba Raya Biodiversity Reserve REDD+ Project",
    projectLink: "https://registry.verra.org/app/projectDetail/VCS/934",
    projectStatus: "Active",
    projectStatusDate: "2023-06-15",
    registryOfOrigin: "Verra",
    originProjectId: "VCS-934",
    program: "Verified Carbon Standard (VCS)",
    projectType: "REDD+ (Reducing Emissions from Deforestation and Degradation)",
    coveredByNDC: "No",
    ndcInformation: "Project credits are not used toward Indonesia's NDC targets",
    projectScale: "Large",
    projectTags: "Forestry, Biodiversity, Community Benefits, REDD+",
    estimatedAnnualEmissionReductions: 3500000,
    location: "Central Kalimantan, Indonesia",
    methodology: "VM0015 - Methodology for Avoided Unplanned Deforestation",
    validationBody: "SCS Global Services",
    validationDate: "2011-08-12",
};

export const verraRenewableCredit: CarbonCredit = {
    id: "verra-002",
    registryId: "VCS-1764",
    registry: "Verra",
    projectName: "Bhadla Solar Park Phase II",
    projectUid: "verra-vcs-1764",
    location: "Rajasthan, India",
    methodology: "ACM0002 - Grid-connected electricity generation from renewable sources",
    vintage: 2024,
    issuanceDate: "2024-01-20",
    volume: 1800000,
    pricePerTonne: 720,
    qualityScore: 88,
    status: "available",
};

export const verraRenewableProject: CADTrustProject = {
    projectId: "verra-vcs-1764",
    projectName: "Bhadla Solar Park Phase II",
    projectLink: "https://registry.verra.org/app/projectDetail/VCS/1764",
    projectStatus: "Active",
    projectStatusDate: "2024-01-20",
    registryOfOrigin: "Verra",
    originProjectId: "VCS-1764",
    program: "Verified Carbon Standard (VCS)",
    projectType: "Renewable Energy - Solar",
    coveredByNDC: "Yes",
    ndcInformation: "Contributes to India's renewable energy targets under NDC",
    projectScale: "Large",
    projectTags: "Solar Energy, Grid-connected, Renewable Energy, India",
    estimatedAnnualEmissionReductions: 2100000,
    location: "Rajasthan, India",
    methodology: "ACM0002 - Grid-connected electricity generation from renewable sources",
    validationBody: "TÜV SÜD",
    validationDate: "2018-03-15",
};

export const verraCookstovesCredit: CarbonCredit = {
    id: "verra-003",
    registryId: "VCS-2112",
    registry: "Verra",
    projectName: "Improved Cookstoves Distribution in Rural Karnataka",
    projectUid: "verra-vcs-2112",
    location: "Karnataka, India",
    methodology: "AMS-II.G - Energy efficiency measures in thermal applications of non-renewable biomass",
    vintage: 2023,
    issuanceDate: "2023-09-10",
    volume: 450000,
    pricePerTonne: 950,
    qualityScore: 85,
    status: "available",
};

export const verraCookstovesProject: CADTrustProject = {
    projectId: "verra-vcs-2112",
    projectName: "Improved Cookstoves Distribution in Rural Karnataka",
    projectLink: "https://registry.verra.org/app/projectDetail/VCS/2112",
    projectStatus: "Active",
    projectStatusDate: "2023-09-10",
    registryOfOrigin: "Verra",
    originProjectId: "VCS-2112",
    program: "Verified Carbon Standard (VCS)",
    projectType: "Energy Efficiency - Household",
    coveredByNDC: "No",
    ndcInformation: "Independent project not counted toward national targets",
    projectScale: "Medium",
    projectTags: "Cookstoves, Energy Efficiency, Health Benefits, Women Empowerment",
    estimatedAnnualEmissionReductions: 180000,
    location: "Karnataka, India",
    methodology: "AMS-II.G - Energy efficiency measures in thermal applications of non-renewable biomass",
    validationBody: "Earthood Services",
    validationDate: "2019-11-22",
};

// ============================================================================
// Gold Standard VER Credits (3)
// ============================================================================

export const goldStandardSolarCredit: CarbonCredit = {
    id: "goldstandard-001",
    registryId: "GS-7845",
    registry: "GoldStandard",
    projectName: "Solar Home Systems for Rural Electrification - Tamil Nadu",
    projectUid: "goldstandard-gs-7845",
    location: "Tamil Nadu, India",
    methodology: "GS Methodology for Solar Home Systems",
    vintage: 2024,
    issuanceDate: "2024-02-05",
    volume: 320000,
    pricePerTonne: 1100,
    qualityScore: 94,
    status: "available",
};

export const goldStandardSolarProject: CADTrustProject = {
    projectId: "goldstandard-gs-7845",
    projectName: "Solar Home Systems for Rural Electrification - Tamil Nadu",
    projectLink: "https://registry.goldstandard.org/projects/details/7845",
    projectStatus: "Active",
    projectStatusDate: "2024-02-05",
    registryOfOrigin: "GoldStandard",
    originProjectId: "GS-7845",
    program: "Gold Standard for the Global Goals",
    projectType: "Renewable Energy - Solar Photovoltaic",
    coveredByNDC: "No",
    ndcInformation: "Voluntary project with SDG co-benefits",
    projectScale: "Medium",
    projectTags: "Solar, Off-grid, Rural Electrification, SDG 7, SDG 13",
    estimatedAnnualEmissionReductions: 125000,
    location: "Tamil Nadu, India",
    methodology: "GS Methodology for Solar Home Systems",
    validationBody: "SGS United Kingdom Ltd",
    validationDate: "2020-07-18",
};

export const goldStandardWindCredit: CarbonCredit = {
    id: "goldstandard-002",
    registryId: "GS-6234",
    registry: "GoldStandard",
    projectName: "Jaisalmer Wind Power Project",
    projectUid: "goldstandard-gs-6234",
    location: "Rajasthan, India",
    methodology: "ACM0002 - Grid-connected electricity generation from renewable sources",
    vintage: 2023,
    issuanceDate: "2023-11-12",
    volume: 1200000,
    pricePerTonne: 780,
    qualityScore: 90,
    status: "available",
};

export const goldStandardWindProject: CADTrustProject = {
    projectId: "goldstandard-gs-6234",
    projectName: "Jaisalmer Wind Power Project",
    projectLink: "https://registry.goldstandard.org/projects/details/6234",
    projectStatus: "Active",
    projectStatusDate: "2023-11-12",
    registryOfOrigin: "GoldStandard",
    originProjectId: "GS-6234",
    program: "Gold Standard for the Global Goals",
    projectType: "Renewable Energy - Wind",
    coveredByNDC: "Yes",
    ndcInformation: "Aligned with India's renewable energy expansion goals",
    projectScale: "Large",
    projectTags: "Wind Energy, Grid-connected, Clean Energy, SDG 7, SDG 13",
    estimatedAnnualEmissionReductions: 1450000,
    location: "Rajasthan, India",
    methodology: "ACM0002 - Grid-connected electricity generation from renewable sources",
    validationBody: "Bureau Veritas Certification",
    validationDate: "2017-05-09",
};

export const goldStandardWaterCredit: CarbonCredit = {
    id: "goldstandard-003",
    registryId: "GS-8921",
    registry: "GoldStandard",
    projectName: "Safe Drinking Water Access - Odisha Communities",
    projectUid: "goldstandard-gs-8921",
    location: "Odisha, India",
    methodology: "GS Methodology for Water Purification",
    vintage: 2024,
    issuanceDate: "2024-03-01",
    volume: 280000,
    pricePerTonne: 1250,
    qualityScore: 95,
    status: "available",
};

export const goldStandardWaterProject: CADTrustProject = {
    projectId: "goldstandard-gs-8921",
    projectName: "Safe Drinking Water Access - Odisha Communities",
    projectLink: "https://registry.goldstandard.org/projects/details/8921",
    projectStatus: "Active",
    projectStatusDate: "2024-03-01",
    registryOfOrigin: "GoldStandard",
    originProjectId: "GS-8921",
    program: "Gold Standard for the Global Goals",
    projectType: "Water Purification",
    coveredByNDC: "No",
    ndcInformation: "Community-based project with health and gender co-benefits",
    projectScale: "Small",
    projectTags: "Water Purification, Health, Community, SDG 3, SDG 6, SDG 13",
    estimatedAnnualEmissionReductions: 95000,
    location: "Odisha, India",
    methodology: "GS Methodology for Water Purification",
    validationBody: "RINA Services S.p.A.",
    validationDate: "2021-09-14",
};

// ============================================================================
// CCTS CCC Credits (2)
// ============================================================================

export const cctsAfforestationCredit: CarbonCredit = {
    id: "ccts-001",
    registryId: "CCTS-IN-2023-0156",
    registry: "CCTS",
    projectName: "Aravalli Range Afforestation and Restoration Project",
    projectUid: "ccts-in-2023-0156",
    location: "Gujarat and Rajasthan, India",
    methodology: "AR-ACM0003 - Afforestation and reforestation of lands except wetlands",
    vintage: 2023,
    issuanceDate: "2023-08-25",
    volume: 850000,
    pricePerTonne: 680,
    qualityScore: 82,
    status: "available",
};

export const cctsAfforestationProject: CADTrustProject = {
    projectId: "ccts-in-2023-0156",
    projectName: "Aravalli Range Afforestation and Restoration Project",
    projectLink: "https://ccts.gov.in/project/CCTS-IN-2023-0156",
    projectStatus: "Active",
    projectStatusDate: "2023-08-25",
    registryOfOrigin: "CCTS",
    originProjectId: "CCTS-IN-2023-0156",
    program: "Carbon Credit Trading Scheme (India)",
    projectType: "Afforestation and Reforestation",
    coveredByNDC: "Yes",
    ndcInformation: "Contributes to India's forest cover expansion targets under NDC",
    projectScale: "Large",
    projectTags: "Afforestation, Reforestation, Biodiversity, Soil Conservation",
    estimatedAnnualEmissionReductions: 425000,
    location: "Gujarat and Rajasthan, India",
    methodology: "AR-ACM0003 - Afforestation and reforestation of lands except wetlands",
    validationBody: "Quality Council of India",
    validationDate: "2022-12-10",
};

export const cctsEnergyEfficiencyCredit: CarbonCredit = {
    id: "ccts-002",
    registryId: "CCTS-IN-2024-0089",
    registry: "CCTS",
    projectName: "Industrial Energy Efficiency Upgrade - Maharashtra Steel Mills",
    projectUid: "ccts-in-2024-0089",
    location: "Maharashtra, India",
    methodology: "AMS-II.D - Energy efficiency and fuel switching measures for industrial facilities",
    vintage: 2024,
    issuanceDate: "2024-01-15",
    volume: 620000,
    pricePerTonne: 590,
    qualityScore: 78,
    status: "available",
};

export const cctsEnergyEfficiencyProject: CADTrustProject = {
    projectId: "ccts-in-2024-0089",
    projectName: "Industrial Energy Efficiency Upgrade - Maharashtra Steel Mills",
    projectLink: "https://ccts.gov.in/project/CCTS-IN-2024-0089",
    projectStatus: "Active",
    projectStatusDate: "2024-01-15",
    registryOfOrigin: "CCTS",
    originProjectId: "CCTS-IN-2024-0089",
    program: "Carbon Credit Trading Scheme (India)",
    projectType: "Energy Efficiency - Industrial",
    coveredByNDC: "Yes",
    ndcInformation: "Supports India's industrial emissions intensity reduction goals",
    projectScale: "Medium",
    projectTags: "Energy Efficiency, Industrial, Steel Sector, Technology Upgrade",
    estimatedAnnualEmissionReductions: 310000,
    location: "Maharashtra, India",
    methodology: "AMS-II.D - Energy efficiency and fuel switching measures for industrial facilities",
    validationBody: "Bureau of Energy Efficiency",
    validationDate: "2023-06-20",
};

// ============================================================================
// Aggregated Data Exports
// ============================================================================

/**
 * Array of all demo carbon credits
 */
export const demoCredits: CarbonCredit[] = [
    verraForestryCredit,
    verraRenewableCredit,
    verraCookstovesCredit,
    goldStandardSolarCredit,
    goldStandardWindCredit,
    goldStandardWaterCredit,
    cctsAfforestationCredit,
    cctsEnergyEfficiencyCredit,
];

/**
 * Map of project UIDs to CADTrustProject data
 */
export const demoProjects: Record<string, CADTrustProject> = {
    "verra-vcs-934": verraForestryProject,
    "verra-vcs-1764": verraRenewableProject,
    "verra-vcs-2112": verraCookstovesProject,
    "goldstandard-gs-7845": goldStandardSolarProject,
    "goldstandard-gs-6234": goldStandardWindProject,
    "goldstandard-gs-8921": goldStandardWaterProject,
    "ccts-in-2023-0156": cctsAfforestationProject,
    "ccts-in-2024-0089": cctsEnergyEfficiencyProject,
};

/**
 * Map of registry IDs to CADTrustProject data
 */
export const demoProjectsByRegistryId: Record<string, CADTrustProject> = {
    "VCS-934": verraForestryProject,
    "VCS-1764": verraRenewableProject,
    "VCS-2112": verraCookstovesProject,
    "GS-7845": goldStandardSolarProject,
    "GS-6234": goldStandardWindProject,
    "GS-8921": goldStandardWaterProject,
    "CCTS-IN-2023-0156": cctsAfforestationProject,
    "CCTS-IN-2024-0089": cctsEnergyEfficiencyProject,
};

/**
 * Get demo project by Project UID
 */
export function getDemoProject(projectUid: string): CADTrustProject | null {
    return demoProjects[projectUid] || null;
}

/**
 * Get demo credit by registry ID
 */
export function getDemoCredit(registryId: string): CarbonCredit | null {
    return demoCredits.find((credit) => credit.registryId === registryId) || null;
}

/**
 * Get demo project by registry ID
 */
export function getDemoProjectByRegistryId(registryId: string): CADTrustProject | null {
    return demoProjectsByRegistryId[registryId] || null;
}

/**
 * Get all demo credits
 */
export function getDemoCredits(): CarbonCredit[] {
    return demoCredits;
}
