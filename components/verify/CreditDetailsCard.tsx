"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { CADTrustProject } from "@/lib/types";

interface CreditDetailsCardProps {
  project: CADTrustProject;
  dataSource: "live" | "mock";
}

export function CreditDetailsCard({
  project,
  dataSource,
}: CreditDetailsCardProps) {
  const getRegistryUrl = (registry: string, originId: string) => {
    const registryLower = registry.toLowerCase();
    if (registryLower.includes("verra")) {
      return `https://registry.verra.org/app/projectDetail/VCS/${originId}`;
    } else if (registryLower.includes("gold")) {
      return `https://registry.goldstandard.org/projects/details/${originId}`;
    } else if (registryLower.includes("ccts")) {
      return `https://ccts.gov.in/project/${originId}`;
    }
    return null;
  };

  const registryUrl = getRegistryUrl(
    project.registryOfOrigin,
    project.originProjectId,
  );

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl text-white mb-2">
              {project.projectName}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-primary text-primary">
                {project.registryOfOrigin}
              </Badge>
              <Badge
                variant="outline"
                className={
                  dataSource === "live"
                    ? "border-green-500 text-green-500"
                    : "border-yellow-500 text-yellow-500"
                }
              >
                {dataSource === "live"
                  ? "Live from CAD Trust Data Model 2.0"
                  : "Demo Data"}
              </Badge>
            </div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white font-medium">{project.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Methodology</p>
                <p className="text-white font-medium">{project.methodology}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Validation Date</p>
                <p className="text-white font-medium">
                  {project.validationDate}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Project Type</p>
              <p className="text-white font-medium">{project.projectType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Project Scale</p>
              <p className="text-white font-medium">{project.projectScale}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Estimated Annual Emission Reductions
              </p>
              <p className="text-white font-medium">
                {project.estimatedAnnualEmissionReductions.toLocaleString()}{" "}
                tCO₂e
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Validation Body</p>
              <p className="text-white font-medium">{project.validationBody}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Registry ID</p>
              <p className="text-white font-medium">
                {project.originProjectId}
              </p>
            </div>
            {registryUrl && (
              <Button variant="outline" asChild>
                <a
                  href={registryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Full Registry
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {project.projectStatus && (
          <div className="bg-gray-950 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Project Status</p>
            <p className="text-white font-medium">{project.projectStatus}</p>
            {project.projectStatusDate && (
              <p className="text-xs text-gray-500 mt-1">
                As of {project.projectStatusDate}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
