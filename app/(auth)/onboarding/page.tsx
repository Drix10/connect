import { RegistryOnboardingTabs } from "@/components/onboarding/RegistryOnboardingTabs";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-carbon-green-400 mb-2">
          Registry Onboarding
        </h1>
        <p className="text-gray-400">
          Complete the onboarding process for Verra or Gold Standard registries.
          Follow the step-by-step checklist to prepare your project
          documentation.
        </p>
      </div>

      <RegistryOnboardingTabs />
    </div>
  );
}
