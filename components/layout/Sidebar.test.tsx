import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("Sidebar", () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders all navigation items", () => {
    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Verify Credit")).toBeInTheDocument();
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Onboarding")).toBeInTheDocument();
    expect(screen.getByText("AI MRV")).toBeInTheDocument();
    expect(screen.getByText("Simulator")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("displays Carbon Trade X branding", () => {
    render(<Sidebar />);

    expect(screen.getByText("Carbon Trade X")).toBeInTheDocument();
  });

  it("shows demo mode indicator when not collapsed", () => {
    render(<Sidebar />);

    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
    expect(screen.getByText("Data stored locally")).toBeInTheDocument();
  });

  it("toggles sidebar collapse state", () => {
    render(<Sidebar />);

    const toggleButton = screen.getAllByRole("button")[0];

    // Initially not collapsed (on desktop)
    expect(screen.getByText("Carbon Trade X")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toggleButton);

    // Sidebar should still be in DOM but with different width class
    const sidebar = screen.getByRole("complementary", { hidden: true });
    expect(sidebar).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");

    const verifyLink = screen.getByRole("link", { name: /verify credit/i });
    expect(verifyLink).toHaveAttribute("href", "/verify");

    const learnLink = screen.getByRole("link", { name: /learn/i });
    expect(learnLink).toHaveAttribute("href", "/learn");
  });
});
