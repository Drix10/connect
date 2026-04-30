"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingChecklist } from "./OnboardingChecklist";

export function RegistryOnboardingTabs() {
  return (
    <Tabs defaultValue="verra" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="verra">Verra Registry</TabsTrigger>
        <TabsTrigger value="goldStandard">Gold Standard</TabsTrigger>
      </TabsList>

      <TabsContent value="verra">
        <OnboardingChecklist registry="verra" />
      </TabsContent>

      <TabsContent value="goldStandard">
        <OnboardingChecklist registry="goldStandard" />
      </TabsContent>
    </Tabs>
  );
}
