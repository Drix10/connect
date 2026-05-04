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
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Could not load profile data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name?.trim() || !profile.email?.trim()) {
      toast.error("Name and Email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Storage might be full.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="px-8 py-6">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
        <CardHeader className="border-b border-border px-8 py-6">
          <CardTitle className="heading-display text-2xl text-white">
            Identity & Organization
          </CardTitle>
          <CardDescription className="text-base">
            Update your personal and organization details for KYC verification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
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
                className="bg-input border-border h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
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
                className="bg-input border-border h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="organization"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Organization
              </label>
              <Input
                id="organization"
                value={profile.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
                placeholder="Enter your organization"
                maxLength={100}
                className="bg-input border-border h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Country
              </label>
              <Input
                id="country"
                value={profile.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Enter your country"
                maxLength={100}
                className="bg-input border-border h-12 text-base"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          size="lg"
          className="px-8 h-12 text-base font-medium rounded-full hover:scale-105 transition-transform"
        >
          {isSaving ? "Saving..." : "Save Profile"}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
