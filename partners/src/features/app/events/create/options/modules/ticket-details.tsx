import { useEffect } from "react";
import {
  InputWithPrefix,
  InputWithPrefixSuffix,
} from "@/features/app/global/form";
import {
  TicketTierState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import {
  FormContent,
  FormCounter,
  FormField,
} from "@/features/auth/global/form";
import { cn } from "@/lib/utils";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import {
  calculateFees,
  formatter,
} from "../../../edit/edit-ticket-type/helper/fees";
import infoIcon from "../../../edit/edit-ticket-type/assets/info.svg";
import { Switch } from "@/modules/ui/switch";
import { sanitizeNumericInput } from "@/helpers/input";
import { CurrencySelect } from "@/modules/units/form/currency";
import { useCurrencyStore } from "@/stores/currency";
import { convertGbpTo } from "@/helpers/text";
import { useCurrencyQuoteQuery } from "@/features/app/global/hooks/query";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";

type Props = {
  ticketStateContext: "adding" | "creating";
};

const DEFAULT_TICKET_STATE: TicketTierState = {
  salesEndDate: null,
  salesStartDate: null,
  signUpLimit: 1,
  ticketPrice: 0,
  ticketType: "Standard",
  ticketDetails: "",
};

export const TicketEventDetails = ({ ticketStateContext: _ticketStateContext }: Props) => {
  const { selectedCurrency, getStripeFee } = useCurrencyStore();
  const { formState, updateForm } = useEventFormStore();
  const { ticketing } = formState;
  const { data } = useCurrencyQuoteQuery();
  const hiroekFeeGbp = 1.0;

  const equivalentHiroekFee = convertGbpTo(
    hiroekFeeGbp,
    selectedCurrency.value,
    data?.quotes,
  );

  const currentIndex = formState.currentTicketIndex ?? 0;

  const activeTicket: TicketTierState =
    ticketing && ticketing[currentIndex]
      ? ticketing[currentIndex]
      : DEFAULT_TICKET_STATE;

  const updateActiveTicket = (updates: Partial<TicketTierState>) => {
    const currentTiers = ticketing ? [...ticketing] : [];
    const baseTicket = currentTiers[currentIndex] || { ...DEFAULT_TICKET_STATE };
    const newTicket: TicketTierState = {
      ...baseTicket,
      ...updates,
    };

    while (currentTiers.length <= currentIndex) {
      currentTiers.push({ ...DEFAULT_TICKET_STATE });
    }
    currentTiers[currentIndex] = newTicket;

    updateForm("ticketing", currentTiers);
  };

  const feeBreakdown = calculateFees(
    activeTicket.ticketPrice || 0,
    formState.absorbFees,
    Number(equivalentHiroekFee),
  );

  const firstTicket = ticketing && ticketing[0];
  const firstTicketIsUnlimited =
    Boolean(firstTicket && Number(firstTicket.signUpLimit) === 0);
  const firstTicketIsLimited =
    Boolean(firstTicket && Number(firstTicket.signUpLimit) > 0);

  const isLockedToFirstTicket = currentIndex > 0 && Boolean(firstTicket);
  const isUnlimited = Number(activeTicket.signUpLimit ?? 0) === 0;

  useEffect(() => {
    if (currentIndex > 0) {
      if (firstTicketIsLimited && Number(activeTicket.signUpLimit) === 0) {
        updateActiveTicket({ signUpLimit: 1 });
      } else if (
        firstTicketIsUnlimited &&
        Number(activeTicket.signUpLimit) !== 0
      ) {
        updateActiveTicket({ signUpLimit: 0 });
      }
    }
  }, [
    firstTicketIsLimited,
    firstTicketIsUnlimited,
    currentIndex,
    activeTicket.signUpLimit,
  ]);

  const handleSignUpLimitChange = (value: number) => {
    if (firstTicketIsUnlimited && currentIndex > 0) {
      updateActiveTicket({
        signUpLimit: 0,
      });
      return;
    }

    // When limited, ticket can't be zero
    const limitedValue = Math.max(1, value);
    updateActiveTicket({
      signUpLimit: limitedValue,
    });
  };

  const handleToggleUnlimited = (unlimited: boolean) => {
    if (unlimited) {
      if (currentIndex === 0 && ticketing && ticketing.length > 1) {
        const updated = ticketing.map((t) => ({ ...t, signUpLimit: 0 }));
        updateForm("ticketing", updated);
      } else {
        updateActiveTicket({ signUpLimit: 0 });
      }
    } else {
      const newLimit =
        activeTicket.signUpLimit && activeTicket.signUpLimit > 0
          ? activeTicket.signUpLimit
          : 1;
      if (currentIndex === 0 && ticketing && ticketing.length > 1) {
        const updated = ticketing.map((t, idx) => ({
          ...t,
          signUpLimit:
            idx === 0 ? newLimit : t.signUpLimit > 0 ? t.signUpLimit : 1,
        }));
        updateForm("ticketing", updated);
      } else {
        updateActiveTicket({ signUpLimit: newLimit });
      }
    }
  };

  return (
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
          prefixItem={
            <span className="font-bold text-primary/30">
              {selectedCurrency.symbol}
            </span>
          }
          placeholder="0"
          type="number"
          value={
            activeTicket.ticketPrice === 0
              ? ""
              : activeTicket.ticketPrice
          }
          onChange={({ target }) => {
            updateActiveTicket({
              ticketPrice: Number(target.value) || 0,
            });
          }}
        />
      </FormField>

      <div className="flex items-center space-x-5">
        <FormField>
          <Label className="sm:hidden">Enter Promo Code</Label>
          <InputWithPrefixSuffix
            required={
              formState.promoCode?.discount !== undefined &&
              String(formState.promoCode?.discount) !== "" &&
              String(formState.promoCode?.discount) !== "0"
            }
            prefixItem={
              <div className="bg-primary h-full py-1.5 px-2.5 rounded-md hidden sm:block">
                <span className="text-white text-xs font-extrabold">
                  Enter Promo Code
                </span>
              </div>
            }
            value={formState.promoCode?.code || ""}
            onChange={({ target }) => {
              updateForm("promoCode", {
                code: target.value,
                discount: formState.promoCode?.discount || 0,
              });
            }}
            placeholder="HSIK3XXX"
          />
        </FormField>
        <FormField>
          <Label className="sm:hidden">Promo Discount</Label>
          <InputWithPrefix
            required={
              formState.promoCode?.code !== undefined &&
              String(formState.promoCode?.code) !== ""
            }
            prefixItem={
              <div className="bg-primary h-full py-1.5 px-2.5 rounded-md hidden sm:block">
                <span className="text-white text-xs font-extrabold">
                  Promo Discount
                </span>
              </div>
            }
            suffixItem={<span className="font-bold text-primary/50">%</span>}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            value={formState.promoCode?.discount ? String(formState.promoCode.discount) : ""}
            onChange={({ target }) => {
              // Allow empty string
              if (target.value === "") {
                updateForm("promoCode", {
                  discount: 0,
                  code: formState.promoCode?.code || "",
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
                code: formState.promoCode?.code || "",
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
      </div>

      <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary space-y-4">
        <div className="flex items-end justify-end w-full">
          <img src={infoIcon} alt="" className="w-fit" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">Ticket Price</span>
          <span className="font-black text-primary">
            {selectedCurrency.symbol}
            {formatter.format(activeTicket.ticketPrice || 0)}
          </span>
        </div>
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Hiroek Fee:</span>
          <span className="font-black text-primary">
            {selectedCurrency.symbol}
            {Math.abs(activeTicket.ticketPrice || 0) > 0
              ? Number(equivalentHiroekFee || 0).toFixed(2)
              : "0"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Payment Processing Fee:</span>
          <span className="font-black text-primary">
            {activeTicket.ticketPrice > 0
              ? getStripeFee(selectedCurrency.value)
              : `${selectedCurrency.symbol}0`}
          </span>
        </div>
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Buyers Pay:</span>
          <span className="font-black text-primary">
            {selectedCurrency.symbol}
            {formatter.format(feeBreakdown.buyersPay)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">You Receive:</span>
          <span className="font-black text-primary">
            {selectedCurrency.symbol}
            {formatter.format(feeBreakdown.youReceive)}
          </span>
        </div>
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            Do you want to absorb all the fees?
          </span>
          <Switch
            onCheckedChange={(value) => {
              updateForm("absorbFees", value);
            }}
            checked={formState.absorbFees}
          />
        </div>
      </div>

      <FormField>
        <Label>Ticket Type Name</Label>
        <Input
          required
          value={activeTicket.ticketType || ""}
          placeholder="Enter Ticket Type Name"
          onChange={({ target }) => {
            updateActiveTicket({
              ticketType: target.value,
            });
          }}
        />

        <ul className="flex items-center w-full justify-between">
          {["Standard", "Silver", "Gold", "Platinum"].map((option, index) => {
            return (
              <li
                className={cn(
                  "px-4 py-2 text-xs font-bold bg-primary text-white rounded-full cursor-pointer transition-all",
                  activeTicket.ticketType === option &&
                  "text-primary bg-primary/10 border border-primary",
                )}
                key={index}
                onClick={() => {
                  updateActiveTicket({
                    ticketType: option,
                  });
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      </FormField>

      <FormField>
        <Label>Ticket Details</Label>
        <MarkdownEditor
          value={activeTicket.ticketDetails || ""}
          onChange={(markdownContent) => {
            updateActiveTicket({
              ticketDetails: markdownContent,
            });
          }}
        />
      </FormField>

      <FormField>
        <div className="flex items-center justify-between">
          <Label>No of Tickets Available</Label>
          <div className="flex items-center space-x-2">
            <span
              onClick={() => {
                if (!isLockedToFirstTicket) handleToggleUnlimited(!isUnlimited);
              }}
              className={cn(
                "text-xs font-semibold text-primary select-none",
                !isLockedToFirstTicket && "cursor-pointer",
              )}
            >
              Unlimited Tickets
            </span>
            <Switch
              checked={isUnlimited}
              onCheckedChange={handleToggleUnlimited}
              disabled={isLockedToFirstTicket}
            />
          </div>
        </div>

        {isLockedToFirstTicket && (
          <p className="text-xs text-primary/70 italic">
            Ticket tiers must match the first ticket's limit type (
            {firstTicketIsUnlimited ? "Unlimited" : "Limited"}).
          </p>
        )}

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
              activeTicket.signUpLimit && activeTicket.signUpLimit > 0
                ? activeTicket.signUpLimit
                : 1
            }
            onChange={({ target }) => {
              const cleaned = sanitizeNumericInput(target.value);
              const val = Number(cleaned);
              handleSignUpLimitChange(val <= 0 ? 1 : val);
            }}
            decrement={() => {
              const currentVal = Number(activeTicket.signUpLimit || 1);
              handleSignUpLimitChange(Math.max(1, currentVal - 1));
            }}
            increment={() => {
              const currentVal = Number(activeTicket.signUpLimit || 1);
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
            value={activeTicket.salesStartDate || ""}
            onChange={(date) => {
              const updates: Partial<TicketTierState> = {
                salesStartDate: date,
              };
              if (
                !activeTicket.salesEndDate ||
                activeTicket.salesEndDate < date
              ) {
                updates.salesEndDate = date;
              }
              updateActiveTicket(updates);
            }}
            minDate={formatDateToISO(new Date())}
            placeholder="Select sale start date"
          />
        </FormField>
        <FormField>
          <Label>Sale Ends</Label>
          <DatePicker
            required
            value={activeTicket.salesEndDate || ""}
            onChange={(date) => {
              updateActiveTicket({
                salesEndDate: date,
              });
            }}
            minDate={
              activeTicket.salesStartDate || formatDateToISO(new Date())
            }
            placeholder="Select sale end date"
          />
        </FormField>
      </div>
    </FormContent>
  );
};
