"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CreditSearchFormProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
}

export function CreditSearchForm({
  onSearch,
  isLoading,
}: CreditSearchFormProps) {
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // FIXED: Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/[^\w\s-]/g, "") // Only allow alphanumeric, spaces, and hyphens
      .slice(0, 200); // Enforce max length
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null); // Clear previous errors

    const sanitizedQuery = sanitizeInput(query);

    if (sanitizedQuery.length < 2) {
      setSearchError("Search query must be at least 2 characters");
      return;
    }

    try {
      await onSearch(sanitizedQuery);
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to search. Please try again.";
      setSearchError(errorMessage);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
      <CardContent className="p-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter Verra ID, Gold Standard ID, or Project UID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
              disabled={isLoading}
              maxLength={200}
              minLength={2}
            />
            <p className="text-xs text-muted-foreground mt-3 font-light">
              Example: VCS-1234, GS-5678, or search by project name
            </p>
            {searchError && (
              <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive">{searchError}</p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || query.trim().length < 2}
            className="px-8 h-12 text-base font-medium rounded-full hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" strokeWidth={2} />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
