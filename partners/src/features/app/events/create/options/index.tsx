import { Form, FormFooter } from "@/features/auth/global/form";
import { RecurringEventDetails } from "./modules/recurring-details";
import { TicketEventDetails } from "./modules/ticket-details";
import { FundraisingEventDetails } from "./modules/fundraising-details";
import { useMultistep } from "./hooks/multistep";
import { Fragment, useEffect, useState } from "react";
import { CreateEventActionDrawer } from "./modules/action-drawer";
import { Button } from "@/modules/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { TicketsOverview } from "./modules/tickets-overview";
import { objectHasNullOrUndefined } from "@/helpers/object";
import { toast } from "sonner";
import { Header } from "@/features/app/global/header";
import { useNavigate } from "@tanstack/react-router";

const CreateEventOptions = () => {
  const { formState, setFormState } = useEventFormStore();
  const navigate = useNavigate();

  const steps = [
    {
      title: "Event Recurrence",
      description: "Set How Often You Want Your Event To Recur",
      component: <RecurringEventDetails />,
      cta: "Is This A Recurring event?",
      position: "stacked",
    },
    {
      title:
        formState.currentTicketIndex > 0 ? "Add Ticket Type" : "Ticket Details",
      description: "Enter the required Ticket information below.",
      component: <TicketEventDetails />,
      cta: "Is This A Paid Ticketed event?",
      position: formState.currentTicketIndex > 0 ? "inline" : "stacked",
    },
    ...(formState.ticketing && formState.ticketing.length >= 1
      ? [
          {
            title: "Review Tickets",
            description: "Rewview Ticket information below.",
            component: <TicketsOverview previousStep={previousStep} />,
            cta: "Would you like to review your tickets ?",
            position: "stacked",
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
    useMultistep(steps.map((item) => item.component));

  const [open, setOpen] = useState<boolean>(true);

  function previousStep() {
    previous();

    setFormState({
      ...formState,
      currentTicketIndex: formState.currentTicketIndex + 1,
    });
  }

  function previousRoute() {
    if (formState.currentTicketIndex > 0 && currentIndex === 1) {
      next();
    } else {
      previous();
    }
  }

  function nextStep() {
    if (
      currentIndex === 1 &&
      formState.ticketing &&
      formState.ticketing[formState.currentTicketIndex] &&
      objectHasNullOrUndefined(
        formState.ticketing[formState.currentTicketIndex]
      )
    ) {
      toast.error("Please complete the form before continuing");
      return;
    }

    if (
      currentIndex === 0 &&
      formState.recurrence &&
      objectHasNullOrUndefined(formState.recurrence)
    ) {
      toast.error("Please complete the form before continuing");
      return;
    }

    if (
      isLastStep &&
      formState.fundRaiser &&
      objectHasNullOrUndefined(formState.fundRaiser)
    ) {
      toast.error("Please complete the form before continuing");
      return;
    }

    if (isLastStep) {
      navigate({
        to: "/app/events/create/pre-launch",
      });
      return;
    }

    next();
    setOpen(true);
  }

  const trigger = (
    <Button
      onClick={() => {
        if (!open) {
          nextStep();
        } else {
          setOpen(true);
        }
      }}
      className="w-full"
      size="lg"
      type="button"
    >
      <span>Save & Continue</span>
      <ArrowRightCircle className="fill-white stroke-primary" size={24} />
    </Button>
  );

  useEffect(() => {
    if (isLastStep && formState.fundRaiser) {
      setOpen(false);
    }
  }, []);

  return (
    <Fragment>
      <Header
        header={{
          position: steps[currentIndex].position as any,
          title: steps[currentIndex].title,
          subtitle: steps[currentIndex].description,
        }}
        previousRouteCallback={currentIndex !== 0 ? previousRoute : undefined}
      />
      <Form>
        {currentStep}

        <FormFooter>
          <CreateEventActionDrawer
            trigger={trigger}
            callback={{
              primary: () => setOpen(false),
              secondary: () => nextStep(),
            }}
            open={open}
            setOpen={setOpen}
            title={steps[currentIndex].cta}
          />
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEventOptions;
