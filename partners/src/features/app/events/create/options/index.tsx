import { Fragment, useState, useCallback, useMemo } from "react";
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
  title:
    | "Event Recurrence"
    | "Add Ticket Type"
    | "Ticket Details"
    | "Fundraising Details"
    | "Review Tickets";
  description: string;
  component: JSX.Element;
  cta: string;
  position: "stacked" | "inline";
}

const CreateEventOptions = () => {
  const {
    formState,
    setFormState,
    deleteTicketTier,
    pruneRedundantTickets,
    recalculateTicketIndex,
  } = useEventFormStore();
  const navigate = useNavigate();

  const [isCancellationDrawerOpen, setIsCancellationDrawerOpen] =
    useState(false);

  const { recurrence, ticketing, fundRaiser, currentTicketIndex } = formState;
  const hasTickets = (ticketing?.length || 0) >= 1;
  const isAddingTicket = currentTicketIndex > 0;

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
        title: isAddingTicket ? "Add Ticket Type" : "Ticket Details",
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
        component: <TicketsOverview previousStep={addAdditionalTickets} />,
        cta: "Would you like to review your tickets?",
        position: "stacked",
      });
    }

    return baseSteps;
  }, [hasTickets, isAddingTicket]);

  const multistep = useMultistep(steps.map((step) => step.component));
  const {
    currentIndex: stepIndex,
    currentStep: stepComponent,
    next,
    previous,
    isLastStep,
    setCurrentIndex: setCurrentStepIndex,
    isFirstStep,
  } = multistep;
  const currentStepConfig = steps[stepIndex - 1]; // Adjust for 1-based index

  const handleDefaultDrawerOpenState = useCallback((): boolean => {
    if (
      isLastStep &&
      (Number(formState.fundRaiser?.fundRaisingGoal || 0) >= 0 ||
        (formState.fundRaiser?.organizations || []).length >= 0)
    ) {
      return false;
    }

    return true;
  }, [isLastStep, formState.fundRaiser]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(
    handleDefaultDrawerOpenState()
  );

  const validateCurrentStep = useCallback((): boolean => {
    // Allow moving to next step if user hasn't started filling the current step
    if (!recurrence && !ticketing?.[currentTicketIndex] && !fundRaiser) {
      return true;
    }

    // Validate only if the user has started filling the form
    const stepValidations = {
      1: () => !recurrence || !objectHasNullOrUndefined(recurrence), // Event Recurrence
      2: () =>
        !ticketing?.[currentTicketIndex] ||
        !objectHasNullOrUndefined(ticketing[currentTicketIndex]), // Ticket Details
      [hasTickets ? 3 : 2]: () => true, // Review Tickets (if present, index 3; else skip)
      [steps.length]: () => {
        // Fundraising Details (last step)
        if (!fundRaiser) return true;
        return (
          !objectHasNullOrUndefined(fundRaiser) &&
          (!fundRaiser.organizations || fundRaiser.organizations.length > 0)
        );
      },
    };

    const validator = stepValidations[stepIndex];

    if (validator && !validator()) {
      const errorMessage =
        stepIndex === steps.length && fundRaiser?.organizations?.length === 0
          ? "Kindly select a charity partner"
          : "Kindly complete the form before continuing";

      toast.error(errorMessage);
      return false;
    }

    return true;
  }, [
    stepIndex,
    steps.length,
    recurrence,
    ticketing,
    currentTicketIndex,
    fundRaiser,
    hasTickets,
  ]);

  const handlePreviousStep = useCallback(() => {
    previous();
    if (currentStepConfig?.title !== "Fundraising Details" || !hasTickets) {
      setIsDrawerOpen(true);
    }
    if (currentStepConfig.title === "Add Ticket Type") {
      setCurrentStepIndex(2); // Go to Ticket Details step
      deleteTicketTier(currentTicketIndex);
    }
  }, [
    previous,
    currentStepConfig?.title,
    hasTickets,
    setCurrentStepIndex,
    deleteTicketTier,
    currentTicketIndex,
  ]);

  const handleNextStep = useCallback(() => {
    pruneRedundantTickets();
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      if (!ticketing || ticketing.length < 1) {
        toast.info("Please add a ticket to continue");

        setCurrentStepIndex(2);

        return;
      }

      navigate({ to: "/app/events/create/pre-launch" });
      return;
    }

    next();

    if (!currentStepConfig?.title.includes("Ticket")) {
      setIsDrawerOpen(true);
    }
  }, [
    validateCurrentStep,
    isLastStep,
    navigate,
    next,
    currentStepConfig?.title,
    pruneRedundantTickets,
  ]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleNextStep();
    },
    [handleNextStep]
  );

  const handleOptionCancellation = useCallback(() => {
    const updates: Partial<EventFormState> = {};

    const cancellationMap: Record<string, Partial<EventFormState>> = {
      "Event Recurrence": { recurrence: undefined },
      "Ticket Details": { currentTicketIndex: 0, ticketing: undefined },
      "Add Ticket Type": { currentTicketIndex: 0, ticketing: undefined },
      "Fundraising Details": { fundRaiser: undefined },
    };

    Object.assign(updates, cancellationMap[currentStepConfig?.title] || {});

    if (Object.keys(updates).length > 0) {
      setFormState({ ...formState, ...updates });
    }
  }, [currentStepConfig?.title, setFormState, formState]);

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

  function addAdditionalTickets() {
    pruneRedundantTickets();
    recalculateTicketIndex();
    previous();
  }

  const isTicketStep = currentStepConfig?.title.includes("Ticket");
  const shouldShowDrawer = !isTicketStep && isDrawerOpen;

  return (
    <Fragment>
      <Header
        header={{
          position: currentStepConfig?.position || "stacked",
          title: currentStepConfig?.title || "",
          subtitle: currentStepConfig?.description || "",
        }}
        previousRouteCallback={isFirstStep ? undefined : handlePreviousStep} // Use isFirstStep
      />

      <Form onSubmit={handleFormSubmit}>
        {stepComponent}

        <FormFooter>
          <div className="flex items-center justify-between space-x-2.5">
            {!isTicketStep && (
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
                },
                secondary: handleNextStep,
              }}
              open={shouldShowDrawer}
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
