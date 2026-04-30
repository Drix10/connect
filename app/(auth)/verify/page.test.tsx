/**
 * Integration tests for credit verification flow
 * Validates: Requirements 5.1, 5.2, 5.4
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyPage from "./page";
import * as cadTrustApi from "@/lib/api/cadTrust";

// Mock the CAD Trust API
vi.mock("@/lib/api/cadTrust");

describe("Credit Verification Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should search and display credit details with live data", async () => {
    const mockProject = {
      projectId: "test-project-1",
      projectName: "Test Forestry Project",
      projectLink: "https://example.com",
      projectStatus: "Active",
      projectStatusDate: "2024-01-01",
      registryOfOrigin: "Verra",
      originProjectId: "VCS-1234",
      program: "VCS",
      projectType: "Forestry",
      coveredByNDC: "No",
      ndcInformation: "N/A",
      projectScale: "Large",
      projectTags: "forestry, conservation",
      estimatedAnnualEmissionReductions: 50000,
      location: "Brazil",
      methodology: "VM0015",
      validationBody: "SCS Global Services",
      validationDate: "2023-06-15",
    };

    vi.mocked(cadTrustApi.fetchCADTrustProject).mockResolvedValue({
      project: mockProject,
      dataSource: "live",
    });

    render(<VerifyPage />);

    // Find and fill the search input
    const searchInput = screen.getByPlaceholderText(
      /Enter Verra ID, Gold Standard ID/i,
    );
    await userEvent.type(searchInput, "VCS-1234");

    // Click search button
    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    // Wait for loading to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText("Test Forestry Project")).toBeInTheDocument();
    });

    // Verify project details are displayed
    expect(screen.getByText("Brazil")).toBeInTheDocument();
    expect(screen.getByText("VM0015")).toBeInTheDocument();
    expect(screen.getByText("2023-06-15")).toBeInTheDocument();
    expect(
      screen.getByText("Live from CAD Trust Data Model 2.0"),
    ).toBeInTheDocument();
  });

  it("should fall back to mock data on API failure", async () => {
    const mockProject = {
      projectId: "mock-project-1",
      projectName: "Mock Solar Project",
      projectLink: "https://example.com",
      projectStatus: "Active",
      projectStatusDate: "2024-01-01",
      registryOfOrigin: "Gold Standard",
      originProjectId: "GS-5678",
      program: "Gold Standard",
      projectType: "Renewable Energy",
      coveredByNDC: "No",
      ndcInformation: "N/A",
      projectScale: "Medium",
      projectTags: "solar, renewable",
      estimatedAnnualEmissionReductions: 30000,
      location: "India",
      methodology: "AMS-I.D",
      validationBody: "TÜV SÜD",
      validationDate: "2023-08-20",
    };

    vi.mocked(cadTrustApi.fetchCADTrustProject).mockResolvedValue({
      project: mockProject,
      dataSource: "mock",
    });

    render(<VerifyPage />);

    const searchInput = screen.getByPlaceholderText(
      /Enter Verra ID, Gold Standard ID/i,
    );
    await userEvent.type(searchInput, "GS-5678");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Mock Solar Project")).toBeInTheDocument();
    });

    // Verify demo data badge is shown
    expect(screen.getByText("Demo Data")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("should display loading state during API call", async () => {
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(cadTrustApi.fetchCADTrustProject).mockReturnValue(promise as any);

    render(<VerifyPage />);

    const searchInput = screen.getByPlaceholderText(
      /Enter Verra ID, Gold Standard ID/i,
    );
    await userEvent.type(searchInput, "VCS-1234");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    // Verify loading state is shown
    expect(screen.getByText("Searching registries...")).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      project: {
        projectId: "test-1",
        projectName: "Test Project",
        projectLink: "https://example.com",
        projectStatus: "Active",
        projectStatusDate: "2024-01-01",
        registryOfOrigin: "Verra",
        originProjectId: "VCS-1234",
        program: "VCS",
        projectType: "Forestry",
        coveredByNDC: "No",
        ndcInformation: "N/A",
        projectScale: "Large",
        projectTags: "test",
        estimatedAnnualEmissionReductions: 10000,
        location: "Test Location",
        methodology: "Test Method",
        validationBody: "Test Body",
        validationDate: "2024-01-01",
      },
      dataSource: "live",
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.queryByText("Searching registries..."),
      ).not.toBeInTheDocument();
    });
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(cadTrustApi.fetchCADTrustProject).mockRejectedValue(
      new Error("Network error"),
    );

    render(<VerifyPage />);

    const searchInput = screen.getByPlaceholderText(
      /Enter Verra ID, Gold Standard ID/i,
    );
    await userEvent.type(searchInput, "INVALID-ID");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});
