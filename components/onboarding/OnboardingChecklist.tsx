"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Upload, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";

interface OnboardingChecklistProps {
  registry: "verra" | "goldStandard";
}

export function OnboardingChecklist({ registry }: OnboardingChecklistProps) {
  const { steps, completionPercentage, toggleStep, isLoading, isComplete } =
    useOnboardingProgress(registry);
  const [showSuccess, setShowSuccess] = useState(false);

  const registryName = registry === "verra" ? "Verra" : "Gold Standard";

  const handleSubmit = () => {
    if (!isComplete) {
      toast.error("Please complete all steps before submitting");
      return;
    }

    setShowSuccess(true);
    toast.success(`${registryName} onboarding submitted successfully!`);

    // Hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleFileUpload = (stepId: string) => {
    // Mock file upload - just show a toast
    toast.info("File upload is a demo feature");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carbon-green-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>{registryName} Onboarding Progress</CardTitle>
          <CardDescription>
            Complete all steps to submit your project for registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="font-semibold text-carbon-green-400">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-carbon-green-600 to-carbon-green-400 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {steps.filter((s) => s.completed).length} of {steps.length} steps
              completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Required Steps</CardTitle>
          <CardDescription>
            Check off each step as you complete it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  step.completed
                    ? "bg-carbon-green-950/30 border-carbon-green-700"
                    : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-carbon-green-500 rounded-full"
                  aria-label={`Toggle ${step.title}`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-carbon-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-600 hover:text-gray-400 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium mb-1 ${
                      step.completed
                        ? "text-carbon-green-400 line-through"
                        : "text-gray-200"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>

                {step.documentRequired && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileUpload(step.id)}
                    className="flex-shrink-0"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          size="lg"
          className="relative"
        >
          <CheckCheck className="w-5 h-5 mr-2" />
          Submit for Registration
        </Button>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-carbon-green-900 to-carbon-green-950 p-8 rounded-2xl shadow-2xl border border-carbon-green-700"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-carbon-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-carbon-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-carbon-green-400 mb-2">
                    Submission Successful!
                  </h3>
                  <p className="text-gray-300">
                    Your {registryName} onboarding has been submitted
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
