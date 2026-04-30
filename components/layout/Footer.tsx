"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

const registryLinks = [
  {
    name: "Verra",
    href: "https://verra.org",
    description: "Verra Registry",
  },
  {
    name: "Gold Standard",
    href: "https://goldstandard.org",
    description: "Gold Standard Registry",
  },
  {
    name: "CAD Trust",
    href: "https://climateactiondata.org",
    description: "Climate Action Data Trust",
  },
  {
    name: "CCTS",
    href: "https://ccts.gov.in",
    description: "India CCTS Registry",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Registry Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {registryLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-carbon-green transition-colors group"
            >
              <span>{link.name}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        {/* CAD Trust Attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pt-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-carbon-green flex items-center justify-center">
              <span className="text-white font-bold text-xs">CAD</span>
            </div>
            <a
              href="https://climateactiondata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-carbon-green transition-colors"
            >
              Powered by CAD Trust Data Model 2.0
            </a>
          </div>

          {/* Privacy Policy Link */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-carbon-green transition-colors"
            >
              Privacy Policy
            </Link>
            <span>© 2025 Carbon Trade X</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
