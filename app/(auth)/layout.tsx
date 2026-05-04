"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global handler for localStorage quota exceeded events
  useEffect(() => {
    const handleQuotaExceeded = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.error("localStorage quota exceeded:", customEvent.detail);
      toast.error(
        "Storage quota exceeded. Please clear some data to continue.",
        {
          duration: 5000,
          action: {
            label: "Clear Data",
            onClick: () => {
              if (
                confirm(
                  "This will clear all your local data (portfolio, profile, onboarding progress). Continue?",
                )
              ) {
                localStorage.clear();
                window.location.reload();
              }
            },
          },
        },
      );
    };

    window.addEventListener("localStorage:quotaExceeded", handleQuotaExceeded);

    return () => {
      window.removeEventListener(
        "localStorage:quotaExceeded",
        handleQuotaExceeded,
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-10">{children}</main>
        <Footer />
        <ConsentBanner />
      </div>
    </div>
  );
}
