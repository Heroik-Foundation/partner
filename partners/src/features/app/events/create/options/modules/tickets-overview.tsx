import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { decimalFormatter } from "@/helpers/text";
import { formatISODate } from "@/helpers/time";
import { Button } from "@/modules/ui/button";
import { PlusCircle } from "lucide-react";
import trashIcon from "../assets/trash.svg";
import { toast } from "sonner";
import { useCurrencyStore } from "@/stores/currency";
import { FormField } from "@/features/auth/global/form";
import { Label } from "@/modules/ui/label";
import { Input } from "@/modules/ui/input";
import { InputWithPrefix } from "@/features/app/global/form";

type Props = {
  previousStep: () => void;
};

export const TicketsOverview = ({ previousStep }: Props) => {
  const { selectedCurrency } = useCurrencyStore();
  const { formState, deleteTicketTier, updateForm } = useEventFormStore();

  const tickets = formState.ticketing || [];

  return (
    <div className="w-full space-y-5">
      <FormField>
        <Label>Promo Code (Optional)</Label>
        <Input
          required={
            typeof formState.promoCode?.discount !== undefined &&
            String(formState.promoCode?.discount).length > 0
          }
          value={formState.promoCode?.code}
          onChange={({ target }) => {
            updateForm("promoCode", {
              code: target.value,
              discount: Number(formState.promoCode?.discount || 0),
            });
          }}
          placeholder="HSIK3XXX"
        />
      </FormField>
      <FormField>
        <Label>Discount Percentage</Label>
        <InputWithPrefix
          required={
            typeof formState.promoCode?.code !== undefined &&
            String(formState.promoCode?.code).length > 0
          }
          prefixItem={<span className="font-bold text-primary/50">%</span>}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          value={formState.promoCode?.discount || ""}
          onChange={({ target }) => {
            // Allow empty string
            if (target.value === "") {
              updateForm("promoCode", {
                //@ts-ignore
                discount: "",
                code: String(formState.promoCode?.code || ""),
              });
              return;
            }

            // Only allow numbers
            const numericValue = target.value.replace(/[^0-9]/g, "");
            let num = Number(numericValue);

            // Limit to 100
            if (num > 100) {
              num = 100;
            }

            updateForm("promoCode", {
              discount: num,
              code: String(formState.promoCode?.code || ""),
            });
          }}
          onKeyDown={(e) => {
            if (
              e.key === "e" ||
              e.key === "E" ||
              e.key === "-" ||
              e.key === "+" ||
              e.key === "."
            ) {
              e.preventDefault();
            }
          }}
        />
      </FormField>

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
