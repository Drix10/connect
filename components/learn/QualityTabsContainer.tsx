"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QualityCriterionCard } from "./QualityCriterionCard";
import {
  ClipboardCheck,
  Plus,
  Shield,
  AlertTriangle,
  Heart,
} from "lucide-react";

const qualityCriteria = {
  mrv: {
    title: "MRV Process",
    icon: ClipboardCheck,
    description:
      "Measurement, Reporting, and Verification ensures accurate quantification of emission reductions.",
    cards: [
      {
        title: "What is MRV?",
        content:
          "MRV stands for Measurement, Reporting, and Verification. It's the systematic process of quantifying, documenting, and independently verifying greenhouse gas emission reductions or removals from a carbon project.",
      },
      {
        title: "Measurement",
        content:
          "Accurate measurement involves collecting data on project activities, baseline emissions, and actual emission reductions. This includes direct measurements, calculations based on established methodologies, and monitoring of key parameters over time.",
      },
      {
        title: "Reporting",
        content:
          "Project developers must submit regular reports documenting their monitoring activities, data collection methods, and calculated emission reductions. These reports follow standardized formats and must be transparent and comprehensive.",
      },
      {
        title: "Verification",
        content:
          "Independent third-party verification bodies review project reports, visit project sites, and validate that emission reductions are real, measurable, and accurately reported. Verification provides credibility and trust in carbon credits.",
      },
    ],
  },
  additionality: {
    title: "Additionality",
    icon: Plus,
    description:
      "Projects must demonstrate that emission reductions would not have occurred without carbon credit financing.",
    cards: [
      {
        title: "What is Additionality?",
        content:
          "Additionality is the principle that a carbon project's emission reductions or removals would not have happened in the absence of carbon credit revenue. It ensures that carbon credits represent real climate benefits beyond business-as-usual scenarios.",
      },
      {
        title: "Financial Additionality",
        content:
          "Projects must demonstrate that carbon credit revenue is essential for financial viability. Without this revenue stream, the project would not be economically feasible or would face significant financial barriers to implementation.",
      },
      {
        title: "Barrier Analysis",
        content:
          "Projects identify and document barriers (technological, institutional, financial, or cultural) that would prevent implementation without carbon financing. This analysis shows why the project is not common practice in the region.",
      },
      {
        title: "Common Practice Test",
        content:
          "Projects must show they are not already widely adopted in similar contexts. If a technology or practice is already common practice, it may not qualify as additional since it would likely happen anyway.",
      },
    ],
  },
  permanence: {
    title: "Permanence",
    icon: Shield,
    description:
      "Carbon storage must be maintained long-term to ensure lasting climate benefits.",
    cards: [
      {
        title: "What is Permanence?",
        content:
          "Permanence refers to the longevity of carbon storage or emission reductions. For carbon credits to have lasting climate value, the stored carbon must remain out of the atmosphere for extended periods, ideally permanently.",
      },
      {
        title: "Permanence Risks",
        content:
          "Nature-based projects face risks like wildfires, disease, illegal logging, or land-use changes that could release stored carbon. Technology-based projects may face operational failures or policy changes affecting long-term viability.",
      },
      {
        title: "Buffer Pools",
        content:
          "Registries maintain buffer pools by withholding a percentage of credits from each project. If carbon is released due to unforeseen events (like wildfires), buffer credits are cancelled to compensate, ensuring overall integrity.",
      },
      {
        title: "Monitoring Requirements",
        content:
          "Projects must implement long-term monitoring plans to verify carbon storage continues. This includes regular site visits, satellite monitoring, and reporting requirements that extend for decades after initial credit issuance.",
      },
    ],
  },
  leakage: {
    title: "Leakage Prevention",
    icon: AlertTriangle,
    description:
      "Projects must account for and minimize emissions that shift to other locations.",
    cards: [
      {
        title: "What is Leakage?",
        content:
          "Leakage occurs when a carbon project reduces emissions in one location but causes increased emissions elsewhere. For example, protecting a forest in one area might push deforestation to adjacent unprotected areas.",
      },
      {
        title: "Types of Leakage",
        content:
          "Activity-shifting leakage happens when activities move to other locations. Market leakage occurs when project activities affect supply and demand in broader markets. Ecological leakage involves environmental impacts that shift spatially.",
      },
      {
        title: "Leakage Assessment",
        content:
          "Projects must assess potential leakage risks during design and implementation. This includes analyzing market dynamics, community dependencies, and alternative activity locations. Methodologies provide guidance on quantifying leakage.",
      },
      {
        title: "Mitigation Strategies",
        content:
          "Effective leakage prevention includes expanding project boundaries, providing alternative livelihoods, engaging surrounding communities, and monitoring broader regional trends. Credits are discounted based on estimated leakage rates.",
      },
    ],
  },
  cobenefits: {
    title: "Co-benefits",
    icon: Heart,
    description:
      "High-quality projects deliver additional social and environmental benefits beyond carbon reduction.",
    cards: [
      {
        title: "What are Co-benefits?",
        content:
          "Co-benefits are positive social, economic, and environmental impacts beyond carbon emission reductions. These include biodiversity conservation, community development, health improvements, and sustainable development contributions.",
      },
      {
        title: "Social Co-benefits",
        content:
          "Projects can create employment, improve local infrastructure, enhance education and healthcare access, empower women and marginalized groups, and strengthen community resilience. These benefits improve quality of life for local populations.",
      },
      {
        title: "Environmental Co-benefits",
        content:
          "Beyond carbon, projects may protect biodiversity, restore ecosystems, improve water quality, prevent soil erosion, and enhance ecosystem services. These environmental benefits contribute to broader conservation goals.",
      },
      {
        title: "Sustainable Development Goals",
        content:
          "Many projects align with UN Sustainable Development Goals (SDGs), contributing to poverty reduction, clean energy access, sustainable cities, climate action, and life on land. SDG alignment demonstrates comprehensive sustainability impact.",
      },
    ],
  },
};

export function QualityTabsContainer() {
  return (
    <Tabs defaultValue="mrv" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border border-gray-800">
        <TabsTrigger value="mrv" className="data-[state=active]:bg-primary/20">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">MRV Process</span>
          <span className="sm:hidden">MRV</span>
        </TabsTrigger>
        <TabsTrigger
          value="additionality"
          className="data-[state=active]:bg-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Additionality</span>
          <span className="sm:hidden">Add.</span>
        </TabsTrigger>
        <TabsTrigger
          value="permanence"
          className="data-[state=active]:bg-primary/20"
        >
          <Shield className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Permanence</span>
          <span className="sm:hidden">Perm.</span>
        </TabsTrigger>
        <TabsTrigger
          value="leakage"
          className="data-[state=active]:bg-primary/20"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Leakage</span>
          <span className="sm:hidden">Leak.</span>
        </TabsTrigger>
        <TabsTrigger
          value="cobenefits"
          className="data-[state=active]:bg-primary/20"
        >
          <Heart className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Co-benefits</span>
          <span className="sm:hidden">Co-ben.</span>
        </TabsTrigger>
      </TabsList>

      {Object.entries(qualityCriteria).map(([key, criterion]) => (
        <TabsContent key={key} value={key} className="mt-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <criterion.icon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">
                {criterion.title}
              </h2>
            </div>
            <p className="text-gray-400">{criterion.description}</p>
          </div>

          <div className="grid gap-4">
            {criterion.cards.map((card, index) => (
              <QualityCriterionCard
                key={index}
                title={card.title}
                content={card.content}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
