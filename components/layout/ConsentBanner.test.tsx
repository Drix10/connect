import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConsentBanner } from "./ConsentBanner";

describe("ConsentBanner", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("displays banner on first visit", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      expect(
        screen.getByText("Data Privacy Notice (DPDPA Compliance)"),
      ).toBeInTheDocument();
    });
  });

  it("does not display banner if consent already given", async () => {
    // Set consent in localStorage
    localStorage.setItem(
      "carbon-trade-x:consent",
      JSON.stringify({ accepted: true, date: new Date().toISOString() }),
    );

    render(<ConsentBanner />);

    await waitFor(() => {
      expect(
        screen.queryByText("Data Privacy Notice (DPDPA Compliance)"),
      ).not.toBeInTheDocument();
    });
  });

  it("displays information about localStorage usage", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      expect(
        screen.getByText(/stored only in your browser/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/do not collect, transmit, or store/i),
      ).toBeInTheDocument();
    });
  });

  it("has accept button that stores consent", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      expect(screen.getByText("Accept & Continue")).toBeInTheDocument();
    });

    const acceptButton = screen.getByText("Accept & Continue");
    fireEvent.click(acceptButton);

    await waitFor(() => {
      const consent = localStorage.getItem("carbon-trade-x:consent");
      expect(consent).toBeTruthy();
      const consentData = JSON.parse(consent!);
      expect(consentData.accepted).toBe(true);
      expect(consentData.date).toBeTruthy();
    });
  });

  it("has link to privacy policy", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      const privacyLink = screen.getByRole("link", {
        name: /read privacy policy/i,
      });
      expect(privacyLink).toHaveAttribute("href", "/privacy");
    });
  });

  it("can be dismissed without accepting", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      expect(
        screen.getByText("Data Privacy Notice (DPDPA Compliance)"),
      ).toBeInTheDocument();
    });

    const dismissButton = screen.getByLabelText("Dismiss");
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Data Privacy Notice (DPDPA Compliance)"),
      ).not.toBeInTheDocument();
    });

    // Consent should not be stored
    const consent = localStorage.getItem("carbon-trade-x:consent");
    expect(consent).toBeNull();
  });

  it("hides banner after accepting", async () => {
    render(<ConsentBanner />);

    await waitFor(() => {
      expect(
        screen.getByText("Data Privacy Notice (DPDPA Compliance)"),
      ).toBeInTheDocument();
    });

    const acceptButton = screen.getByText("Accept & Continue");
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Data Privacy Notice (DPDPA Compliance)"),
      ).not.toBeInTheDocument();
    });
  });
});
