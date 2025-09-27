import { Form, FormFooter } from "@/features/auth/global/form";
import { RecurringEventDetails } from "./modules/recurring-details";
import { TicketEventDetails } from "./modules/ticket-details";
import { FundraisingEventDetails } from "./modules/fundraising-details";
import { TicketsOverview } from "./modules/tickets-overview";
import { CreateEventActionDrawer } from "./modules/action-drawer";
import { useMultistep } from "./hooks/multistep";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/modules/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
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
  const [open, setOpen] = useState<boolean>(true);

  const hasTickets = (formState.ticketing?.length || 0) >= 1;
  const isAddingTicket = formState.currentTicketIndex > 0;

  const steps: StepConfig[] = [
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
    ...(hasTickets
      ? [
          {
            title: "Review Tickets",
            description: "Review Ticket information below.",
            component: <TicketsOverview previousStep={handlePreviousStep} />,
            cta: "Would you like to review your tickets?",
            position: "stacked" as const,
          },
        ]
      : []),
    {
      title: "Fundraising Details",
      description: "Enter the required Fundraising information below.",
      component: <FundraisingEventDetails />,
      cta: "Do You want To Use This Event For A fundraiser?",
      position: "stacked",
    },
  ];

  const { currentIndex, currentStep, next, previous, isLastStep } =
    useMultistep(steps.map((step) => step.component));

  const currentStepConfig = steps[currentIndex];

  function handlePreviousStep() {
    previous();
    setFormState({
      ...formState,
      currentTicketIndex: formState.currentTicketIndex + 1,
    });
  }

  function handlePreviousRoute() {
    if (isAddingTicket && currentIndex === 1) {
      next();
    } else {
      previous();
    }
  }

  function validateCurrentStep(): boolean {
    const { recurrence, ticketing, fundRaiser, currentTicketIndex } = formState;

    if (
      currentIndex === 0 &&
      recurrence &&
      objectHasNullOrUndefined(recurrence)
    ) {
      toast.error("Kindly complete the form before continuing");
      return false;
    }

    if (
      currentIndex === 1 &&
      ticketing?.[currentTicketIndex] &&
      objectHasNullOrUndefined(ticketing[currentTicketIndex])
    ) {
      toast.error("Kindly complete the form before continuing");
      return false;
    }

    if (isLastStep && fundRaiser && objectHasNullOrUndefined(fundRaiser)) {
      toast.error("Kindly complete the form before continuing");
      return false;
    }

    if (
      isLastStep &&
      fundRaiser &&
      fundRaiser.organizations &&
      fundRaiser.organizations.length < 1
    ) {
      toast.info("Kindly select a charity partner");
      return false;
    }

    return true;
  }

  function handleNextStep() {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      navigate({ to: "/app/events/create/pre-launch" });
      return;
    }

    next();
    setOpen(true);
  }

  function shouldCloseDrawer(): boolean {
    return (
      (isLastStep && !!formState.fundRaiser) ||
      (currentIndex === 0 && !!formState.recurrence) ||
      ((currentIndex === 1 || currentIndex === 2) && hasTickets)
    );
  }

  useEffect(() => {
    if (shouldCloseDrawer()) {
      setOpen(false);
    }
  }, [currentIndex, formState.fundRaiser, formState.recurrence, hasTickets]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const message =
        "Are you sure you want to leave? This will restart the form and you'll lose your progress.";
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const submitButton = (
    <Button
      onClick={() => console.log("you clicked me")}
      type="submit"
      className="w-full"
      size="lg"
    >
      <span>Save & Continue</span>
      <ArrowRightCircle className="fill-white stroke-primary" size={24} />
    </Button>
  );

  return (
    <Fragment>
      <Header
        header={{
          position: currentStepConfig.position,
          title: currentStepConfig.title,
          subtitle: currentStepConfig.description,
        }}
        previousRouteCallback={
          currentIndex !== 0 ? handlePreviousRoute : undefined
        }
      />

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleNextStep();
        }}
      >
        {currentStep}

        <FormFooter>
          <CreateEventActionDrawer
            trigger={submitButton}
            callback={{
              primary: () => setOpen(false),
              secondary: handleNextStep,
            }}
            open={open}
            setOpen={setOpen}
            title={currentStepConfig.cta}
          />
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEventOptions;
