import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders all registry links", () => {
    render(<Footer />);

    expect(screen.getByText("Verra")).toBeInTheDocument();
    expect(screen.getByText("Gold Standard")).toBeInTheDocument();
    expect(screen.getByText("CAD Trust")).toBeInTheDocument();
    expect(screen.getByText("CCTS")).toBeInTheDocument();
  });

  it("has correct external links with proper attributes", () => {
    render(<Footer />);

    const verraLink = screen.getByRole("link", { name: /verra/i });
    expect(verraLink).toHaveAttribute("href", "https://verra.org");
    expect(verraLink).toHaveAttribute("target", "_blank");
    expect(verraLink).toHaveAttribute("rel", "noopener noreferrer");

    const goldStandardLink = screen.getByRole("link", {
      name: /gold standard/i,
    });
    expect(goldStandardLink).toHaveAttribute(
      "href",
      "https://goldstandard.org",
    );
    expect(goldStandardLink).toHaveAttribute("target", "_blank");
  });

  it("displays CAD Trust attribution", () => {
    render(<Footer />);

    expect(
      screen.getByText("Powered by CAD Trust Data Model 2.0"),
    ).toBeInTheDocument();
  });

  it("has link to CAD Trust website", () => {
    render(<Footer />);

    const cadTrustLinks = screen.getAllByRole("link", {
      name: /cad trust|powered by cad trust/i,
    });
    expect(cadTrustLinks.length).toBeGreaterThan(0);
    expect(cadTrustLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining("climateactiondata.org"),
    );
  });

  it("displays privacy policy link", () => {
    render(<Footer />);

    const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("displays copyright notice", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025 Carbon Trade X/i)).toBeInTheDocument();
  });
});
