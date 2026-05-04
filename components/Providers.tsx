"use client";

import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { AuthProvider } from "./AuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component to wrap the application with necessary context providers
 * Includes ErrorBoundary and AuthProvider for authentication state management
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
