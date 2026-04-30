"use client";

import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component to wrap the application with necessary context providers
 * Currently includes ErrorBoundary, can be extended with other providers as needed
 */
export function Providers({ children }: ProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
