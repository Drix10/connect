/**
 * Core TypeScript type definitions for Carbon Trade X MVP
 * 
 * This file contains all the core interfaces and types used throughout the application
 * for carbon credits, portfolios, CAD Trust API integration, AI MRV system, and user management.
 */

// ============================================================================
// Carbon Credit Types
// ============================================================================

/**
 * Represents a carbon credit from various registries (Verra, Gold Standard, CCTS)
 */
export interface CarbonCredit {
    /** Unique identifier for the credit */
    id: string;
    /** Registry-specific identifier (e.g., VCS-1234, GS-5678) */
    registryId: string;
    /** Source registry */
    registry: "Verra" | "GoldStandard" | "CCTS";
    /** Name of the carbon project */
    projectName: string;
    /** CAD Trust Project UID (optional) */
    projectUid?: string;
    /** Geographic location of the project */
    location: string;
    /** Methodology used for carbon accounting */
    methodology: string;
    /** Year of credit vintage */
    vintage: number;
    /** Date when credits were issued */
    issuanceDate: string;
    /** Available volume in tonnes of CO₂ equivalent */
    volume: number;
    /** Price per tonne in Indian Rupees */
    pricePerTonne: number;
    /** Quality score from 0 to 100 */
    qualityScore: number;
    /** Current status of the credit */
    status: "available" | "owned" | "sold";
}

/**
 * Represents a user's portfolio of carbon credits
 */
export interface Portfolio {
    /** Array of credits owned by the user */
    credits: PortfolioCredit[];
    /** Total portfolio value in Indian Rupees */
    totalValue: number;
    /** Total volume in tonnes of CO₂ equivalent */
    totalVolume: number;
}

/**
 * Extends CarbonCredit with ownership information
 */
export interface PortfolioCredit extends CarbonCredit {
    /** Quantity of credits owned */
    quantity: number;
    /** Price paid at purchase in Indian Rupees */
    purchasePrice: number;
    /** ISO 8601 timestamp of purchase */
    purchaseDate: string;
}

// ============================================================================
// CAD Trust API Types
// ============================================================================

/**
 * Represents a carbon project from the CAD Trust Data Model 2.0
 */
export interface CADTrustProject {
    /** Unique project identifier in CAD Trust */
    projectId: string;
    /** Name of the carbon project */
    projectName: string;
    /** URL link to project details */
    projectLink: string;
    /** Current status of the project */
    projectStatus: string;
    /** Date of last status update */
    projectStatusDate: string;
    /** Original registry (Verra, Gold Standard, CCTS) */
    registryOfOrigin: string;
    /** Project ID in the origin registry */
    originProjectId: string;
    /** Program or standard (e.g., VCS, Gold Standard) */
    program: string;
    /** Type of carbon project (e.g., forestry, renewable energy) */
    projectType: string;
    /** Whether covered by Nationally Determined Contributions */
    coveredByNDC: string;
    /** Additional NDC information */
    ndcInformation: string;
    /** Scale of the project (small, medium, large) */
    projectScale: string;
    /** Tags or categories for the project */
    projectTags: string;
    /** Estimated annual emission reductions in tCO₂e */
    estimatedAnnualEmissionReductions: number;
    /** Geographic location */
    location: string;
    /** Methodology used */
    methodology: string;
    /** Validation body that verified the project */
    validationBody: string;
    /** Date of validation */
    validationDate: string;
}

/**
 * JSON-RPC 2.0 request structure for CAD Trust API
 */
export interface CADTrustRPCRequest {
    /** JSON-RPC version (always "2.0") */
    jsonrpc: "2.0";
    /** Method name to call (e.g., "cadt_getProject") */
    method: string;
    /** Array of parameters for the method */
    params: any[];
    /** Request identifier */
    id: number;
}

/**
 * JSON-RPC 2.0 response structure from CAD Trust API
 */
export interface CADTrustRPCResponse {
    /** JSON-RPC version (always "2.0") */
    jsonrpc: "2.0";
    /** Result data (present on success) */
    result?: any;
    /** Error object (present on failure) */
    error?: {
        /** Error code */
        code: number;
        /** Error message */
        message: string;
    };
    /** Request identifier (matches request) */
    id: number;
}

// ============================================================================
// AI MRV System Types
// ============================================================================

/**
 * Complete result from AI MRV multi-agent analysis
 */
export interface MRVAnalysisResult {
    /** Project identifier that was analyzed */
    projectId: string;
    /** Findings from the Researcher agent */
    researcherFindings: {
        /** Project data retrieved or provided */
        projectData: CADTrustProject;
        /** Whether data came from live API or mock data */
        dataSource: "live" | "mock";
    };
    /** Assessment from the Verifier agent */
    verifierAssessment: {
        /** Additionality score (0-100) */
        additionalityScore: number;
        /** Permanence score (0-100) */
        permanenceScore: number;
        /** Leakage prevention score (0-100) */
        leakageScore: number;
        /** Additional notes from verification */
        notes: string;
    };
    /** Compliance check results */
    complianceCheck: {
        /** Whether project meets Verra VCS standards */
        verraCompliant: boolean;
        /** Whether project meets Gold Standard requirements */
        goldStandardCompliant: boolean;
        /** List of compliance issues found */
        issues: string[];
    };
    /** Final report from Report Generator agent */
    finalReport: {
        /** Overall quality score (0-100) */
        qualityScore: number;
        /** List of project strengths */
        strengths: string[];
        /** List of project weaknesses */
        weaknesses: string[];
        /** Recommendations for improvement */
        recommendations: string[];
    };
}

