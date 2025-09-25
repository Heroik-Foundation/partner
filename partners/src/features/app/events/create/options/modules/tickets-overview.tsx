import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { decimalFormatter } from "@/helpers/text";
import { formatISODate } from "@/helpers/time";
import { Button } from "@/modules/ui/button";
import { PlusCircle } from "lucide-react";
import trashIcon from "../assets/trash.svg";
import { toast } from "sonner";

type Props = {
  previousStep: () => void;
};

export const TicketsOverview = ({ previousStep }: Props) => {
  const { formState, deleteTicketTier } = useEventFormStore();

  const tickets = formState.ticketing || [];

  return (
    <div className="w-full space-y-5">
      <ul className="w-full space-y-5">
        {tickets.map((ticket, index) => {
          const { ticketType, ticketPrice, signUpLimit, salesEndDate } = ticket;
          return (
            <li
              key={index}
              className="border border-primary/25 rounded-xl w-full"
            >
              <div className="bg-primary text-white px-4 py-5 rounded-t-xl w-full">
                <h4 className="text-sm font-extrabold">{ticketType} Ticket</h4>
              </div>
              <div className="p-4 text-primary flex items-center justify-between w-full">
                <div>
                  <h5 className="font-extrabold space-x-0.5">
                    <span>£{decimalFormatter.format(ticketPrice)}</span>
                    <span className="text-xs font-semibold">
                      ({signUpLimit} Tickets Available)
                    </span>
                  </h5>
                  {salesEndDate && (
                    <span className="text-xs font-semibold">
                      Sale Ends On {formatISODate(String(salesEndDate)).date}
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => {
                    deleteTicketTier(index);
                    toast.success("Removed", {
                      id: "successfully-removed-ticket",
                    });
                  }}
                >
                  <img src={trashIcon} alt="" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={() => {
          previousStep();
        }}
        className="w-full border-2"
        size={"lg"}
        variant={"outline"}
      >
        <PlusCircle className="stroke-white fill-primary" />{" "}
        <span className="text-sm font-bold">Add Other Ticket Types</span>
      </Button>
    </div>
  );
};
