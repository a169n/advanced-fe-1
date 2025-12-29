"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";
import StepperContext, { useStepper } from "./StepperContext";
import styles from "./styles.module.css";
import type {
  StepperContentProps,
  StepperControlsProps,
  StepperProps,
  StepperStepsProps,
  StepProps,
  StepperButtonProps,
} from "./types";

const StepperRoot = ({
  children,
  initialStep = 0,
  activeStep: controlledStep,
  onStepChange,
}: StepperProps) => {
  const baseId = useId();
  const isControlled = controlledStep !== undefined;
  const [uncontrolledStep, setUncontrolledStep] = useState(initialStep);
  const [steps, setSteps] = useState<number[]>([]);
  const stepRefs = useRef(new Map<number, HTMLButtonElement | null>());

  const activeStep = isControlled ? controlledStep : uncontrolledStep;

  const setActiveStep = useCallback(
    (nextStep: number) => {
      if (!isControlled) {
        setUncontrolledStep(nextStep);
      }
      onStepChange?.(nextStep);
    },
    [isControlled, onStepChange]
  );

  const registerStep = useCallback((index: number) => {
    setSteps((prev) => {
      if (prev.includes(index)) {
        return prev;
      }

      return [...prev, index].sort((a, b) => a - b);
    });
  }, []);

  const unregisterStep = useCallback((index: number) => {
    setSteps((prev) => prev.filter((step) => step !== index));
  }, []);

  const registerStepRef = useCallback((index: number, node: HTMLButtonElement | null) => {
    stepRefs.current.set(index, node);
  }, []);

  const focusStep = useCallback((index: number) => {
    stepRefs.current.get(index)?.focus();
  }, []);

  const value = useMemo(
    () => ({
      activeStep,
      steps,
      baseId,
      setActiveStep,
      registerStep,
      unregisterStep,
      registerStepRef,
      focusStep,
    }),
    [
      activeStep,
      steps,
      baseId,
      setActiveStep,
      registerStep,
      unregisterStep,
      registerStepRef,
      focusStep,
    ]
  );

  return (
    <StepperContext.Provider value={value}>
      <div className={styles.stepper}>{children}</div>
    </StepperContext.Provider>
  );
};

const StepperSteps = ({ children }: StepperStepsProps) => {
  return (
    <div className={styles.steps} role="tablist" aria-orientation="horizontal">
      {children}
    </div>
  );
};

const StepperStep = ({ index, title }: StepProps) => {
  const {
    activeStep,
    steps,
    baseId,
    setActiveStep,
    registerStep,
    unregisterStep,
    registerStepRef,
    focusStep,
  } = useStepper();
  const isActive = activeStep === index;
  const tabId = `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel-${index}`;

  useEffect(() => {
    registerStep(index);
    return () => unregisterStep(index);
  }, [index, registerStep, unregisterStep]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveStep(index);
      return;
    }

    const currentPosition = steps.indexOf(index);
    if (currentPosition === -1) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = steps[currentPosition + 1];
      if (nextIndex !== undefined) {
        setActiveStep(nextIndex);
        focusStep(nextIndex);
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevIndex = steps[currentPosition - 1];
      if (prevIndex !== undefined) {
        setActiveStep(prevIndex);
        focusStep(prevIndex);
      }
    }
  };

  return (
    <button
      ref={(node) => registerStepRef(index, node)}
      type="button"
      id={tabId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? styles.stepActive : styles.step}
      onClick={() => setActiveStep(index)}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.stepIndex}>{index + 1}</span>
      <span className={styles.stepTitle}>{title}</span>
    </button>
  );
};

const StepperContent = ({ children }: StepperContentProps) => {
  const { activeStep, baseId } = useStepper();
  const panelId = `${baseId}-panel-${activeStep}`;
  const tabId = `${baseId}-tab-${activeStep}`;

  return (
    <div
      className={styles.content}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
    >
      {children(activeStep)}
    </div>
  );
};

const StepperControls = ({ children }: StepperControlsProps) => {
  return <div className={styles.controls}>{children}</div>;
};

const StepperPrev = ({ children = "Previous" }: StepperButtonProps) => {
  const { activeStep, steps, setActiveStep, focusStep } = useStepper();
  const currentIndex = steps.indexOf(activeStep);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : undefined;

  return (
    <button
      type="button"
      className={styles.controlButton}
      disabled={prevStep === undefined}
      onClick={() => {
        if (prevStep !== undefined) {
          setActiveStep(prevStep);
          focusStep(prevStep);
        }
      }}
    >
      {children}
    </button>
  );
};

const StepperNext = ({ children = "Next" }: StepperButtonProps) => {
  const { activeStep, steps, setActiveStep, focusStep } = useStepper();
  const currentIndex = steps.indexOf(activeStep);
  const nextStep = currentIndex >= 0 ? steps[currentIndex + 1] : undefined;

  return (
    <button
      type="button"
      className={styles.controlButton}
      disabled={nextStep === undefined}
      onClick={() => {
        if (nextStep !== undefined) {
          setActiveStep(nextStep);
          focusStep(nextStep);
        }
      }}
    >
      {children}
    </button>
  );
};

const Stepper = Object.assign(StepperRoot, {
  Steps: StepperSteps,
  Step: StepperStep,
  Content: StepperContent,
  Controls: StepperControls,
  Prev: StepperPrev,
  Next: StepperNext,
});

export default Stepper;
