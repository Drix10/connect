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
  Building,
  Scale,
  BarChart,
  Info,
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
      return `https://registry.verra.org/app/projectDetail/VCS/${originId.replace("VCS-", "")}`;
    } else if (registryLower.includes("goldstandard")) {
      return `https://registry.goldstandard.org/projects/details/${originId.replace("GS-", "")}`;
    }
    return project.projectLink || null;
  };

  const registryUrl = getRegistryUrl(
    project.registryOfOrigin,
    project.originProjectId,
  );

  const DetailItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border hover-lift">
      <CardHeader className="border-b border-border px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="heading-display text-3xl text-white mb-3">
              {project.projectName}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary text-xs px-3 py-1"
              >
                {project.registryOfOrigin}
              </Badge>
              <Badge
                variant={dataSource === "live" ? "default" : "secondary"}
                className="text-xs px-3 py-1"
              >
                {dataSource === "live" ? "Live Data" : "Demo Data"}
              </Badge>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem icon={MapPin} label="Location" value={project.location} />
          <DetailItem
            icon={FileText}
            label="Methodology"
            value={project.methodology}
          />
          <DetailItem
            icon={Calendar}
            label="Validation Date"
            value={project.validationDate}
          />
          <DetailItem
            icon={Info}
            label="Project Type"
            value={project.projectType}
          />
          <DetailItem
            icon={Scale}
            label="Project Scale"
            value={project.projectScale}
          />
          <DetailItem
            icon={Building}
            label="Validation Body"
            value={project.validationBody}
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <DetailItem
            icon={BarChart}
            label="Estimated Annual Emission Reductions"
            value={
              typeof project.estimatedAnnualEmissionReductions === "number"
                ? `${project.estimatedAnnualEmissionReductions.toLocaleString()} tCO₂e`
                : "—"
            }
          />
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <DetailItem
              icon={Info}
              label="Registry ID"
              value={project.originProjectId}
            />
            {registryUrl && (
              <Button
                variant="outline"
                asChild
                className="border-border hover:bg-muted/50 rounded-full px-6"
              >
                <a
                  href={registryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View on Registry <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
