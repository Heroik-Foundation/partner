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
import { MarkdownEditor } from "@/modules/ui/markdown-editor";
import { CurrencySelect } from "@/modules/units/form/currency";
import { useCurrencyStore } from "@/stores/currency";

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
    signUpLimit: 0,
    salesStartDate: null,
    salesEndDate: null,
  });

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
            <Label>No of Tickets Available</Label>
            <FormCounter
              required
              value={form.signUpLimit}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  signUpLimit: Number(target.value),
                }));
              }}
              increment={() => {
                setForm((prev) => ({
                  ...prev,
                  signUpLimit: Math.abs(Number(form.signUpLimit + 1)),
                }));
              }}
              decrement={() => {
                setForm((prev) => ({
                  ...prev,
                  signUpLimit: Math.abs(Number(form.signUpLimit - 1)),
                }));
              }}
            />
          </FormField>

          <div className="flex items-center space-x-2.5">
            <FormField>
              <Label>Sale Starts</Label>
              <Input
                required
                value={form.salesStartDate as any}
                type="date"
                onChange={({ target }) => {
                  setForm((prev) => ({
                    ...prev,
                    salesStartDate: target.value,
                  }));
                }}
                className="text-primary"
              />
            </FormField>

            <FormField>
              <Label>Sale Ends</Label>
              <Input
                required
                value={form.salesEndDate as any}
                onChange={({ target }) => {
                  setForm((prev) => ({
                    ...prev,
                    salesEndDate: target.value,
                  }));
                }}
                type="date"
                className="text-primary"
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
