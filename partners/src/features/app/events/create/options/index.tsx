import { Form, FormFooter } from "@/features/auth/global/form";
import { RecurringEventDetails } from "./modules/recurring-details";
import { TicketEventDetails } from "./modules/ticket-details";
import { FundraisingEventDetails } from "./modules/fundraising-details";
import { TicketsOverview } from "./modules/tickets-overview";
import { CreateEventActionDrawer } from "./modules/action-drawer";
import { useMultistep } from "./hooks/multistep";
import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/modules/ui/button";
import { ArrowRightCircle } from "lucide-react";
import {
  EventFormState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import { objectHasNullOrUndefined } from "@/helpers/object";
import { toast } from "sonner";
import { Header } from "@/features/app/global/header";
import { useNavigate } from "@tanstack/react-router";

type StepConfig = {
  title: string;
  description: string;
  component: JSX.Element;
  cta: string;
  position: "stacked" | "inline";
};

const CreateEventOptions = () => {
  const { formState, setFormState } = useEventFormStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [openCancellationDrawer, setOpenCancellationDrawer] = useState(false);

  const { recurrence, ticketing, fundRaiser, currentTicketIndex } = formState;
  const hasTickets = (ticketing?.length || 0) >= 1;
  const isAddingTicket = currentTicketIndex > 0;

  const { previous } = useMultistep([]);

  const handlePreviousStep = useCallback(() => {
    previous();
    setFormState({
      ...formState,
      currentTicketIndex: currentTicketIndex + 1,
    });
  }, [previous, setFormState, formState, currentTicketIndex]);

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
  }, [hasTickets, isAddingTicket, handlePreviousStep]);

  const multistep = useMultistep(steps.map((step) => step.component));

  const {
    currentIndex: stepIndex,
    currentStep: stepComponent,
    next: nextStep,
    previous: previousStep,
    isLastStep: lastStep,
  } = multistep;

  const currentStepConfig = steps[stepIndex];

  const handlePreviousRoute = useCallback(() => {
    if (isAddingTicket && stepIndex === 1) {
      nextStep();
    } else {
      previousStep();
      setOpen(true);
    }
  }, [isAddingTicket, stepIndex, nextStep, previousStep]);

  const handleOptionCancellation = useCallback(() => {
    const updates: Partial<EventFormState> = {};

    if (currentStepConfig.title === "Event Recurrence") {
      updates.recurrence = undefined;
    } else if (currentStepConfig.title === "Ticket Details") {
      updates.currentTicketIndex = 0;
      updates.ticketing = undefined;
    } else if (currentStepConfig.title === "Fundraising Details") {
      updates.fundRaiser = undefined;
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
    if (lastStep && fundRaiser) {
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
    lastStep,
    recurrence,
    ticketing,
    currentTicketIndex,
    fundRaiser,
  ]);

  const shouldCloseDrawer = useCallback((): boolean => {
    return (
      (lastStep && !!fundRaiser) ||
      (stepIndex === 0 && !!recurrence) ||
      ((stepIndex === 1 || stepIndex === 2) && hasTickets)
    );
  }, [lastStep, fundRaiser, stepIndex, recurrence, hasTickets]);

  const handleNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    if (lastStep) {
      navigate({ to: "/app/events/create/pre-launch" });
      return;
    }

    nextStep();
    if (!shouldCloseDrawer()) {
      setOpen(true);
    }
  }, [validateCurrentStep, lastStep, navigate, nextStep, shouldCloseDrawer]);

  useEffect(() => {
    if (shouldCloseDrawer()) {
      setOpen(false);
    } else if (lastStep && !fundRaiser) {
      setOpen(true);
    }
  }, [shouldCloseDrawer]);

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

  // Memoize buttons to prevent unnecessary re-renders
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
          onClick={() => setOpenCancellationDrawer(true)}
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
            <CreateEventActionDrawer
              trigger={buttons.cancel}
              callback={{
                primary: () => {
                  handleOptionCancellation();
                  setOpenCancellationDrawer(false);
                  handleNextStep();
                },
                secondary: () => setOpenCancellationDrawer(false),
              }}
              open={openCancellationDrawer}
              setOpen={setOpenCancellationDrawer}
              title="Are you sure you want to cancel?"
            />

            <CreateEventActionDrawer
              trigger={buttons.submit}
              callback={{
                primary: () => setOpen(false),
                secondary: handleNextStep,
              }}
              open={open}
              setOpen={setOpen}
              title={currentStepConfig?.cta || ""}
            />
          </div>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEventOptions;
