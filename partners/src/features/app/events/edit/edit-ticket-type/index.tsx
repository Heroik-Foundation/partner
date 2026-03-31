import { InputWithPrefix } from "@/features/app/global/form";
import { Header } from "@/features/app/global/header";
import {
  Form,
  FormContent,
  FormCounter,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { Input } from "@/modules/ui/input";

import { Label } from "@/modules/ui/label";
import { Switch } from "@/modules/ui/switch";
import { Fragment } from "react/jsx-runtime";

import infoIcon from "./assets/info.svg";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useUpdateEventTicketTypeForm } from "./hooks/logic";
import { calculateFees, formatter } from "./helper/fees";
import { Button } from "@/modules/ui/button";
import { useEditEventTicketMutation } from "./hooks/mutation";
import { convertDateTimeInputToISOString } from "@/helpers/time";
import { cn } from "@/lib/utils";
import { sanitizeNumericInput } from "@/helpers/input";
import { useCurrencyStore } from "@/stores/currency";
import { useCurrencyQuoteQuery } from "@/features/app/global/hooks/query";
import { convertGbpTo } from "@/helpers/text";
import { CurrencySelect } from "@/modules/units/form/currency";
import { useUpdateEventMutation } from "../hooks/mutation";
import { useEffect } from "react";

const EditTicketType = () => {
  const { id, ticketTypeId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { currency } = useSearch({
    from: "/app/events/$id/edit/$ticketTypeId/",
  });

  const { getSymbolByValue, getStripeFee, selectedCurrency } =
    useCurrencyStore();
  const { data: currencyQuotes } = useCurrencyQuoteQuery();

  const currencySymbol = getSymbolByValue(currency) || "£";
  const equivalentHiroekFee = convertGbpTo(
    0.6,
    currency,
    currencyQuotes?.quotes,
  );

  const { formState, updateFormField, absorbFees } =
    useUpdateEventTicketTypeForm({ id, ticketTypeId });

  const ticketPrice = Number(formState.ticketPrice);
  const feeBreakdown = calculateFees(
    ticketPrice,
    absorbFees,
    Number(equivalentHiroekFee),
  );

  const { mutate, isPending } = useEditEventTicketMutation({
    eventId: id || "",
    ticketTypeId: ticketTypeId || "",
    ...formState,
    ticketPrice: Math.abs(ticketPrice * 100),
    ticketType: formState.ticketType.toLowerCase(),
    ...(formState.salesEndDate !== null &&
      formState.salesStartDate !== null && {
        salesEndDate: convertDateTimeInputToISOString(
          String(formState.salesEndDate),
        ),
        salesStartDate: convertDateTimeInputToISOString(
          String(formState.salesStartDate),
        ),
      }),
  });

  const {
    mutate: updateEvent,
    isPending: isUpdatingEvent,
    isSuccess,
  } = useUpdateEventMutation({
    mode: "direct",
    eventId: String(id),
    updatedFields: { currency: selectedCurrency.value },
  });

  const hasCurrencyChanged = currency !== selectedCurrency.value;
  const isUpdatingFields = hasCurrencyChanged
    ? isPending || isUpdatingEvent
    : isPending;

  useEffect(() => {
    if (isSuccess)
      navigate({ to: "/app/events/$id", params: { id: String(id) } });
  }, [isSuccess]);

  return (
    <Fragment>
      <Header
        header={{
          position: "inline",
          title: "Edit Ticket Type",
        }}
      />

      <Form>
        <FormContent>
          <FormField>
            <Label>Event Ticket Currency</Label>
            <CurrencySelect
              classNames={{
                trigger: "w-full h-12 border-primary/50",
              }}
              initialCurrency={currency}
            />
          </FormField>

          <FormField>
            <Label>Event Ticket Price</Label>
            <InputWithPrefix
              prefixItemClassName="text-primary font-bold"
              prefixItem={currencySymbol}
              placeholder="0"
              type="text"
              value={formState.ticketPrice}
              onChange={({ target }) => {
                updateFormField(
                  "ticketPrice",
                  sanitizeNumericInput(target.value),
                );
              }}
            />
          </FormField>

          <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary space-y-4">
            <div className="flex items-end justify-end w-full">
              <img src={infoIcon} alt="" className="w-fit" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Ticket Price</span>
              <span className="font-black text-primary">
                {currencySymbol}
                {formatter.format(ticketPrice)}
              </span>
            </div>
            <hr className="w-full border-primary/30" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Hiroek Fee:</span>
              <span className="font-black text-primary">
                {Math.abs(ticketPrice || 0) > 0
                  ? `${currencySymbol}${Number(equivalentHiroekFee || 0).toFixed(2)}`
                  : `${currencySymbol}0`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">
                Payment Processing Fee:
              </span>
              <span className="font-black text-primary">
                {ticketPrice > 0
                  ? getStripeFee(currency)
                  : `${currencySymbol}0`}
              </span>
            </div>
            <hr className="w-full border-primary/30" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Buyers Pay:</span>
              <span className="font-black text-primary">
                {currencySymbol}
                {formatter.format(feeBreakdown.buyersPay)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">You Receive:</span>
              <span className="font-black text-primary">
                {currencySymbol}
                {formatter.format(feeBreakdown.youReceive)}
              </span>
            </div>
            <hr className="w-full border-primary/30" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">
                Do you want to absorb all the fees?
              </span>
              <Switch checked={absorbFees} disabled />
            </div>
          </div>

          <FormField>
            <Label>Ticket Type Name</Label>

            <Input
              value={formState.ticketType}
              onChange={({ target }) => {
                updateFormField("ticketType", String(target.value));
              }}
            />

            <ul className="flex items-center justify-between">
              {["Standard", "Silver", "Gold", "Platinum"].map(
                (option, index) => {
                  return (
                    <li
                      className={cn(
                        "px-4 py-2 text-xs font-bold bg-primary text-white rounded-full cursor-pointer transition-all",
                        formState.ticketType === option &&
                          "text-primary bg-primary/10 border border-primary",
                      )}
                      key={index}
                      onClick={() => {
                        updateFormField("ticketType", option);
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
            <Label>No of Tickets Available</Label>
            <FormCounter
              value={formState.signUpLimit}
              onChange={({ target }) => {
                updateFormField("signUpLimit", Number(target.value));
              }}
              increment={() => {
                updateFormField(
                  "signUpLimit",
                  Math.abs(Number(formState.signUpLimit + 1)),
                );
              }}
              decrement={() => {
                updateFormField(
                  "signUpLimit",
                  Math.abs(Number(formState.signUpLimit - 1)),
                );
              }}
            />
          </FormField>

          <div className="flex items-center space-x-2.5">
            <FormField>
              <Label>Sale Starts</Label>
              <Input
                value={formState.salesStartDate as any}
                type="date"
                onChange={({ target }) => {
                  updateFormField("salesStartDate", target.value);
                }}
                className="text-primary"
              />
            </FormField>

            <FormField>
              <Label>Sale Ends</Label>
              <Input
                value={formState.salesEndDate as any}
                onChange={({ target }) => {
                  updateFormField("salesEndDate", target.value);
                }}
                type="date"
                className="text-primary"
              />
            </FormField>
          </div>
        </FormContent>
        <FormFooter>
          <Button
            onClick={() => {
              mutate();

              if (currency !== selectedCurrency.value) {
                updateEvent();
              }
            }}
            isPending={isUpdatingFields}
            className="w-full"
            disabled={
              formState.salesStartDate === null ||
              formState.salesStartDate === null
            }
            size={"lg"}
            type="button"
          >
            Update Ticket
          </Button>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default EditTicketType;
