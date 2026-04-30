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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    // Validate query length
    if (trimmedQuery.length < 2) {
      return;
    }

    if (trimmedQuery.length > 200) {
      return;
    }

    await onSearch(trimmedQuery);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter Verra ID, Gold Standard ID, or CAD Trust Project UID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
              disabled={isLoading}
              maxLength={200}
              minLength={2}
            />
            <p className="text-xs text-gray-500 mt-2">
              Example: VCS-1234, GS-5678, or a CAD Trust Project UID (2-200
              characters)
            </p>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-8"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
