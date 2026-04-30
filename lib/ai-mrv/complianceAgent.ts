import { CADTrustProject } from '@/lib/types';
import { ResearcherFindings } from './researcherAgent';
import { VerifierAssessment } from './verifierAgent';

export interface ComplianceCheck {
    verraCompliant: boolean;
    goldStandardCompliant: boolean;
    issues: string[];
    recommendations: string[];
    overallStatus: 'compliant' | 'partial' | 'non-compliant';
}

export async function runComplianceAgent(
    researcherFindings: ResearcherFindings,
    verifierAssessment: VerifierAssessment
): Promise<ComplianceCheck> {
    const { projectData } = researcherFindings;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!projectData) {
        return {
            verraCompliant: false,
            goldStandardCompliant: false,
            issues: ['No project data available for compliance review'],
            recommendations: ['Provide Registry ID or complete project documentation'],
            overallStatus: 'non-compliant',
        };
    }

    // Check Verra VCS compliance
    const verraCompliant = checkVerraCompliance(projectData, verifierAssessment, issues);

    // Check Gold Standard compliance
    const goldStandardCompliant = checkGoldStandardCompliance(
        projectData,
        verifierAssessment,
        issues
    );

    // Generate recommendations based on issues
    if (issues.length === 0) {
        recommendations.push('Project meets all major compliance requirements');
        recommendations.push('Continue monitoring and reporting as per registry standards');
    } else {
        if (!projectData.validationBody) {
            recommendations.push('Engage an accredited Validation/Verification Body');
        }
        if (!projectData.methodology) {
            recommendations.push('Select and document an approved methodology');
        }
        if (verifierAssessment.additionalityScore < 70) {
            recommendations.push('Strengthen additionality documentation with barrier analysis');
        }
        if (verifierAssessment.permanenceScore < 70) {
            recommendations.push('Implement permanence monitoring and buffer pool contributions');
        }
        if (verifierAssessment.leakageScore < 70) {
            recommendations.push('Develop comprehensive leakage prevention measures');
        }
    }

    const overallStatus: 'compliant' | 'partial' | 'non-compliant' =
        issues.length === 0 ? 'compliant' : issues.length <= 2 ? 'partial' : 'non-compliant';

    return {
        verraCompliant,
        goldStandardCompliant,
        issues,
        recommendations,
        overallStatus,
    };
}

function checkVerraCompliance(
    project: CADTrustProject,
    assessment: VerifierAssessment,
    issues: string[]
): boolean {
    let compliant = true;

    // Check if project is from Verra or could be Verra-compliant
    const isVerraProject = project.registryOfOrigin?.toLowerCase().includes('verra');

    // VCS requires validation
    if (!project.validationBody || !project.validationDate) {
        issues.push('Verra VCS: Missing validation by accredited VVB');
        compliant = false;
    }

    // VCS requires approved methodology
    if (!project.methodology) {
        issues.push('Verra VCS: No approved methodology documented');
        compliant = false;
    }

    // VCS requires strong additionality
    if (assessment.additionalityScore < 60) {
        issues.push('Verra VCS: Additionality demonstration may be insufficient');
        compliant = false;
    }

    // VCS requires permanence assessment for AFOLU projects
    if (
        (project.projectType?.toLowerCase().includes('forest') ||
            project.projectType?.toLowerCase().includes('afforestation')) &&
        assessment.permanenceScore < 60
    ) {
        issues.push('Verra VCS: AFOLU project requires stronger permanence measures');
        compliant = false;
    }

    return compliant;
}

function checkGoldStandardCompliance(
    project: CADTrustProject,
    assessment: VerifierAssessment,
    issues: string[]
): boolean {
    let compliant = true;

    // Check if project is from Gold Standard
    const isGSProject = project.registryOfOrigin?.toLowerCase().includes('gold standard');

    // Gold Standard requires validation
    if (!project.validationBody || !project.validationDate) {
        issues.push('Gold Standard: Missing validation by accredited auditor');
        compliant = false;
    }

    // Gold Standard requires approved methodology
    if (!project.methodology) {
        issues.push('Gold Standard: No approved methodology documented');
        compliant = false;
    }

    // Gold Standard has strict additionality requirements
    if (assessment.additionalityScore < 70) {
        issues.push('Gold Standard: Additionality requirements not fully met');
        compliant = false;
    }

    // Gold Standard requires stakeholder consultation (can't verify from data)
    // This would be flagged as a documentation requirement
    if (isGSProject && !project.projectStatusDate) {
        issues.push('Gold Standard: Stakeholder consultation documentation may be missing');
        compliant = false;
    }

    // Gold Standard emphasizes sustainable development (co-benefits)
    // This is harder to assess from project data alone
    if (isGSProject && assessment.additionalityScore < 75) {
        issues.push('Gold Standard: Sustainable development impacts should be documented');
        compliant = false;
    }

    return compliant;
}
