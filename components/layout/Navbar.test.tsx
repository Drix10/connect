import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders Carbon Trade X logo and name", () => {
    render(<Navbar />);

    expect(screen.getByText("Carbon Trade X")).toBeInTheDocument();
  });

  it("displays Live CAD Trust badge", () => {
    render(<Navbar />);

    expect(screen.getByText("Live CAD Trust")).toBeInTheDocument();
  });

  it("displays demo user avatar and name", () => {
    render(<Navbar />);

    expect(screen.getByText("Demo User")).toBeInTheDocument();
  });

  it("has link to profile page", () => {
    render(<Navbar />);

    const profileLink = screen.getByRole("link", {
      name: /demo user/i,
    });
    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  it("has link to dashboard from logo", () => {
    render(<Navbar />);

    const logoLinks = screen.getAllByRole("link", {
      name: /carbon trade x/i,
    });
    expect(logoLinks[0]).toHaveAttribute("href", "/dashboard");
  });
});
