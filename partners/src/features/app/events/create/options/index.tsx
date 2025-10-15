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
  title: string;
  description: string;
  component: JSX.Element;
  cta: string;
  position: "stacked" | "inline";
}

const CreateEventOptions = () => {
  const { formState, setFormState } = useEventFormStore();
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
        component: <TicketsOverview previousStep={() => {}} />,
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
  } = multistep;
  const currentStepConfig = steps[stepIndex];

  const handleDefaultDrawerOpenState = (): boolean => {
    if (
      isLastStep &&
      (Number(formState.fundRaiser?.fundRaisingGoal || 0) >= 0 ||
        (formState.fundRaiser?.organizations || []).length >= 0)
    ) {
      return false;
    }

    return true;
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(
    handleDefaultDrawerOpenState()
  );

  // FIXED: Correct validation logic - allow navigation when form is empty
  const validateCurrentStep = useCallback((): boolean => {
    // Allow moving to next step if user hasn't started filling the current step
    if (!recurrence && !ticketing?.[currentTicketIndex] && !fundRaiser) {
      return true;
    }

    // Validate only if the user has started filling the form
    const stepValidations = {
      0: () => !recurrence || !objectHasNullOrUndefined(recurrence),
      1: () =>
        !ticketing?.[currentTicketIndex] ||
        !objectHasNullOrUndefined(ticketing[currentTicketIndex]),
      [steps.length - 1]: () => {
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
        stepIndex === steps.length - 1 &&
        fundRaiser?.organizations?.length === 0
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
  ]);

  const handlePreviousStep = useCallback(() => {
    previous();
    if (currentStepConfig?.title !== "Fundraising Details" || !hasTickets) {
      setIsDrawerOpen(true);
    }
  }, [previous, currentStepConfig?.title, hasTickets]);

  const handleNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
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
        previousRouteCallback={stepIndex !== 0 ? handlePreviousStep : undefined}
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
