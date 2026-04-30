/**
 * Unit tests for CAD Trust API Client
 * 
 * Tests the JSON-RPC 2.0 integration with the CAD Trust Data Model 2.0 API,
 * including timeout handling, error handling, and fallback to mock data.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    fetchCADTrustProject,
    fetchCADTrustProjectByRegistryId,
    checkCADTrustAPIHealth,
} from "./cadTrust";
import { CADTrustRPCResponse } from "@/lib/types";

// Mock the fetch function
global.fetch = vi.fn();

describe("CAD Trust API Client", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("fetchCADTrustProject", () => {
        it("should successfully fetch project data from live API", async () => {
            const mockProject = {
                projectId: "verra-vcs-934",
                projectName: "Test Project",
                projectLink: "https://example.com",
                projectStatus: "Active",
                projectStatusDate: "2023-01-01",
                registryOfOrigin: "Verra",
                originProjectId: "VCS-934",
                program: "VCS",
                projectType: "Forestry",
                coveredByNDC: "No",
                ndcInformation: "N/A",
                projectScale: "Large",
                projectTags: "Forestry",
                estimatedAnnualEmissionReductions: 1000000,
                location: "Indonesia",
                methodology: "VM0015",
                validationBody: "SCS",
                validationDate: "2020-01-01",
            };

            const mockResponse: CADTrustRPCResponse = {
                jsonrpc: "2.0",
                result: mockProject,
                id: 123,
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");

            // Fast-forward timers to allow the fetch to complete
            await vi.runAllTimersAsync();

            const result = await fetchPromise;

            expect(result.dataSource).toBe("live");
            expect(result.project).toEqual(mockProject);
            expect(result.error).toBeUndefined();
            expect(global.fetch).toHaveBeenCalledWith(
                "https://rpc.climateactiondata.org/v2",
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );
        });

        it("should handle JSON-RPC error responses", async () => {
            const mockErrorResponse: CADTrustRPCResponse = {
                jsonrpc: "2.0",
                error: {
                    code: -32600,
                    message: "Invalid Request",
                },
                id: 123,
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockErrorResponse,
            });

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.error).toContain("RPC error");
            expect(result.error).toContain("Invalid Request");
        });

        it("should handle HTTP errors", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            });

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.error).toContain("HTTP error: 500");
        });

        it("should handle network errors", async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.error).toContain("Network error");
        });

        it("should timeout after 10 seconds", async () => {
            // Mock a fetch that respects the abort signal
            (global.fetch as any).mockImplementationOnce(
                (url: string, options: any) =>
                    new Promise((resolve, reject) => {
                        if (options.signal) {
                            options.signal.addEventListener("abort", () => {
                                reject(new DOMException("The operation was aborted.", "AbortError"));
                            });
                        }
                    })
            );

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");

            // Advance timers by 10 seconds to trigger timeout
            await vi.advanceTimersByTimeAsync(10000);

            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.error).toContain("Request timeout");
        }, 15000);

        it("should fall back to mock data when project exists", async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.project).not.toBeNull();
            expect(result.project?.projectId).toBe("verra-vcs-934");
        });

        it("should return null when no mock data available", async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

            const fetchPromise = fetchCADTrustProject("nonexistent-project");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.project).toBeNull();
            expect(result.error).toContain("no mock data available");
        });

        it("should handle empty result from API", async () => {
            const mockResponse: CADTrustRPCResponse = {
                jsonrpc: "2.0",
                result: null,
                id: 123,
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const fetchPromise = fetchCADTrustProject("verra-vcs-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.dataSource).toBe("mock");
            expect(result.error).toContain("Empty result from API");
        });

        it("should format JSON-RPC request correctly", async () => {
            const mockResponse: CADTrustRPCResponse = {
                jsonrpc: "2.0",
                result: {},
                id: 123,
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const fetchPromise = fetchCADTrustProject("test-project-uid");
            await vi.runAllTimersAsync();
            await fetchPromise;

            const fetchCall = (global.fetch as any).mock.calls[0];
            const requestBody = JSON.parse(fetchCall[1].body);

            expect(requestBody.jsonrpc).toBe("2.0");
            expect(requestBody.method).toBe("cadt_getProject");
            expect(requestBody.params).toEqual(["test-project-uid"]);
            expect(requestBody.id).toBeTypeOf("number");
        });
    });

    describe("fetchCADTrustProjectByRegistryId", () => {
        it("should fetch project by registry ID", async () => {
            const mockProject = {
                projectId: "verra-vcs-934",
                projectName: "Test Project",
                registryOfOrigin: "Verra",
                originProjectId: "VCS-934",
            };

            const mockResponse: CADTrustRPCResponse = {
                jsonrpc: "2.0",
                result: mockProject,
                id: 123,
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const fetchPromise = fetchCADTrustProjectByRegistryId("VCS-934");
            await vi.runAllTimersAsync();
            const result = await fetchPromise;

            expect(result.project).not.toBeNull();
            expect(result.project?.originProjectId).toBe("VCS-934");
        });

        it("should return mock data for unknown registry ID", async () => {
            const result = await fetchCADTrustProjectByRegistryId("UNKNOWN-123");

            expect(result.dataSource).toBe("mock");
            expect(result.project).toBeNull();
            expect(result.error).toBe("Project not found");
        });
    });

    describe("checkCADTrustAPIHealth", () => {
        it("should return true when API is reachable", async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
            });

            const healthPromise = checkCADTrustAPIHealth();
            await vi.runAllTimersAsync();
            const isHealthy = await healthPromise;

            expect(isHealthy).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                "https://rpc.climateactiondata.org/v2",
                expect.objectContaining({
                    method: "HEAD",
                })
            );
        });

        it("should return false when API is unreachable", async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

            const healthPromise = checkCADTrustAPIHealth();
            await vi.runAllTimersAsync();
            const isHealthy = await healthPromise;

            expect(isHealthy).toBe(false);
        });

        it("should timeout after 5 seconds", async () => {
            (global.fetch as any).mockImplementationOnce(
                (url: string, options: any) =>
                    new Promise((resolve, reject) => {
                        if (options.signal) {
                            options.signal.addEventListener("abort", () => {
                                reject(new DOMException("The operation was aborted.", "AbortError"));
                            });
                        }
                    })
            );

            const healthPromise = checkCADTrustAPIHealth();
            await vi.advanceTimersByTimeAsync(5000);
            const isHealthy = await healthPromise;

            expect(isHealthy).toBe(false);
        }, 10000);
    });
});
