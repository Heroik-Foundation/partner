import { InputWithPrefix } from "@/features/app/global/form";
import { Header } from "@/features/app/global/header";
import {
  Form,
  FormContent,
  FormCounter,
  FormField,
} from "@/features/auth/global/form";
import { sanitizeNumericInput } from "@/helpers/input";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { CurrencySelect } from "@/modules/units/form/currency";
import { useCurrencyStore } from "@/stores/currency";
import { Switch } from "@/modules/ui/switch";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";

import { Fragment, useState } from "react";
import { useAddEventTicketMutation } from "./hooks/mutation";
import { useParams } from "@tanstack/react-router";

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

  const { selectedCurrency } = useCurrencyStore();

  const [form, setForm] = useState<FormState>({
    ticketType: "standard",
    ticketDetails: "",
    ticketPrice: "",
    signUpLimit: 1,
    salesStartDate: null,
    salesEndDate: null,
  });

  const isUnlimited = Number(form.signUpLimit ?? 0) === 0;

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

          mutate();
        }}
      >
        <FormContent>
          <FormField>
            <Label>Choose Currency</Label>
            <CurrencySelect
              classNames={{
                trigger: "w-full h-12 border-primary/50",
              }}
            />
          </FormField>

          <FormField>
            <Label>Event Ticket Price</Label>
            <InputWithPrefix
              required
              prefixItemClassName="text-primary font-bold"
              prefixItem={selectedCurrency.symbol}
              placeholder="0"
              type="text"
              value={form.ticketPrice}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  ticketPrice: sanitizeNumericInput(target.value),
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
            <div className="flex items-center justify-between">
              <Label>No of Tickets Available</Label>
              <div className="flex items-center space-x-2">
                <span
                  onClick={() => handleToggleUnlimited(!isUnlimited)}
                  className="text-xs font-semibold text-primary cursor-pointer select-none"
                >
                  Unlimited Tickets
                </span>
                <Switch
                  checked={isUnlimited}
                  onCheckedChange={handleToggleUnlimited}
                />
              </div>
            </div>

            {isUnlimited ? (
              <div className="w-full py-3.5 px-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-primary">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Unlimited Sign-ups</span>
                  <span className="text-xs text-primary/70">
                    Attendees can register without capacity restrictions.
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold bg-primary text-white rounded-full">
                  Unlimited (0)
                </span>
              </div>
            ) : (
              <FormCounter
                required
                value={
                  form.signUpLimit && form.signUpLimit > 0
                    ? form.signUpLimit
                    : 1
                }
                onChange={({ target }) => {
                  const cleaned = sanitizeNumericInput(target.value);
                  const val = Number(cleaned);
                  handleSignUpLimitChange(val <= 0 ? 1 : val);
                }}
                decrement={() => {
                  const currentVal = Number(form.signUpLimit || 1);
                  handleSignUpLimitChange(Math.max(1, currentVal - 1));
                }}
                increment={() => {
                  const currentVal = Number(form.signUpLimit || 1);
                  handleSignUpLimitChange(Math.max(1, currentVal + 1));
                }}
              />
            )}
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
                    if (!prev.salesEndDate || prev.salesEndDate < date) {
                      updates.salesEndDate = date;
                    }
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
