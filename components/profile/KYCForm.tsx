"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";

const STORAGE_KEY = "carbon-trade-x:profile";

const defaultProfile: UserProfile = {
  name: "Demo User",
  email: "demo@carbontradex.com",
  organization: "Carbon Trade X Demo",
  country: "India",
  kycStatus: "approved",
  consentGiven: true,
};

export function KYCForm() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedProfile: UserProfile = JSON.parse(stored);
        setProfile(loadedProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!profile.name || profile.name.trim().length === 0) {
      toast.error("Name is required");
      return;
    }

    if (!profile.email || profile.email.trim().length === 0) {
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        toast.error(
          "Storage quota exceeded. Please clear some data to continue.",
          { duration: 5000 },
        );
      } else {
        toast.error("Failed to save profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carbon-green-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* KYC Status Card */}
      <Card className="border-carbon-green-700 bg-carbon-green-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KYC Status</CardTitle>
              <CardDescription>
                Your account verification status
              </CardDescription>
            </div>
            <Badge className="bg-carbon-green-500/20 text-carbon-green-400 border-carbon-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              Demo Account — KYC Approved
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal and organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-200"
              >
                Full Name
              </label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="organization"
                className="text-sm font-medium text-gray-200"
              >
                Organization
              </label>
              <Input
                id="organization"
                value={profile.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
                placeholder="Enter your organization"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-sm font-medium text-gray-200"
              >
                Country
              </label>
              <Input
                id="country"
                value={profile.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Enter your country"
                maxLength={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>
            Configure your CAD Trust API key for live data access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium text-gray-200"
            >
              CAD Trust API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={profile.cadTrustApiKey || ""}
              onChange={(e) => handleChange("cadTrustApiKey", e.target.value)}
              placeholder="Enter your API key (optional)"
              maxLength={200}
            />
            <p className="text-xs text-gray-500">
              API key is optional. The platform will use demo data if no key is
              provided.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
