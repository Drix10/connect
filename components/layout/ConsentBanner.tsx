"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Shield } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "carbon-trade-x:consent";

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Failed to check consent status:", error);
    }
    setIsLoaded(true);
  }, []);

  const handleAccept = () => {
    try {
      const consentData = {
        accepted: true,
        date: new Date().toISOString(),
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
      setShowBanner(false);
    } catch (error) {
      console.error("Failed to save consent:", error);
      // Still hide the banner even if storage fails
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  // Don't render anything until we've checked localStorage
  if (!isLoaded || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <Card className="bg-card border-border shadow-lg">
          <div className="p-4 md:p-6">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-carbon-green/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-carbon-green" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Data Privacy Notice (DPDPA Compliance)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Carbon Trade X operates in demo mode. All your data
                  (portfolio, profile, preferences) is stored only in your
                  browser&apos;s local storage. We do not collect, transmit, or
                  store any personal information on external servers. Your data
                  remains private and under your control.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  By continuing to use this platform, you consent to this local
                  data storage practice. You can clear your data at any time by
                  clearing your browser&apos;s local storage.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-carbon-green hover:bg-carbon-green/90 text-white"
                  >
                    Accept & Continue
                  </Button>
                  <Link
                    href="/privacy"
                    className="text-sm text-carbon-green hover:underline"
                  >
                    Read Privacy Policy
                  </Link>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
