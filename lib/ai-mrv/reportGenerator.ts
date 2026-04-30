import { ResearcherFindings } from './researcherAgent';
import { VerifierAssessment } from './verifierAgent';
import { ComplianceCheck } from './complianceAgent';

export interface FinalReport {
    qualityScore: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
}

export async function runReportGenerator(
    researcherFindings: ResearcherFindings,
    verifierAssessment: VerifierAssessment,
    complianceCheck: ComplianceCheck
): Promise<FinalReport> {
    // Calculate overall quality score
    const qualityScore = calculateQualityScore(verifierAssessment, complianceCheck);

    // Synthesize strengths
    const strengths = synthesizeStrengths(
        researcherFindings,
        verifierAssessment,
        complianceCheck
    );

    // Synthesize weaknesses
    const weaknesses = synthesizeWeaknesses(verifierAssessment, complianceCheck);

    // Compile recommendations
    const recommendations = [
        ...complianceCheck.recommendations,
        ...generateAdditionalRecommendations(qualityScore, verifierAssessment),
    ];

    // Generate summary
    const summary = generateSummary(
        researcherFindings,
        qualityScore,
        complianceCheck.overallStatus
    );

    return {
        qualityScore,
        strengths,
        weaknesses,
        recommendations,
        summary,
    };
}

function calculateQualityScore(
    assessment: VerifierAssessment,
    compliance: ComplianceCheck
): number {
    // Weight the different components
    const additionalityWeight = 0.3;
    const permanenceWeight = 0.25;
    const leakageWeight = 0.2;
    const complianceWeight = 0.25;

    // Calculate compliance score
    let complianceScore = 0;
    if (compliance.overallStatus === 'compliant') {
        complianceScore = 100;
    } else if (compliance.overallStatus === 'partial') {
        complianceScore = 70;
    } else {
        complianceScore = 40;
    }

    // Calculate weighted average
    const score =
        assessment.additionalityScore * additionalityWeight +
        assessment.permanenceScore * permanenceWeight +
        assessment.leakageScore * leakageWeight +
        complianceScore * complianceWeight;

    return Math.round(score);
}

function synthesizeStrengths(
    research: ResearcherFindings,
    assessment: VerifierAssessment,
    compliance: ComplianceCheck
): string[] {
    const strengths: string[] = [];

    // Data source strength
    if (research.dataSource === 'live') {
        strengths.push('Verified with live registry data from CAD Trust');
    }

    // Add verifier strengths
    strengths.push(...assessment.strengths);

    // Compliance strengths
    if (compliance.verraCompliant) {
        strengths.push('Meets Verra VCS compliance standards');
    }
    if (compliance.goldStandardCompliant) {
        strengths.push('Meets Gold Standard compliance standards');
    }

    // Score-based strengths
    if (assessment.additionalityScore >= 80) {
        strengths.push('Excellent additionality demonstration');
    }
    if (assessment.permanenceScore >= 80) {
        strengths.push('Strong permanence safeguards');
    }
    if (assessment.leakageScore >= 80) {
        strengths.push('Robust leakage prevention measures');
    }

    return strengths.length > 0
        ? strengths
        : ['Project has basic documentation in place'];
}

function synthesizeWeaknesses(
    assessment: VerifierAssessment,
    compliance: ComplianceCheck
): string[] {
    const weaknesses: string[] = [];

    // Add verifier concerns
    weaknesses.push(...assessment.concerns);

    // Add compliance issues
    weaknesses.push(...compliance.issues);

    // Score-based weaknesses
    if (assessment.additionalityScore < 60) {
        weaknesses.push('Additionality evidence needs strengthening');
    }
    if (assessment.permanenceScore < 60) {
        weaknesses.push('Permanence risk management requires improvement');
    }
    if (assessment.leakageScore < 60) {
        weaknesses.push('Leakage prevention measures are insufficient');
    }

    return weaknesses.length > 0
        ? weaknesses
        : ['No major weaknesses identified'];
}

function generateAdditionalRecommendations(
    qualityScore: number,
    assessment: VerifierAssessment
): string[] {
    const recommendations: string[] = [];

    if (qualityScore >= 85) {
        recommendations.push('Project demonstrates high quality - ready for market');
        recommendations.push('Consider premium pricing for high-quality credits');
    } else if (qualityScore >= 70) {
        recommendations.push('Project meets good quality standards');
        recommendations.push('Address minor issues to achieve premium status');
    } else if (qualityScore >= 50) {
        recommendations.push('Project requires improvements before market readiness');
        recommendations.push('Focus on addressing compliance gaps');
    } else {
        recommendations.push('Significant improvements needed');
        recommendations.push('Consider engaging expert consultants for project development');
    }

    return recommendations;
}

function generateSummary(
    research: ResearcherFindings,
    qualityScore: number,
    complianceStatus: string
): string {
    const projectName = research.projectData?.projectName || 'the analyzed project';
    const dataSource =
        research.dataSource === 'live'
            ? 'verified registry data'
            : research.dataSource === 'mock'
                ? 'demo data'
                : 'project description';

    let qualityLevel = '';
    if (qualityScore >= 85) {
        qualityLevel = 'excellent';
    } else if (qualityScore >= 70) {
        qualityLevel = 'good';
    } else if (qualityScore >= 50) {
        qualityLevel = 'moderate';
    } else {
        qualityLevel = 'needs improvement';
    }

    return `Analysis of ${projectName} based on ${dataSource} indicates ${qualityLevel} quality with an overall score of ${qualityScore}/100. Compliance status: ${complianceStatus}. ${qualityScore >= 70
            ? 'The project demonstrates strong fundamentals and is suitable for carbon markets.'
            : 'The project requires additional work to meet market standards.'
        }`;
}
