import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightCircle } from "lucide-react";
import { toast } from "sonner";

import { Form, FormFooter } from "@/features/auth/global/form";
import { Header } from "@/features/app/global/header";
import { Button } from "@/modules/ui/button";
import { objectHasNullOrUndefined } from "@/helpers/object";
import {
  EventFormState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";

import { RecurringEventDetails } from "./modules/recurring-details";
import { TicketEventDetails } from "./modules/ticket-details";
import { FundraisingEventDetails } from "./modules/fundraising-details";
import { TicketsOverview } from "./modules/tickets-overview";
import { CreateEventActionDrawer } from "./modules/action-drawer";
import { useMultistep } from "./hooks/multistep";

interface StepConfig {
  title: string;
  description: string;
  component: JSX.Element;
  cta: string;
  position: "stacked" | "inline";
}

const CreateEventOptions = () => {
  const { formState, setFormState } = useEventFormStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isCancellationDrawerOpen, setIsCancellationDrawerOpen] =
    useState(false);

  const { recurrence, ticketing, fundRaiser, currentTicketIndex } = formState;
  const hasTickets = (ticketing?.length || 0) >= 1;
  const isAddingTicket = currentTicketIndex > 0;

  const { previous: initialPreviousStep } = useMultistep([]);

  const handlePreviousStep = useCallback(() => {
    initialPreviousStep();
    setFormState({
      ...formState,
      currentTicketIndex: currentTicketIndex + 1,
    });
  }, [initialPreviousStep, setFormState, formState, currentTicketIndex]);

  const steps = useMemo((): StepConfig[] => {
    const baseSteps: StepConfig[] = [
      {
        title: "Event Recurrence",
        description: "Set How Often You Want Your Event To Recur",
        component: <RecurringEventDetails />,
        cta: "Is This A Recurring event?",
        position: "stacked",
      },
      {
        title:
          isAddingTicket && currentTicketIndex !== 0
            ? "Add Ticket Type"
            : "Ticket Details",
        description: "Enter the required Ticket information below.",
        component: <TicketEventDetails />,
        cta: "Is This A Paid Ticketed event?",
        position: isAddingTicket ? "inline" : "stacked",
      },
      {
        title: "Fundraising Details",
        description: "Enter the required Fundraising information below.",
        component: <FundraisingEventDetails />,
        cta: "Do You want To Use This Event For A fundraiser?",
        position: "stacked",
      },
    ];

    if (hasTickets) {
      baseSteps.splice(2, 0, {
        title: "Review Tickets",
        description: "Review Ticket information below.",
        component: <TicketsOverview previousStep={handlePreviousStep} />,
        cta: "Would you like to review your tickets?",
        position: "stacked",
      });
    }

    return baseSteps;
  }, [hasTickets, isAddingTicket, currentTicketIndex, handlePreviousStep]);

  const multistep = useMultistep(steps.map((step) => step.component));
  const {
    currentIndex: stepIndex,
    currentStep: stepComponent,
    next: nextStep,
    previous: multistepPreviousStep,
    isLastStep: isLastStep,
  } = multistep;

  const currentStepConfig = steps[stepIndex];

  const handlePreviousRoute = useCallback(() => {
    if (isAddingTicket && stepIndex === 1) {
      nextStep();
    } else {
      multistepPreviousStep();
      if (currentStepConfig.title === "Fundraising Details" && hasTickets)
        return;
      setIsDrawerOpen(true);
    }
  }, [
    isAddingTicket,
    stepIndex,
    nextStep,
    multistepPreviousStep,
    currentStepConfig?.title,
    hasTickets,
  ]);

  const handleOptionCancellation = useCallback(() => {
    const updates: Partial<EventFormState> = {};

    switch (currentStepConfig?.title) {
      case "Event Recurrence":
        updates.recurrence = undefined;
        break;
      case "Ticket Details":
      case "Add Ticket Type":
        updates.currentTicketIndex = 0;
        updates.ticketing = undefined;
        break;
      case "Fundraising Details":
        updates.fundRaiser = undefined;
        break;
    }

    if (Object.keys(updates).length > 0) {
      setFormState({ ...formState, ...updates });
    }
  }, [currentStepConfig?.title, setFormState, formState]);

  const validateCurrentStep = useCallback((): boolean => {
    // Early return for valid steps
    if (!recurrence && !ticketing?.[currentTicketIndex] && !fundRaiser) {
      return true;
    }

    // Validate recurrence step
    if (stepIndex === 0 && recurrence && objectHasNullOrUndefined(recurrence)) {
      toast.error("Kindly complete the form before continuing");
      return false;
    }

    // Validate ticket step
    if (
      stepIndex === 1 &&
      ticketing?.[currentTicketIndex] &&
      objectHasNullOrUndefined(ticketing[currentTicketIndex])
    ) {
      toast.error("Kindly complete the form before continuing");
      return false;
    }

    // Validate fundraising step
    if (isLastStep && fundRaiser) {
      if (objectHasNullOrUndefined(fundRaiser)) {
        toast.error("Kindly complete the form before continuing");
        return false;
      }
      if (fundRaiser.organizations && fundRaiser.organizations.length < 1) {
        toast.info("Kindly select a charity partner");
        return false;
      }
    }

    return true;
  }, [
    stepIndex,
    isLastStep,
    recurrence,
    ticketing,
    currentTicketIndex,
    fundRaiser,
  ]);

  const handleNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      navigate({ to: "/app/events/create/pre-launch" });
      return;
    }

    nextStep();

    if (
      currentStepConfig.title === "Ticket Details" ||
      currentStepConfig.title === "Add Ticket Type"
    ) {
      return;
    }

    setIsDrawerOpen(true);
  }, [
    validateCurrentStep,
    isLastStep,
    navigate,
    nextStep,
    currentStepConfig?.title,
  ]);

  useEffect(() => {
    const isTicketRelatedStep =
      currentStepConfig?.title === "Review Tickets" ||
      currentStepConfig?.title === "Add Ticket Type" ||
      currentStepConfig?.title === "Ticket Details";

    if (isTicketRelatedStep) {
      setIsDrawerOpen(false);
    }
  }, [currentStepConfig?.title]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? This will restart the form and you'll lose your progress.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleNextStep();
    },
    [handleNextStep]
  );

  const buttons = useMemo(
    () => ({
      submit: (
        <Button type="submit" className="w-full" size="lg">
          <span>Save & Continue</span>
          <ArrowRightCircle className="fill-white stroke-primary" size={24} />
        </Button>
      ),
      cancel: (
        <Button
          onClick={() => setIsCancellationDrawerOpen(true)}
          type="button"
          size="lg"
          className="w-full"
          color="primary"
          variant="secondary"
        >
          Cancel
        </Button>
      ),
    }),
    []
  );

  const isReviewOrTicketStep =
    currentStepConfig?.title === "Review Tickets" ||
    currentStepConfig?.title === "Add Ticket Type" ||
    currentStepConfig?.title === "Ticket Details";

  return (
    <Fragment>
      <Header
        header={{
          position: currentStepConfig?.position || "stacked",
          title: currentStepConfig?.title || "",
          subtitle: currentStepConfig?.description || "",
        }}
        previousRouteCallback={
          stepIndex !== 0 ? handlePreviousRoute : undefined
        }
      />

      <Form onSubmit={handleFormSubmit}>
        {stepComponent}

        <FormFooter>
          <div className="flex items-center justify-between space-x-2.5">
            {!isReviewOrTicketStep && (
              <CreateEventActionDrawer
                trigger={buttons.cancel}
                callback={{
                  primary: () => {
                    handleOptionCancellation();
                    setIsCancellationDrawerOpen(false);
                    handleNextStep();
                  },
                  secondary: () => setIsCancellationDrawerOpen(false),
                }}
                open={isCancellationDrawerOpen}
                setOpen={setIsCancellationDrawerOpen}
                title="Are you sure you want to cancel?"
              />
            )}

            <CreateEventActionDrawer
              trigger={buttons.submit}
              callback={{
                primary: () => {
                  setIsDrawerOpen(false);
                  handleOptionCancellation();
                },
                secondary: handleNextStep,
              }}
              open={isDrawerOpen}
              setOpen={setIsDrawerOpen}
              title={currentStepConfig?.cta || ""}
            />
          </div>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEventOptions;
