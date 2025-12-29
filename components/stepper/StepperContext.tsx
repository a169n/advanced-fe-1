"use client";

import { createContext, useContext } from "react";

interface StepperContextValue {
  activeStep: number;
  steps: number[];
  baseId: string;
  setActiveStep: (nextStep: number) => void;
  registerStep: (index: number) => void;
  unregisterStep: (index: number) => void;
  registerStepRef: (index: number, node: HTMLButtonElement | null) => void;
  focusStep: (index: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepper = () => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("Stepper components must be used within <Stepper>");
  }

  return context;
};

export default StepperContext;
