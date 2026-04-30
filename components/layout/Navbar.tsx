"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-carbon-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline-block">
            Carbon Trade X
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Live CAD Trust Badge */}
          <Badge
            variant="outline"
            className="border-carbon-green text-carbon-green hidden sm:flex"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-carbon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-carbon-green"></span>
            </span>
            Live CAD Trust
          </Badge>

          {/* Demo User Avatar */}
          <Link
            href="/profile"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-carbon-green/10 border-2 border-carbon-green flex items-center justify-center">
              <User className="h-5 w-5 text-carbon-green" />
            </div>
            <span className="text-sm font-medium text-foreground hidden md:inline-block">
              Demo User
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
