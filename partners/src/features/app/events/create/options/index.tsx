import {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
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
import { useRouteStore } from "@/hooks/router";

interface StepConfig {
  title:
    | "Event Recurrence"
    | "Add Ticket Type"
    | "Ticket Details"
    | "Review Tickets"
    | "Fundraising Details";
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
  const { previousPath } = useRouteStore();

  const [isCancellationDrawerOpen, setIsCancellationDrawerOpen] =
    useState(false);
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(true);
  const [ticketStateContext, setTicketStateContext] = useState<
    "adding" | "creating"
  >("creating");

  const isNavigatingRef = useRef(false);

  const { recurrence, ticketing, fundRaiser, currentTicketIndex } = formState;
  const hasTickets = (ticketing?.length || 0) >= 1;
  const isAddingTicket = currentTicketIndex > 0;

  function addAdditionalTickets() {
    setTicketStateContext("adding");
    pruneRedundantTickets();
    recalculateTicketIndex();
    setCurrentStepIndex(2);
  }

  const steps: StepConfig[] = useMemo(
    () => [
      {
        title: "Event Recurrence",
        description: "Set how often your event should recur.",
        component: <RecurringEventDetails />,
        cta: "Is this a recurring event?",
        position: "stacked",
      },
      {
        title: "Ticket Details",
        description: "Enter the required ticket information.",
        component: (
          <TicketEventDetails ticketStateContext={ticketStateContext} />
        ),
        cta: "Is this a paid ticketed event?",
        position: "stacked",
      },
      {
        title: "Review Tickets",
        description: "Review your ticket information.",
        component: <TicketsOverview previousStep={addAdditionalTickets} />,
        cta: "Would you like to review your tickets?",
        position: "stacked",
      },
      {
        title: "Fundraising Details",
        description: "Enter the required fundraising information.",
        component: <FundraisingEventDetails />,
        cta: "Do you want to use this event for fundraising?",
        position: "stacked",
      },
    ],
    [addAdditionalTickets]
  );

  const {
    currentIndex: stepIndex,
    currentStep: stepComponent,
    next,
    previous,
    isLastStep,
    setCurrentIndex: setCurrentStepIndex,
    isFirstStep,
  } = useMultistep(steps.map((step) => step.component));

  const currentStepConfig = useMemo(() => {
    const baseConfig = steps[stepIndex - 1];
    if (!baseConfig) return baseConfig;

    if (stepIndex === 2 && isAddingTicket && ticketStateContext === "adding") {
      return {
        ...baseConfig,
        title: "Add Ticket Type" as const,
        position: "inline" as const,
      };
    }

    return baseConfig;
  }, [stepIndex, steps, isAddingTicket, ticketStateContext]);

  useEffect(() => {
    if (currentStepConfig?.title === "Ticket Details") {
      setTicketStateContext("creating");
    } else if (currentStepConfig?.title === "Add Ticket Type") {
      setTicketStateContext("adding");
    }
  }, [currentStepConfig?.title]);

  const isTicketDetailsWithTickets = useCallback(
    () => currentStepConfig?.title === "Ticket Details" && hasTickets,
    [currentStepConfig?.title, hasTickets]
  );

  // Validate the current step
  const validateCurrentStep = useCallback(() => {
    if (!recurrence && !ticketing?.[currentTicketIndex] && !fundRaiser) {
      return true;
    }

    const stepValidations: { [key: number]: () => boolean } = {
      1: () => !recurrence || !objectHasNullOrUndefined(recurrence),
      2: () => {
        if (
          ticketing?.[currentTicketIndex] &&
          objectHasNullOrUndefined(ticketing[currentTicketIndex])
        ) {
          return false;
        }
        if (ticketing && ticketing.length > 1) {
          const signUpLimits = ticketing
            .filter((ticket) => ticket && !objectHasNullOrUndefined(ticket))
            .map((ticket) => Number(ticket.signUpLimit) || 0);

          const hasZeroLimit = signUpLimits.some((limit) => limit === 0);
          const hasNonZeroLimit = signUpLimits.some((limit) => limit > 0);

          if (hasZeroLimit && hasNonZeroLimit) {
            toast.error(
              "All tickets must have the same signup limit type. Either all unlimited (0) or all with limits."
            );
            return false;
          }
        }

        return true;
      },
      3: () => {
        if (ticketing && ticketing.length > 1) {
          const signUpLimits = ticketing
            .filter((ticket) => ticket && !objectHasNullOrUndefined(ticket))
            .map((ticket) => ticket.signUpLimit || 0);

          const hasZeroLimit = signUpLimits.some((limit) => limit === 0);
          const hasNonZeroLimit = signUpLimits.some((limit) => limit > 0);

          if (hasZeroLimit && hasNonZeroLimit) {
            toast.error(
              "All tickets must have the same signup limit type. Either all unlimited (0) or all with limits."
            );
            return false;
          }
        }
        return true;
      },
      4: () =>
        !fundRaiser ||
        (!objectHasNullOrUndefined(fundRaiser) &&
          (fundRaiser.organizations?.length ?? 0) > 0),
    };

    const validator = stepValidations[stepIndex];
    if (validator && !validator()) {
      const errorMessage =
        stepIndex === 4 && (fundRaiser?.organizations?.length ?? 0) === 0
          ? "Please select a charity partner."
          : "Please complete the form before continuing.";

      if (!(stepIndex === 2 || stepIndex === 3)) {
        toast.error(errorMessage);
      }
      return false;
    }

    return true;
  }, [stepIndex, recurrence, ticketing, currentTicketIndex, fundRaiser]);

  const handlePreviousStep = useCallback(() => {
    if (
      previousPath &&
      (previousPath?.includes("pre-launch") ||
        previousPath === "/app/events/create/pre-launch")
    ) {
      navigate({
        to: "/app/events/create/pre-launch",
      });
    }

    if (isFirstStep) {
      navigate({
        to: "/app/events/create",
      });
    }

    if (currentStepConfig?.title === "Add Ticket Type") {
      setCurrentStepIndex(3);
      deleteTicketTier(currentTicketIndex);
      setTicketStateContext("creating");
    } else {
      if (currentStepConfig?.title !== "Fundraising Details" || !hasTickets) {
        setIsActionDrawerOpen(true);
      }
      previous();
    }
  }, [
    currentStepConfig?.title,
    hasTickets,
    setCurrentStepIndex,
    deleteTicketTier,
    currentTicketIndex,
    previous,
  ]);

  const handleNextStep = useCallback(() => {
    if (isNavigatingRef.current) return;

    pruneRedundantTickets();

    if (!validateCurrentStep()) return;

    if (isLastStep) {
      if (!hasTickets) {
        toast.info("Please add a ticket to continue.");
        setCurrentStepIndex(2);
        return;
      }
      navigate({ to: "/app/events/create/pre-launch" });
      return;
    }

    isNavigatingRef.current = true;
    next();

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 0);

    if (!currentStepConfig?.title.includes("Ticket")) {
      setIsActionDrawerOpen(true);
    }
  }, [
    validateCurrentStep,
    isLastStep,
    navigate,
    next,
    currentStepConfig?.title,
    pruneRedundantTickets,
    hasTickets,
    setCurrentStepIndex,
  ]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isTicketDetailsWithTickets()) {
        return;
      }

      handleNextStep();
    },
    [handleNextStep, isTicketDetailsWithTickets]
  );

  const handleOptionCancellation = useCallback(() => {
    const updates: Partial<EventFormState> =
      {
        "Event Recurrence": { recurrence: undefined },
        "Ticket Details": { currentTicketIndex: 0, ticketing: undefined },
        "Add Ticket Type": { currentTicketIndex: 0, ticketing: undefined },
        "Fundraising Details": { fundRaiser: undefined },
        "Review Tickets": {},
      }[currentStepConfig?.title] || {};

    if (Object.keys(updates).length > 0) {
      setFormState({ ...formState, ...updates });
    }
  }, [currentStepConfig?.title, setFormState, formState]);

  const handleTicketDetailsNext = useCallback(() => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    setCurrentStepIndex(3);

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 0);
  }, [setCurrentStepIndex]);

  const buttons = useMemo(
    () => ({
      submit: (
        <Button
          type={isTicketDetailsWithTickets() ? "button" : "submit"}
          className="w-full"
          size="lg"
          onClick={() => {
            if (isTicketDetailsWithTickets()) {
              handleTicketDetailsNext();
            }
          }}
        >
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
    [isTicketDetailsWithTickets, handleTicketDetailsNext]
  );

  const isTicketStep = currentStepConfig?.title.includes("Ticket");
  const hasFundraiserData = !!(
    fundRaiser?.organizations?.length || fundRaiser?.fundRaisingGoal
  );
  const shouldShowDrawer =
    !isTicketStep && isActionDrawerOpen && !hasFundraiserData;

  return (
    <Fragment>
      <Header
        header={{
          position: currentStepConfig?.position || "stacked",
          title: currentStepConfig?.title || "",
          subtitle: currentStepConfig?.description || "",
        }}
        previousRouteCallback={handlePreviousStep}
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
                primary: () => setIsActionDrawerOpen(false),
                secondary: handleNextStep,
              }}
              open={shouldShowDrawer}
              setOpen={setIsActionDrawerOpen}
              title={currentStepConfig?.cta || ""}
            />
          </div>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEventOptions;
