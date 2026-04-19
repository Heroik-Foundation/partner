import { useRef, useState } from "react";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { decimalFormatter } from "@/helpers/text";
import { formatISODate } from "@/helpers/time";
import { Button } from "@/modules/ui/button";
import { PlusCircle, GripVertical } from "lucide-react";
import trashIcon from "../assets/trash.svg";
import { toast } from "sonner";
import { useCurrencyStore } from "@/stores/currency";
import { MarkdownPreview } from "@/modules/ui/markdown-preview";

type Props = {
  previousStep: () => void;
};

export const TicketsOverview = ({ previousStep }: Props) => {
  const { selectedCurrency } = useCurrencyStore();
  const { formState, deleteTicketTier, reorderTickets } = useEventFormStore();
  const tickets = formState.ticketing || [];

  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (toIndex: number) => {
    if (dragIndex.current !== null && dragIndex.current !== toIndex) {
      reorderTickets(dragIndex.current, toIndex);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="w-full space-y-5">
      <ul className="space-y-5">
        {tickets.map((ticket, index) => {
          const {
            ticketType,
            ticketPrice,
            signUpLimit,
            salesEndDate,
            ticketDetails,
          } = ticket;
          const isDraggingOver = dragOverIndex === index;

          return (
            <li
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`border rounded-xl w-full transition-all cursor-grab active:cursor-grabbing select-none
              ${
                isDraggingOver
                  ? "border-primary border-2 scale-[1.01] opacity-80"
                  : "border-primary/25"
              }`}
            >
              <div className="bg-primary text-white px-4 py-5 rounded-t-xl w-full flex items-center justify-between">
                <h4 className="text-sm font-extrabold">{ticketType} Ticket</h4>
                <GripVertical className="w-4 h-4 opacity-50" />
              </div>
              <div className="p-4 text-primary flex items-center justify-between w-full">
                <div>
                  <h5 className="font-extrabold space-x-0.5">
                    <span>
                      {selectedCurrency.symbol}
                      {decimalFormatter.format(ticketPrice)}
                    </span>
                    <span className="text-xs font-semibold">
                      {Number(signUpLimit) === 0
                        ? "Tickets Available"
                        : `(${signUpLimit} Tickets Available)`}
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
              {ticketDetails && (
                <div className="px-4 py-2 text-xs sm:text-sm font-medium">
                  <MarkdownPreview content={ticketDetails} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Button
        onClick={previousStep}
        className="w-full border-2"
        size={"lg"}
        variant={"outline"}
      >
        <PlusCircle className="stroke-white fill-primary" />
        <span className="text-sm font-bold">Add Other Ticket Types</span>
      </Button>
    </div>
  );
};
