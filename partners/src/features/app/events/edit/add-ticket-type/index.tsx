import { Header } from "@/features/app/global/header";
import {
  Form,
  FormContent,
  FormField,
} from "@/features/auth/global/form";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { CurrencySelect } from "@/modules/units/form/currency";
import { useCurrencyStore } from "@/stores/currency";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";
import { TicketQuantitySelect } from "@/modules/units/form/ticket-quantity";
import { TicketPriceSelect } from "@/modules/units/form/ticket-price";

import { Fragment, useState, useMemo, useEffect } from "react";
import { useAddEventTicketMutation } from "./hooks/mutation";
import { useEventDetailsQuery } from "../../hooks/query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

type FormState = {
  ticketType: string;
  ticketDetails: string;
  ticketPrice: string;
  signUpLimit: number;
  salesStartDate: string | null;
  salesEndDate: string | null;
};

const AddTicketType = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data: event } = useEventDetailsQuery({
    id: id,
  });

  const { selectedCurrency } = useCurrencyStore();

  const existingTickets = useMemo(
    () => event?.ticketing || [],
    [event?.ticketing],
  );
  const hasExistingTickets = existingTickets.length > 0;
  const firstTicket = existingTickets[0];
  const isFirstTicketPaid = Number(firstTicket?.ticketPrice ?? 0) > 0;
  const isFirstTicketFree = hasExistingTickets && !isFirstTicketPaid;

  const defaultPaidPrice = useMemo(() => {
    const firstPaid = existingTickets.find((t) => Number(t.ticketPrice) > 0);
    if (firstPaid && firstPaid.ticketPrice) {
      return String(firstPaid.ticketPrice / 100);
    }
    return "10";
  }, [existingTickets]);

  const [form, setForm] = useState<FormState>({
    ticketType: "standard",
    ticketDetails: "",
    ticketPrice: "",
    signUpLimit: 1,
    salesStartDate: null,
    salesEndDate: null,
  });

  useEffect(() => {
    if (!event || !hasExistingTickets) return;

    if (isFirstTicketPaid) {
      setForm((prev) => {
        if (!prev.ticketPrice || Number(prev.ticketPrice) <= 0) {
          return { ...prev, ticketPrice: defaultPaidPrice };
        }
        return prev;
      });
    } else if (isFirstTicketFree) {
      setForm((prev) => {
        if (prev.ticketPrice !== "0") {
          return { ...prev, ticketPrice: "0" };
        }
        return prev;
      });
    }
  }, [event, hasExistingTickets, isFirstTicketPaid, isFirstTicketFree, defaultPaidPrice]);

  const allowType = hasExistingTickets
    ? isFirstTicketPaid
      ? "paid"
      : "free"
    : "all";

  const helperText = hasExistingTickets
    ? isFirstTicketFree
      ? "The first ticket is free, so additional tickets cannot be paid."
      : "The first ticket is a paid ticket, so additional tickets cannot be free."
    : undefined;

  const handleDisabledClick = (attemptedType: "free" | "paid") => {
    if (attemptedType === "paid") {
      toast.error(
        "The first ticket is free, so additional tickets cannot be paid.",
      );
    } else {
      toast.error(
        "The first ticket is a paid ticket, so additional tickets cannot be free.",
      );
    }
  };

  const handleSignUpLimitChange = (value: number) => {

    // When limited, ticket can't be zero
    const limitedValue = Math.max(1, value);
    setForm((prev) => ({
      ...prev,
      signUpLimit: limitedValue,
    }));
  };

  const handleToggleUnlimited = (unlimited: boolean) => {
    if (unlimited) {
      setForm((prev) => ({
        ...prev,
        signUpLimit: 0,
      }));
    } else {
      const newLimit =
        form.signUpLimit && form.signUpLimit > 0 ? form.signUpLimit : 1;
      setForm((prev) => ({
        ...prev,
        signUpLimit: newLimit,
      }));
    }
  };

  const { ticketDetails, ticketPrice, ...payload } = form;

  const { mutate, isPending } = useAddEventTicketMutation({
    ...payload,
    ...(ticketDetails.length >= 1 && {
      ticketDetails,
    }),
    ticketPrice: Number(ticketPrice) * 100,
    eventId: String(id),
  });

  return (
    <Fragment>
      <Header
        header={{
          position: "inline",
          title: "Add Ticket Type",
        }}
      />

      <Form
        onSubmit={(event) => {
          event.preventDefault();

          if (
            isFirstTicketPaid &&
            (!form.ticketPrice || Number(form.ticketPrice) <= 0)
          ) {
            toast.error(
              "The first ticket is a paid ticket, so this ticket must have a valid price.",
            );
            return;
          }

          if (isFirstTicketFree && Number(form.ticketPrice) > 0) {
            toast.error(
              "The first ticket is free, so additional tickets cannot be paid.",
            );
            return;
          }

          mutate();
        }}
      >
        <FormContent>
          {hasExistingTickets && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20">
              <span>
                {isFirstTicketFree
                  ? "The first ticket is free, so additional tickets cannot be paid."
                  : "The first ticket is a paid ticket, so additional tickets cannot be free."}
              </span>
            </div>
          )}

          <FormField>
            <Label>Choose Currency</Label>
            <CurrencySelect
              classNames={{
                trigger: "w-full h-12 border-primary/50",
              }}
            />
          </FormField>

          <FormField>
            <TicketPriceSelect
              value={form.ticketPrice}
              currencySymbol={selectedCurrency.symbol}
              returnType="string"
              allowType={allowType}
              helperText={helperText}
              onDisabledClick={handleDisabledClick}
              onChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  ticketPrice: String(value),
                }));
              }}
            />
          </FormField>

          <FormField>
            <Label>Ticket Type Name</Label>

            <Input
              value={form.ticketType}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  ticketType: String(target.value),
                }));
              }}
            />

            <ul className="flex items-center justify-between">
              {["Standard", "Silver", "Gold", "Platinum"].map(
                (option, index) => {
                  return (
                    <li
                      className={cn(
                        "px-4 py-2 text-xs font-bold bg-primary text-white rounded-full cursor-pointer transition-all",
                        form.ticketType === option &&
                        "text-primary bg-primary/10 border border-primary",
                      )}
                      key={index}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          ticketType: option,
                        }));
                      }}
                    >
                      {option}
                    </li>
                  );
                },
              )}
            </ul>
          </FormField>

          <FormField>
            <Label>Ticket Details</Label>
            <MarkdownEditor
              value={form.ticketDetails}
              onChange={(markdownContent) => {
                setForm((prev) => ({
                  ...prev,
                  ticketDetails: markdownContent,
                }));
              }}
            />
          </FormField>

          <FormField>
            <TicketQuantitySelect
              value={form.signUpLimit ?? 1}
              onChange={(newLimit) => {
                if (newLimit === 0) {
                  handleToggleUnlimited(true);
                } else {
                  handleSignUpLimitChange(newLimit);
                }
              }}
            />
          </FormField>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField>
              <Label>Sale Starts</Label>
              <DatePicker
                required
                value={form.salesStartDate || ""}
                onChange={(date) => {
                  setForm((prev) => {
                    const updates = { ...prev, salesStartDate: date };
                    return updates;
                  });
                }}
                minDate={formatDateToISO(new Date())}
                placeholder="Select sale start date"
              />
            </FormField>

            <FormField>
              <Label>Sale Ends</Label>
              <DatePicker
                required
                value={form.salesEndDate || ""}
                onChange={(date) => {
                  setForm((prev) => ({
                    ...prev,
                    salesEndDate: date,
                  }));
                }}
                minDate={
                  form.salesStartDate
                    ? String(form.salesStartDate)
                    : formatDateToISO(new Date())
                }
                placeholder="Select sale end date"
              />
            </FormField>
          </div>

          <Button isPending={isPending} className="w-full">
            Add Ticket
          </Button>
        </FormContent>
      </Form>
    </Fragment>
  );
};

export default AddTicketType;
