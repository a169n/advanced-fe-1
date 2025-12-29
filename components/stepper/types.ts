import type { ReactNode } from "react";

export type StepperChangeHandler = (nextStep: number) => void;

export type StepperRenderProp = (activeStep: number) => ReactNode;

export interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  activeStep?: number;
  onStepChange?: StepperChangeHandler;
}

export interface StepProps {
  index: number;
  title: string;
}

export interface StepperContentProps {
  children: StepperRenderProp;
}

export interface StepperStepsProps {
  children: ReactNode;
}

export interface StepperControlsProps {
  children: ReactNode;
}

export interface StepperButtonProps {
  children?: ReactNode;
}