// ============================================================================
// Onboarding Types
// ============================================================================

/**
 * Tracks user progress through registry onboarding processes
 */
export interface OnboardingProgress {
    /** Verra registry onboarding progress */
    verra: {
        /** List of onboarding steps */
        steps: OnboardingStep[];
        /** Completion percentage (0-100) */
        completionPercentage: number;
    };
    /** Gold Standard registry onboarding progress */
    goldStandard: {
        /** List of onboarding steps */
        steps: OnboardingStep[];
        /** Completion percentage (0-100) */
        completionPercentage: number;
    };
}

/**
 * Represents a single step in the onboarding process
 */
export interface OnboardingStep {
    /** Unique identifier for the step */
    id: string;
    /** Title of the step */
    title: string;
    /** Detailed description of what's required */
    description: string;
    /** Whether the step has been completed */
    completed: boolean;
    /** Whether this step requires document upload */
    documentRequired: boolean;
}

// ============================================================================
// User Profile Types
// ============================================================================

/**
 * User profile information and settings
 */
export interface UserProfile {
    /** User's full name */
    name: string;
    /** User's email address */
    email: string;
    /** Organization name */
    organization: string;
    /** Country of operation */
    country: string;
    /** Optional CAD Trust API key for authenticated requests */
    cadTrustApiKey?: string;
    /** KYC verification status */
    kycStatus: "approved" | "pending" | "not_started";
    /** Whether user has given DPDPA consent */
    consentGiven: boolean;
    /** ISO 8601 timestamp of consent */
    consentDate?: string;
}

// ============================================================================
// Trading Simulator Types
// ============================================================================

/**
 * Represents a single point in price history
 */
export interface PriceHistoryPoint {
    /** ISO 8601 date string */
    date: string;
    /** Price in Indian Rupees per tonne */
    price: number;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for the CreditSearchForm component
 */
export interface CreditSearchFormProps {
    /** Callback function when search is submitted */
    onSearch: (query: string) => Promise<void>;
    /** Whether a search is currently in progress */
    isLoading: boolean;
}

/**
 * Props for the CreditDetailsCard component
 */
export interface CreditDetailsCardProps {
    /** Carbon credit to display */
    credit: CarbonCredit;
    /** Optional CAD Trust project data */
    project?: CADTrustProject;
    /** Whether data is from live API or mock data */
    dataSource: "live" | "mock";
}

/**
 * Props for the MarketplaceTable component
 */
export interface MarketplaceTableProps {
    /** Array of available credits */
    credits: CarbonCredit[];
    /** Callback when user clicks buy button */
    onBuy: (creditId: string) => void;
    /** Current sort field */
    sortBy: "price" | "volume" | "qualityScore";
    /** Callback when sort field changes */
    onSortChange: (sortBy: string) => void;
}

/**
 * Props for the PortfolioDisplay component
 */
export interface PortfolioDisplayProps {
    /** User's portfolio */
    portfolio: Portfolio;
    /** Callback when user clicks sell button */
    onSell: (creditId: string) => void;
}

/**
 * Props for the PriceChart component
 */
export interface PriceChartProps {
    /** Credit ID to display price history for */
    creditId: string;
    /** Array of historical price points */
    priceHistory: PriceHistoryPoint[];
}

/**
 * Chat message for AI MRV interface
 */
export interface ChatMessage {
    /** Unique message identifier */
    id: string;
    /** Role of the message sender */
    role: "user" | "assistant" | "system";
    /** Message content */
    content: string;
    /** ISO 8601 timestamp */
    timestamp: string;
    /** Optional agent that generated the message */
    agent?: "researcher" | "verifier" | "compliance" | "report";
}

/**
 * Props for the MRVChatInterface component
 */
export interface MRVChatInterfaceProps {
    /** Callback to start analysis */
    onAnalyze: (input: string) => Promise<MRVAnalysisResult>;
    /** Array of chat messages */
    messages: ChatMessage[];
    /** Whether analysis is currently running */
    isAnalyzing: boolean;
    /** Currently active agent */
    activeAgent?: "researcher" | "verifier" | "compliance" | "report";
}

/**
 * Props for the OnboardingChecklist component
 */
export interface OnboardingChecklistProps {
    /** Which registry's checklist to display */
    registry: "verra" | "goldStandard";
    /** Array of onboarding steps */
    steps: OnboardingStep[];
    /** Callback when a step is toggled */
    onStepToggle: (stepId: string) => void;
    /** Callback when submit button is clicked */
    onSubmit: () => void;
}
