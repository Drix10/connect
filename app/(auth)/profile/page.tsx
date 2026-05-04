"use client";

import { KYCForm } from "@/components/profile/KYCForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const getKycStatusVariant = (status?: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <div className="relative z-10 space-y-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 uppercase tracking-wider">
              <User className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Account settings</span>
            </div>
            <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
              User
              <br />
              <span className="text-primary">Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              Manage your account information and verification settings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
              <CardHeader className="border-b border-border px-8 py-6">
                <CardTitle className="heading-display text-2xl text-white">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Name
                    </label>
                    <p className="heading-display text-xl text-white">
                      {user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <p className="heading-display text-xl text-white">
                      {user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Role
                    </label>
                    <p className="heading-display text-xl text-white capitalize">
                      {user?.role || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      KYC Status
                    </label>
                    <div className="mt-2">
                      <Badge
                        variant={getKycStatusVariant(user?.kycStatus)}
                        className="text-xs px-3 py-1"
                      >
                        {user?.kycStatus
                          ? user.kycStatus.replace(/_/g, " ")
                          : "Not Started"}
                      </Badge>
                    </div>
                  </div>
                  {user?.emailVerified !== undefined && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Email Verified
                      </label>
                      <div className="mt-2">
                        <Badge
                          variant={user.emailVerified ? "default" : "outline"}
                          className="text-xs px-3 py-1"
                        >
                          {user.emailVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {user?.twoFactorEnabled !== undefined && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Two-Factor
                      </label>
                      <div className="mt-2">
                        <Badge
                          variant={
                            user.twoFactorEnabled ? "default" : "outline"
                          }
                          className="text-xs px-3 py-1"
                        >
                          {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <KYCForm />
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
