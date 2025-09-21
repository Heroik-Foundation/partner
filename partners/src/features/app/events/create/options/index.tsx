import { Form, FormFooter } from "@/features/auth/global/form";
import { RecurringEventDetails } from "./modules/recurring-details";
import { TicketEventDetails } from "./modules/ticket-details";
import { FundraisingEventDetails } from "./modules/fundraising-details";
import { useMultistep } from "./hooks/multistep";
import { useState } from "react";
import { CreateEventActionDrawer } from "./modules/action-drawer";
import { Button } from "@/modules/ui/button";
import { ArrowRightCircle } from "lucide-react";

const steps = [
  {
    title: "Event Recurrence",
    description: "Set How Often You Want Your Event To Recur",
    component: <RecurringEventDetails />,
    cta: "Is This A Recurring event?",
  },
  {
    title: "Ticket Details",
    description: "Enter the required Ticket information below.",
    component: <TicketEventDetails />,
    cta: "Is This A Paid Ticketed event?",
  },
  {
    title: "Fundraising Details",
    description: "Enter the required Fundraising information below.",
    component: <FundraisingEventDetails />,
    cta: "Do You want To Use This Event For A fundraiser?",
  },
];

const CreateEventOptions = () => {
  const { currentIndex, currentStep, next } = useMultistep(
    steps.map((item) => item.component)
  );
  const [open, setOpen] = useState<boolean>(true);

  const trigger = (
    <Button
      onClick={() => {
        if (!open) {
          next();
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

  return (
    <Form
      title={steps[currentIndex].title}
      previousRoute={true}
      description={steps[currentIndex].description}
    >
      {currentStep}

      <FormFooter>
        <CreateEventActionDrawer
          trigger={trigger}
          callback={{
            primary: () => setOpen(false),
            secondary: next,
          }}
          open={open}
          setOpen={setOpen}
          title={steps[currentIndex].cta}
        />
      </FormFooter>
    </Form>
  );
};

export default CreateEventOptions;
