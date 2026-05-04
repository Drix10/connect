/**
 * Demo Transaction History
 * 
 * Realistic transaction data for demo purposes
 */

export interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    creditId: string;
    registryId: string;
    projectName: string;
    quantity: number;
    pricePerTonne: number;
    totalAmount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    buyer?: string;
    seller?: string;
}

export const demoTransactions: Transaction[] = [
    {
        id: 'txn_001',
        type: 'buy',
        creditId: 'goldstandard-gs-8921',
        registryId: 'GS-8921',
        projectName: 'Safe Drinking Water Access - Odisha Communities',
        quantity: 5000,
        pricePerTonne: 1200,
        totalAmount: 6000000,
        date: '2024-03-05T11:45:00Z',
        status: 'completed',
        seller: 'Sustainable India Foundation',
    },
    {
        id: 'txn_002',
        type: 'buy',
        creditId: 'goldstandard-gs-7845',
        registryId: 'GS-7845',
        projectName: 'Solar Home Systems for Rural Electrification - Tamil Nadu',
        quantity: 8000,
        pricePerTonne: 1050,
        totalAmount: 8400000,
        date: '2024-02-10T14:20:00Z',
        status: 'completed',
        seller: 'GreenTech Solutions',
    },
    {
        id: 'txn_003',
        type: 'buy',
        creditId: 'verra-vcs-1764',
        registryId: 'VCS-1764',
        projectName: 'Bhadla Solar Park Phase II',
        quantity: 12000,
        pricePerTonne: 700,
        totalAmount: 8400000,
        date: '2024-01-25T09:15:00Z',
        status: 'completed',
        seller: 'Renewable Energy Corp',
    },
    {
        id: 'txn_004',
        type: 'buy',
        creditId: 'verra-vcs-934',
        registryId: 'VCS-934',
        projectName: 'Rimba Raya Biodiversity Reserve REDD+ Project',
        quantity: 15000,
        pricePerTonne: 820,
        totalAmount: 12300000,
        date: '2024-01-15T10:30:00Z',
        status: 'completed',
        seller: 'Forest Conservation Alliance',
    },
    {
        id: 'txn_005',
        type: 'buy',
        creditId: 'ccts-in-2023-0156',
        registryId: 'CCTS-IN-2023-0156',
        projectName: 'Aravalli Range Afforestation and Restoration Project',
        quantity: 10000,
        pricePerTonne: 650,
        totalAmount: 6500000,
        date: '2023-09-01T16:30:00Z',
        status: 'completed',
        seller: 'India Forest Department',
    },
];

export const transactionStats = {
    totalTransactions: demoTransactions.length,
    totalVolume: demoTransactions.reduce((sum, txn) => sum + txn.quantity, 0),
    totalValue: demoTransactions.reduce((sum, txn) => sum + txn.totalAmount, 0),
    averageTransactionSize: 0,
    completedTransactions: demoTransactions.filter(t => t.status === 'completed').length,
    pendingTransactions: demoTransactions.filter(t => t.status === 'pending').length,
};

transactionStats.averageTransactionSize = transactionStats.totalValue / transactionStats.totalTransactions;
