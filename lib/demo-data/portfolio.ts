/**
 * Demo Portfolio Data
 * 
 * Realistic portfolio holdings for demo purposes
 */

import { PortfolioCredit } from '@/lib/types';

export const demoPortfolio: PortfolioCredit[] = [
    {
        id: 'verra-001',
        registryId: 'VCS-934',
        registry: 'Verra',
        projectName: 'Rimba Raya Biodiversity Reserve REDD+ Project',
        projectUid: 'verra-vcs-934',
        location: 'Central Kalimantan, Indonesia',
        methodology: 'VM0015 - Methodology for Avoided Unplanned Deforestation',
        vintage: 2023,
        issuanceDate: '2023-06-15',
        volume: 2500000,
        pricePerTonne: 850,
        qualityScore: 92,
        status: 'owned',
        quantity: 15000,
        purchasePrice: 820,
        purchaseDate: '2024-01-15T10:30:00Z',
    },
    {
        id: 'goldstandard-001',
        registryId: 'GS-7845',
        registry: 'GoldStandard',
        projectName: 'Solar Home Systems for Rural Electrification - Tamil Nadu',
        projectUid: 'goldstandard-gs-7845',
        location: 'Tamil Nadu, India',
        methodology: 'GS Methodology for Solar Home Systems',
        vintage: 2024,
        issuanceDate: '2024-02-05',
        volume: 320000,
        pricePerTonne: 1100,
        qualityScore: 94,
        status: 'owned',
        quantity: 8000,
        purchasePrice: 1050,
        purchaseDate: '2024-02-10T14:20:00Z',
    },
    {
        id: 'verra-002',
        registryId: 'VCS-1764',
        registry: 'Verra',
        projectName: 'Bhadla Solar Park Phase II',
        projectUid: 'verra-vcs-1764',
        location: 'Rajasthan, India',
        methodology: 'ACM0002 - Grid-connected electricity generation from renewable sources',
        vintage: 2024,
        issuanceDate: '2024-01-20',
        volume: 1800000,
        pricePerTonne: 720,
        qualityScore: 88,
        status: 'owned',
        quantity: 12000,
        purchasePrice: 700,
        purchaseDate: '2024-01-25T09:15:00Z',
    },
    {
        id: 'goldstandard-003',
        registryId: 'GS-8921',
        registry: 'GoldStandard',
        projectName: 'Safe Drinking Water Access - Odisha Communities',
        projectUid: 'goldstandard-gs-8921',
        location: 'Odisha, India',
        methodology: 'GS Methodology for Water Purification',
        vintage: 2024,
        issuanceDate: '2024-03-01',
        volume: 280000,
        pricePerTonne: 1250,
        qualityScore: 95,
        status: 'owned',
        quantity: 5000,
        purchasePrice: 1200,
        purchaseDate: '2024-03-05T11:45:00Z',
    },
    {
        id: 'ccts-001',
        registryId: 'CCTS-IN-2023-0156',
        registry: 'CCTS',
        projectName: 'Aravalli Range Afforestation and Restoration Project',
        projectUid: 'ccts-in-2023-0156',
        location: 'Gujarat and Rajasthan, India',
        methodology: 'AR-ACM0003 - Afforestation and reforestation of lands except wetlands',
        vintage: 2023,
        issuanceDate: '2023-08-25',
        volume: 850000,
        pricePerTonne: 680,
        qualityScore: 82,
        status: 'owned',
        quantity: 10000,
        purchasePrice: 650,
        purchaseDate: '2023-09-01T16:30:00Z',
    },
];

export const portfolioStats = {
    totalCredits: demoPortfolio.reduce((sum, credit) => sum + credit.quantity, 0),
    totalValue: demoPortfolio.reduce((sum, credit) => sum + (credit.quantity * credit.pricePerTonne), 0),
    totalInvested: demoPortfolio.reduce((sum, credit) => sum + (credit.quantity * credit.purchasePrice), 0),
    averageQualityScore: Math.round(
        demoPortfolio.reduce((sum, credit) => sum + credit.qualityScore, 0) / demoPortfolio.length
    ),
    totalProfit: 0, // Calculated dynamically
    profitPercentage: 0, // Calculated dynamically
};

// Calculate profit
portfolioStats.totalProfit = portfolioStats.totalValue - portfolioStats.totalInvested;
portfolioStats.profitPercentage = (portfolioStats.totalProfit / portfolioStats.totalInvested) * 100;
