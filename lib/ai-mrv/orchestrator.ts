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
}

export interface AgentUpdate {
    agent: AgentType;
    status: 'running' | 'complete' | 'error';
    message: string;
    data?: any;
}

export async function runMRVAnalysis(
    input: string,
    onUpdate?: (update: AgentUpdate) => void
): Promise<MRVAnalysisResult> {
    try {
        // Step 1: Researcher Agent
        onUpdate?.({
            agent: 'researcher',
            status: 'running',
            message: 'Researching project data...',
        });

        const researcherFindings = await runResearcherAgent(input);

        onUpdate?.({
            agent: 'researcher',
            status: 'complete',
            message: researcherFindings.summary,
            data: researcherFindings,
        });

        // Small delay for better UX
        await delay(500);

        // Step 2: Verifier Agent
        onUpdate?.({
            agent: 'verifier',
            status: 'running',
            message: 'Assessing additionality, permanence, and leakage...',
        });

        const verifierAssessment = await runVerifierAgent(researcherFindings);

        onUpdate?.({
            agent: 'verifier',
            status: 'complete',
            message: `Assessment complete: Additionality ${verifierAssessment.additionalityScore}/100, Permanence ${verifierAssessment.permanenceScore}/100, Leakage ${verifierAssessment.leakageScore}/100`,
            data: verifierAssessment,
        });

        await delay(500);

        // Step 3: Compliance Checker Agent
        onUpdate?.({
            agent: 'compliance',
            status: 'running',
            message: 'Checking compliance with registry standards...',
        });

        const complianceCheck = await runComplianceAgent(
            researcherFindings,
            verifierAssessment
        );

        onUpdate?.({
            agent: 'compliance',
            status: 'complete',
            message: `Compliance status: ${complianceCheck.overallStatus}. Found ${complianceCheck.issues.length} issues.`,
            data: complianceCheck,
        });

        await delay(500);

        // Step 4: Report Generator Agent
        onUpdate?.({
            agent: 'report',
            status: 'running',
            message: 'Generating final quality report...',
        });

        const finalReport = await runReportGenerator(
            researcherFindings,
            verifierAssessment,
            complianceCheck
        );

        onUpdate?.({
            agent: 'report',
            status: 'complete',
            message: `Analysis complete! Quality Score: ${finalReport.qualityScore}/100`,
            data: finalReport,
        });

        return {
            researcherFindings,
            verifierAssessment,
            complianceCheck,
            finalReport,
        };
    } catch (error) {
        console.error('MRV Analysis error:', error);
        throw error;
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
