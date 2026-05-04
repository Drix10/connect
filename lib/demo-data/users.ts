/**
 * Demo User Data
 * 
 * Realistic demo users for the platform
 */

export interface DemoUser {
    id: string;
    name: string;
    email: string;
    organization: string;
    country: string;
    role: 'buyer' | 'seller' | 'verifier' | 'admin';
    kycStatus: 'approved' | 'pending' | 'not_started';
    joinedDate: string;
    totalCredits: number;
    totalValue: number;
    avatar?: string;
}

export const demoUsers: DemoUser[] = [
    {
        id: 'usr_001',
        name: 'Sarah Chen',
        email: 'sarah.chen@greentech.com',
        organization: 'GreenTech Solutions',
        country: 'Singapore',
        role: 'buyer',
        kycStatus: 'approved',
        joinedDate: '2024-01-15',
        totalCredits: 125000,
        totalValue: 10625000,
    },
    {
        id: 'usr_002',
        name: 'Raj Patel',
        email: 'raj.patel@sustainableindia.org',
        organization: 'Sustainable India Foundation',
        country: 'India',
        role: 'seller',
        kycStatus: 'approved',
        joinedDate: '2023-11-20',
        totalCredits: 450000,
        totalValue: 38250000,
    },
    {
        id: 'usr_003',
        name: 'Maria Rodriguez',
        email: 'maria.r@climateverify.com',
        organization: 'Climate Verify International',
        country: 'Spain',
        role: 'verifier',
        kycStatus: 'approved',
        joinedDate: '2023-09-10',
        totalCredits: 0,
        totalValue: 0,
    },
];

export const currentDemoUser: DemoUser = {
    id: 'usr_demo',
    name: 'Demo User',
    email: 'demo@carbontradeX.com',
    organization: 'Carbon Trade X Demo',
    country: 'India',
    role: 'buyer',
    kycStatus: 'approved',
    joinedDate: '2024-01-01',
    totalCredits: 50000,
    totalValue: 4250000,
};
