/**
 * CAD Trust API Client
 * 
 * This module provides integration with the CAD Trust Data Model 2.0 JSON-RPC v2.0 API.
 * It handles fetching carbon project data from the live API at https://rpc.climateactiondata.org/v2
 * with automatic fallback to mock data on failure.
 * 
 * Features:
 * - JSON-RPC 2.0 request formatting
 * - 10-second timeout using AbortSignal
 * - Network error handling
 * - Automatic fallback to mock data
 * - Data source indicator ("live" or "mock")
 */

import { CADTrustProject, CADTrustRPCRequest, CADTrustRPCResponse } from "@/lib/types";
import { getMockProject, getMockProjectByRegistryId } from "@/lib/mock-data/credits";

/**
 * CAD Trust API endpoint URL
 */
const CAD_TRUST_API_URL = "https://rpc.climateactiondata.org/v2";

/**
 * Request timeout in milliseconds (10 seconds)
 */
const REQUEST_TIMEOUT = 10000;

/**
 * Result type that includes the data source indicator
 */
export interface CADTrustFetchResult {
    /** The project data (from live API or mock) */
    project: CADTrustProject | null;
    /** Indicates whether data came from live API or mock data */
    dataSource: "live" | "mock";
    /** Error message if the request failed */
    error?: string;
}

/**
 * Fetches a carbon project from the CAD Trust API using JSON-RPC 2.0
 * 
 * This function attempts to fetch project data from the live CAD Trust API.
 * If the request fails (network error, timeout, or API error), it automatically
 * falls back to mock data.
 * 
 * @param projectUid - The Project_UID to fetch (e.g., "verra-vcs-934")
 * @returns Promise resolving to project data with data source indicator
 * 
 * @example
 * ```typescript
 * const result = await fetchCADTrustProject("verra-vcs-934");
 * if (result.project) {
 *   console.log(`Project: ${result.project.projectName}`);
 *   console.log(`Data source: ${result.dataSource}`);
 * }
 * ```
 */
export async function fetchCADTrustProject(projectUid: string): Promise<CADTrustFetchResult> {
    // Validate input
    if (!projectUid || projectUid.trim().length === 0) {
        return fallbackToMockData(projectUid, "Invalid project UID: empty string");
    }

    if (projectUid.length > 200) {
        return fallbackToMockData(projectUid, "Invalid project UID: too long (max 200 characters)");
    }

    try {
        // Create JSON-RPC 2.0 request
        const rpcRequest: CADTrustRPCRequest = {
            jsonrpc: "2.0",
            method: "cadt_getProject",
            params: [projectUid],
            id: Date.now(), // Use timestamp as unique request ID
        };

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            // Make the API request
            const response = await fetch(CAD_TRUST_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rpcRequest),
                signal: controller.signal,
            });

            // Clear the timeout
            clearTimeout(timeoutId);

            // Check if response is OK
            if (!response.ok) {
                console.error(`CAD Trust API HTTP error: ${response.status} ${response.statusText}`);
                return fallbackToMockData(projectUid, `HTTP error: ${response.status}`);
            }

            // Parse JSON-RPC response
            const rpcResponse: CADTrustRPCResponse = await response.json();

            // Check for JSON-RPC error
            if (rpcResponse.error) {
                console.error("CAD Trust API RPC error:", rpcResponse.error);
                return fallbackToMockData(
                    projectUid,
                    `RPC error: ${rpcResponse.error.message} (code: ${rpcResponse.error.code})`
                );
            }

            // Check if result exists
            if (!rpcResponse.result) {
                console.error("CAD Trust API returned empty result");
                return fallbackToMockData(projectUid, "Empty result from API");
            }

            // Successfully retrieved live data
            return {
                project: rpcResponse.result as CADTrustProject,
                dataSource: "live",
            };
        } catch (fetchError) {
            // Clear timeout on error to prevent memory leak
            clearTimeout(timeoutId);

            // Handle timeout specifically
            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                console.error("CAD Trust API request timed out after 10 seconds");
                return fallbackToMockData(projectUid, "Request timeout");
            }

            // Handle other fetch errors
            throw fetchError;
        }
    } catch (error) {
        // Handle any other errors (network errors, JSON parsing errors, etc.)
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to fetch from CAD Trust API:", errorMessage);
        return fallbackToMockData(projectUid, errorMessage);
    }
}

/**
 * Fetches a carbon project by registry ID (e.g., "VCS-934", "GS-7845")
 * 
 * This is a convenience function that attempts to find the project UID
 * from the registry ID and then fetches the project data.
 * 
 * Note: In a real implementation, this would need to query the API
 * to find the project UID from the registry ID. For now, it falls back
 * to mock data lookup.
 * 
 * @param registryId - The registry-specific ID (e.g., "VCS-934")
 * @returns Promise resolving to project data with data source indicator
 * 
 * @example
 * ```typescript
 * const result = await fetchCADTrustProjectByRegistryId("VCS-934");
 * if (result.project) {
 *   console.log(`Project: ${result.project.projectName}`);
 * }
 * ```
 */
export async function fetchCADTrustProjectByRegistryId(
    registryId: string
): Promise<CADTrustFetchResult> {
    // In a real implementation, we would need to query the API to find
    // the project UID from the registry ID. For now, we'll try to use
    // the mock data lookup which has this mapping.

    const mockProject = getMockProjectByRegistryId(registryId);

    if (mockProject && mockProject.projectId) {
        // Try to fetch from live API using the project UID
        return fetchCADTrustProject(mockProject.projectId);
    }

    // If no mapping found, return mock data directly
    return {
        project: mockProject,
        dataSource: "mock",
        error: mockProject ? undefined : "Project not found",
    };
}

/**
 * Falls back to mock data when the live API is unavailable
 * 
 * @param projectUid - The Project_UID to look up in mock data
 * @param errorMessage - The error message from the failed API request
 * @returns Fetch result with mock data and error information
 */
function fallbackToMockData(projectUid: string, errorMessage: string): CADTrustFetchResult {
    const mockProject = getMockProject(projectUid);

    if (mockProject) {
        console.log(`Falling back to mock data for project: ${projectUid}`);
        return {
            project: mockProject,
            dataSource: "mock",
            error: errorMessage,
        };
    }

    // No mock data available either
    console.error(`No mock data available for project: ${projectUid}`);
    return {
        project: null,
        dataSource: "mock",
        error: `${errorMessage} (no mock data available)`,
    };
}

/**
 * Checks if the CAD Trust API is reachable
 * 
 * This function performs a simple health check by attempting to connect
 * to the API endpoint. It does not make a full RPC request.
 * 
 * @returns Promise resolving to true if API is reachable, false otherwise
 * 
 * @example
 * ```typescript
 * const isOnline = await checkCADTrustAPIHealth();
 * console.log(`API status: ${isOnline ? "online" : "offline"}`);
 * ```
 */
export async function checkCADTrustAPIHealth(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

        try {
            const response = await fetch(CAD_TRUST_API_URL, {
                method: "HEAD",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (fetchError) {
            clearTimeout(timeoutId);
            return false;
        }
    } catch (error) {
        return false;
    }
}
