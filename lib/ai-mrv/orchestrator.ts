import { runResearcherAgent, ResearcherFindings } from './researcherAgent';
import { runVerifierAgent, VerifierAssessment } from './verifierAgent';
import { runComplianceAgent, ComplianceCheck } from './complianceAgent';
import { runReportGenerator, FinalReport } from './reportGenerator';

export type AgentType = 'researcher' | 'verifier' | 'compliance' | 'report';

export interface MRVAnalysisResult {
    researcherFindings: ResearcherFindings;
    verifierAssessment: VerifierAssessment;
    complianceCheck: ComplianceCheck;
    finalReport: FinalReport;
    metadata: {
        processingTimeSeconds: number;
        totalSteps: number;
        completedAt: Date;
    };
}

export interface AgentUpdate {
    agent: AgentType;
    status: 'running' | 'complete' | 'error';
    message: string;
    data?: any;
}

/**
 * Cancellable timeout for preventing memory leaks
 * Fixes Issue 11: Timeout Memory Leak
 */
class CancellableTimeout {
    private timeoutId: NodeJS.Timeout | null = null;
    private promise: Promise<never>;

    constructor(ms: number, message: string) {
        this.promise = new Promise<never>((_, reject) => {
            this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                reject(new Error(message));
            }, ms);
        });
    }

    getPromise(): Promise<never> {
        return this.promise;
    }

    cancel(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

/**
 * Helper to run function with cancellable timeout
 * Prevents memory leaks by always cancelling timeout
 */
async function withTimeout<T>(
    fn: () => Promise<T>,
    ms: number,
    message: string
): Promise<T> {
    const timeout = new CancellableTimeout(ms, message);

    try {
        const result = await Promise.race([
            fn(),
            timeout.getPromise()
        ]);
        return result;
    } finally {
        // CRITICAL: Always cancel timeout to prevent memory leak
        timeout.cancel();
    }
}

/**
 * Runs the complete MRV analysis with proper error handling and timeouts
 * Fixes Issue 1: Memory Leak in AI MRV Orchestrator
 * 
 * Changes:
 * - Added timeouts for each agent (30 seconds)
 * - Proper cleanup on errors
 * - Returns complete result object instead of stale data
 * - Added processing time tracking
 */
export async function runMRVAnalysis(
    input: string,
    onUpdate?: (update: AgentUpdate) => void
): Promise<MRVAnalysisResult> {
    const startTime = Date.now();
    let completedSteps = 0;
    const totalSteps = 4;

    try {
        // Step 1: Researcher Agent with timeout
        onUpdate?.({
            agent: 'researcher',
            status: 'running',
            message: 'Researching project data...',
        });

        const researcherFindings = await withTimeout(
            () => runResearcherAgent(input),
            30000,
            'Researcher agent timeout'
        );

        completedSteps++;

        onUpdate?.({
            agent: 'researcher',
            status: 'complete',
            message: researcherFindings.summary,
            data: researcherFindings,
        });

        // Small delay for better UX
        await delay(500);

        // Step 2: Verifier Agent with timeout
        onUpdate?.({
            agent: 'verifier',
            status: 'running',
            message: 'Assessing additionality, permanence, and leakage...',
        });

        const verifierAssessment = await withTimeout(
            () => runVerifierAgent(researcherFindings),
            30000,
            'Verifier agent timeout'
        );

        completedSteps++;

        onUpdate?.({
            agent: 'verifier',
            status: 'complete',
            message: `Assessment complete: Additionality ${verifierAssessment.additionalityScore}/100, Permanence ${verifierAssessment.permanenceScore}/100, Leakage ${verifierAssessment.leakageScore}/100`,
            data: verifierAssessment,
        });

        await delay(500);

        // Step 3: Compliance Checker Agent with timeout
        onUpdate?.({
            agent: 'compliance',
            status: 'running',
            message: 'Checking compliance with registry standards...',
        });

        const complianceCheck = await withTimeout(
            () => runComplianceAgent(researcherFindings, verifierAssessment),
            30000,
            'Compliance checker timeout'
        );

        completedSteps++;

        onUpdate?.({
            agent: 'compliance',
            status: 'complete',
            message: `Compliance status: ${complianceCheck.overallStatus}. Found ${complianceCheck.issues.length} issues.`,
            data: complianceCheck,
        });

        await delay(500);

        // Step 4: Report Generator Agent with timeout
        onUpdate?.({
            agent: 'report',
            status: 'running',
            message: 'Generating final quality report...',
        });

        const finalReport = await withTimeout(
            () => runReportGenerator(researcherFindings, verifierAssessment, complianceCheck),
            30000,
            'Report generator timeout'
        );

        completedSteps++;

        onUpdate?.({
            agent: 'report',
            status: 'complete',
            message: `Analysis complete! Quality Score: ${finalReport.qualityScore}/100`,
            data: finalReport,
        });

        // Calculate processing time
        const processingTimeSeconds = Math.floor((Date.now() - startTime) / 1000);

        // Return complete result with metadata
        return {
            researcherFindings,
            verifierAssessment,
            complianceCheck,
            finalReport,
            metadata: {
                processingTimeSeconds,
                totalSteps,
                completedAt: new Date(),
            },
        };
    } catch (error) {
        console.error('MRV Analysis error:', error);

        // FIXED: Notify about error for all error types (not just Error instances)
        const errorMessage = error instanceof Error ? error.message : String(error);
        const agent: AgentType =
            completedSteps === 0 ? 'researcher' :
                completedSteps === 1 ? 'verifier' :
                    completedSteps === 2 ? 'compliance' : 'report';

        onUpdate?.({
            agent,
            status: 'error',
            message: errorMessage,
        });

        throw error;
    }
}

/**
 * FIXED: Delay with proper cleanup tracking
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(resolve, ms);
        // Note: This timeout is intentionally not tracked for cancellation
        // as it's a short UX delay (500ms) and will complete quickly
    });
}
