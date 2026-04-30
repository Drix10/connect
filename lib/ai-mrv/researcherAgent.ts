import { fetchCADTrustProject } from '@/lib/api/cadTrust';
import { CADTrustProject } from '@/lib/types';

export interface ResearcherFindings {
    projectData: CADTrustProject | null;
    dataSource: 'live' | 'mock' | 'description';
    summary: string;
    keyFindings: string[];
}

export async function runResearcherAgent(
    input: string
): Promise<ResearcherFindings> {
    // Check if input looks like a Registry ID or Project UID
    const isRegistryId = /^(VCS|GS|CCTS)-?\d+/i.test(input.trim());

    if (isRegistryId) {
        try {
            // Attempt to fetch from CAD Trust API
            const result = await fetchCADTrustProject(input.trim());

            if (result.project) {
                return {
                    projectData: result.project,
                    dataSource: result.dataSource,
                    summary: `Successfully retrieved project data for ${result.project.projectName}`,
                    keyFindings: [
                        `Registry: ${result.project.registryOfOrigin}`,
                        `Project Type: ${result.project.projectType}`,
                        `Location: ${result.project.location}`,
                        `Methodology: ${result.project.methodology}`,
                        `Validation: ${result.project.validationBody} (${result.project.validationDate})`,
                    ],
                };
            }
        } catch (error) {
            console.error('Researcher agent error:', error);
        }
    }

    // Fall back to project description analysis
    return {
        projectData: null,
        dataSource: 'description',
        summary: 'Analyzing project based on provided description',
        keyFindings: [
            'Project description provided by user',
            'Unable to retrieve registry data',
            'Analysis will be based on description only',
            'Consider providing a Registry ID for more accurate assessment',
        ],
    };
}
