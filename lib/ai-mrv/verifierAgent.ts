import { CADTrustProject } from '@/lib/types';
import { ResearcherFindings } from './researcherAgent';

export interface VerifierAssessment {
    additionalityScore: number; // 0-100
    permanenceScore: number; // 0-100
    leakageScore: number; // 0-100
    notes: string;
    strengths: string[];
    concerns: string[];
}

export async function runVerifierAgent(
    researcherFindings: ResearcherFindings
): Promise<VerifierAssessment> {
    const { projectData } = researcherFindings;

    if (!projectData) {
        // Return conservative scores when no project data available
        return {
            additionalityScore: 50,
            permanenceScore: 50,
            leakageScore: 50,
            notes: 'Limited data available for comprehensive assessment',
            strengths: ['Project description provided'],
            concerns: [
                'No registry data available',
                'Unable to verify methodology',
                'Cannot assess validation status',
            ],
        };
    }

    // Assess additionality based on methodology and project type
    const additionalityScore = assessAdditionality(projectData);

    // Assess permanence based on project type and location
    const permanenceScore = assessPermanence(projectData);

    // Assess leakage prevention
    const leakageScore = assessLeakage(projectData);

    const strengths: string[] = [];
    const concerns: string[] = [];

    // Analyze strengths
    if (projectData.validationBody && projectData.validationDate) {
        strengths.push(`Validated by ${projectData.validationBody}`);
    }
    if (projectData.methodology) {
        strengths.push(`Uses approved methodology: ${projectData.methodology}`);
    }
    if (additionalityScore >= 80) {
        strengths.push('Strong additionality evidence');
    }
    if (permanenceScore >= 80) {
        strengths.push('High permanence rating');
    }

    // Analyze concerns
    if (additionalityScore < 60) {
        concerns.push('Additionality may need further documentation');
    }
    if (permanenceScore < 60) {
        concerns.push('Permanence risk requires monitoring');
    }
    if (leakageScore < 60) {
        concerns.push('Leakage prevention measures should be strengthened');
    }
    if (!projectData.validationBody) {
        concerns.push('Validation status unclear');
    }

    return {
        additionalityScore,
        permanenceScore,
        leakageScore,
        notes: `Assessment based on ${projectData.registryOfOrigin} project data`,
        strengths,
        concerns,
    };
}

function assessAdditionality(project: CADTrustProject): number {
    let score = 70; // Base score

    // Boost for renewable energy and forestry projects (typically strong additionality)
    if (
        project.projectType?.toLowerCase().includes('renewable') ||
        project.projectType?.toLowerCase().includes('solar') ||
        project.projectType?.toLowerCase().includes('wind')
    ) {
        score += 15;
    }

    if (
        project.projectType?.toLowerCase().includes('forest') ||
        project.projectType?.toLowerCase().includes('afforestation')
    ) {
        score += 10;
    }

    // Boost for validated projects
    if (project.validationBody && project.validationDate) {
        score += 10;
    }

    // Reduce for projects without clear methodology
    if (!project.methodology) {
        score -= 15;
    }

    return Math.min(100, Math.max(0, score));
}

function assessPermanence(project: CADTrustProject): number {
    let score = 75; // Base score

    // Forestry projects have higher permanence risk
    if (
        project.projectType?.toLowerCase().includes('forest') ||
        project.projectType?.toLowerCase().includes('afforestation')
    ) {
        score -= 10;
    }

    // Renewable energy has high permanence (emissions avoided)
    if (
        project.projectType?.toLowerCase().includes('renewable') ||
        project.projectType?.toLowerCase().includes('solar') ||
        project.projectType?.toLowerCase().includes('wind')
    ) {
        score += 15;
    }

    // Energy efficiency has high permanence
    if (project.projectType?.toLowerCase().includes('energy efficiency')) {
        score += 10;
    }

    // Location risk assessment (simplified)
    if (project.location?.toLowerCase().includes('india')) {
        score += 5; // Stable governance
    }

    return Math.min(100, Math.max(0, score));
}

function assessLeakage(project: CADTrustProject): number {
    let score = 70; // Base score

    // Renewable energy projects typically have low leakage risk
    if (
        project.projectType?.toLowerCase().includes('renewable') ||
        project.projectType?.toLowerCase().includes('solar') ||
        project.projectType?.toLowerCase().includes('wind')
    ) {
        score += 20;
    }

    // Forestry projects need strong leakage prevention
    if (
        project.projectType?.toLowerCase().includes('forest') ||
        project.projectType?.toLowerCase().includes('afforestation')
    ) {
        score += 5; // Assume some measures in place
    }

    // Methodology presence indicates leakage consideration
    if (project.methodology) {
        score += 10;
    }

    return Math.min(100, Math.max(0, score));
}
