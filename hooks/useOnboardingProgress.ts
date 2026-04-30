'use client';

import { useState, useEffect } from 'react';
import { OnboardingStep } from '@/lib/types';
import { verraSteps, goldStandardSteps } from '@/lib/data/onboardingSteps';

const STORAGE_KEY = 'carbon-trade-x:onboarding';

interface OnboardingProgress {
    verra: OnboardingStep[];
    goldStandard: OnboardingStep[];
}

export function useOnboardingProgress(registry: 'verra' | 'goldStandard') {
    const [steps, setSteps] = useState<OnboardingStep[]>(
        registry === 'verra' ? verraSteps : goldStandardSteps
    );
    const [isLoading, setIsLoading] = useState(true);

    // Load progress from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const progress: OnboardingProgress = JSON.parse(stored);
                const savedSteps = registry === 'verra' ? progress.verra : progress.goldStandard;
                if (savedSteps && savedSteps.length > 0) {
                    setSteps(savedSteps);
                }
            }
        } catch (error) {
            console.error('Failed to load onboarding progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, [registry]);

    // Calculate completion percentage
    const completionPercentage = Math.round(
        (steps.filter((step) => step.completed).length / steps.length) * 100
    );

    // Toggle step completion
    const toggleStep = (stepId: string) => {
        setSteps((prevSteps) => {
            const updatedSteps = prevSteps.map((step) =>
                step.id === stepId ? { ...step, completed: !step.completed } : step
            );

            // Save to localStorage
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                const progress: OnboardingProgress = stored
                    ? JSON.parse(stored)
                    : { verra: verraSteps, goldStandard: goldStandardSteps };

                if (registry === 'verra') {
                    progress.verra = updatedSteps;
                } else {
                    progress.goldStandard = updatedSteps;
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            } catch (error) {
                console.error('Failed to save onboarding progress:', error);
                if (
                    error instanceof DOMException &&
                    error.name === 'QuotaExceededError'
                ) {
                    // Storage quota exceeded - notify user but keep UI state
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                            new CustomEvent('localStorage:quotaExceeded', {
                                detail: { key: STORAGE_KEY, error },
                            })
                        );
                    }
                }
            }

            return updatedSteps;
        });
    };

    // Reset all steps
    const resetProgress = () => {
        const defaultSteps = registry === 'verra' ? verraSteps : goldStandardSteps;
        setSteps(defaultSteps);

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const progress: OnboardingProgress = stored
                ? JSON.parse(stored)
                : { verra: verraSteps, goldStandard: goldStandardSteps };

            if (registry === 'verra') {
                progress.verra = defaultSteps;
            } else {
                progress.goldStandard = defaultSteps;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Failed to reset onboarding progress:', error);
        }
    };

    return {
        steps,
        completionPercentage,
        toggleStep,
        resetProgress,
        isLoading,
        isComplete: completionPercentage === 100,
    };
}
