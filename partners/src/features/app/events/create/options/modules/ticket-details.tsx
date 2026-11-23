
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
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
import { CurrencySelect } from "@/modules/units/form/currency";
import { useCurrencyStore } from "@/stores/currency";
import { convertGbpTo } from "@/helpers/text";
import { useCurrencyQuoteQuery } from "@/features/app/global/hooks/query";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";
import { TicketQuantitySelect } from "@/modules/units/form/ticket-quantity";
import { TicketPriceSelect } from "@/modules/units/form/ticket-price";

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
  const isFirstTicket = currentIndex === 0;

  // The first ticket dictates the price type for all subsequent tickets
  const firstTicket = ticketing?.[0];
  const isFirstTicketPaid =
    firstTicket?.priceType === "paid" || Number(firstTicket?.ticketPrice ?? 0) > 0;
  const isFirstTicketFree = !isFirstTicketPaid;

  const defaultPaidPrice = useMemo(
    () =>
      ticketing?.find((t) => (t.ticketPrice ?? 0) > 0)?.ticketPrice || 10,
    [ticketing],
  );

  const defaultTicketForIndex: TicketTierState = useMemo(
    () => ({
      ...DEFAULT_TICKET_STATE,
      ticketPrice: !isFirstTicket && isFirstTicketPaid ? defaultPaidPrice : 0,
      priceType: !isFirstTicket && isFirstTicketPaid ? "paid" : "free",
    }),
    [isFirstTicket, isFirstTicketPaid, defaultPaidPrice],
  );

  const activeTicket: TicketTierState =
    ticketing && ticketing[currentIndex]
      ? ticketing[currentIndex]
      : defaultTicketForIndex;

  // Ensure all tickets are synchronized if state was previously mixed
  useEffect(() => {
    if (!ticketing || ticketing.length <= 1) return;

    const firstTicket = ticketing[0];
    const shouldBePaid =
      firstTicket?.priceType === "paid" || Number(firstTicket?.ticketPrice ?? 0) > 0;
    const hasMismatch = ticketing.some((t, i) =>
      i > 0
        ? shouldBePaid
          ? (t.priceType === "free" && Number(t.ticketPrice ?? 0) === 0)
          : (t.priceType === "paid" || Number(t.ticketPrice ?? 0) > 0)
        : false,
    );

    if (hasMismatch) {
      const fallbackPrice =
        ticketing.find((t) => (t.ticketPrice ?? 0) > 0)?.ticketPrice || 0;

      const normalized = ticketing.map((t, idx) => {
        if (idx === 0) return t;
        return {
          ...t,
          priceType: shouldBePaid ? ("paid" as const) : ("free" as const),
          ticketPrice: shouldBePaid
            ? t.ticketPrice !== undefined
              ? t.ticketPrice
              : fallbackPrice
            : 0,
        };
      });
      updateForm("ticketing", normalized);
    }
  }, []);

  const updateActiveTicket = (updates: Partial<TicketTierState>) => {
    const currentTiers = ticketing ? [...ticketing] : [];
    const baseTicket =
      currentTiers[currentIndex] || { ...defaultTicketForIndex };
    const newTicket: TicketTierState = {
      ...baseTicket,
      ...updates,
    };

    while (currentTiers.length <= currentIndex) {
      currentTiers.push({ ...defaultTicketForIndex });
    }
    currentTiers[currentIndex] = newTicket;

    updateForm("ticketing", currentTiers);
  };

  const handlePriceChange = (val: number | string, mode?: "free" | "paid") => {
    const newPrice = Math.max(0, Number(val) || 0);
    const resolvedMode = mode || (newPrice > 0 ? "paid" : "free");
    const isFree = resolvedMode === "free";
    const currentTiers = ticketing ? [...ticketing] : [];

    while (currentTiers.length <= currentIndex) {
      currentTiers.push({ ...defaultTicketForIndex });
    }

    if (!isFirstTicket) {
      // Subsequent tickets are locked to match the first ticket
      if (isFirstTicketFree && !isFree) {
        toast.error(
          "The first ticket is free, so additional tickets cannot be paid.",
        );
        return;
      }
      if (isFirstTicketPaid && isFree) {
        toast.error(
          "The first ticket is a paid ticket, so additional tickets cannot be free.",
        );
        return;
      }

      currentTiers[currentIndex] = {
        ...currentTiers[currentIndex],
        ticketPrice: newPrice,
        priceType: isFree ? "free" : "paid",
      };
      updateForm("ticketing", currentTiers);
      return;
    }

    // Changing the first ticket updates all other tickets to match
    if (isFree) {
      const updatedTiers = currentTiers.map((ticket) => ({
        ...ticket,
        ticketPrice: 0,
        priceType: "free" as const,
      }));
      updateForm("ticketing", updatedTiers);
      if (currentTiers.length > 1) {
        toast.info(
          "The first ticket is set to Free. All other tickets are now free.",
        );
      }
    } else {
      const fallbackPrice = newPrice > 0 ? newPrice : 0;
      const updatedTiers = currentTiers.map((ticket, idx) => {
        if (idx === 0) {
          return {
            ...ticket,
            ticketPrice: newPrice,
            priceType: "paid" as const,
          };
        }
        return {
          ...ticket,
          ticketPrice:
            ticket.ticketPrice !== undefined ? ticket.ticketPrice : fallbackPrice,
          priceType: "paid" as const,
        };
      });
      updateForm("ticketing", updatedTiers);
      if (currentTiers.length > 1) {
        toast.info(
          "The first ticket is set to Paid. All other tickets are now paid.",
        );
      }
    }
  };

  const allowType = isFirstTicket
    ? "all"
    : isFirstTicketPaid
      ? "paid"
      : "free";

  const helperText = !isFirstTicket
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

  const feeBreakdown = calculateFees(
    activeTicket.ticketPrice || 0,
    formState.absorbFees,
    Number(equivalentHiroekFee),
  );

  const handleSignUpLimitChange = (
    value: number,
    quantityType: "unlimited" | "limited" = "limited",
  ) => {
    const limitedValue = Math.max(0, value);
    updateActiveTicket({
      signUpLimit: limitedValue,
      quantityType,
    });
  };

  const handleToggleUnlimited = (unlimited: boolean) => {
    if (unlimited) {
      if (currentIndex === 0 && ticketing && ticketing.length > 1) {
        const updated = ticketing.map((t) => ({
          ...t,
          signUpLimit: 0,
          quantityType: "unlimited" as const,
        }));
        updateForm("ticketing", updated);
      } else {
        updateActiveTicket({ signUpLimit: 0, quantityType: "unlimited" });
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
          quantityType: "limited" as const,
        }));
        updateForm("ticketing", updated);
      } else {
        updateActiveTicket({ signUpLimit: newLimit, quantityType: "limited" });
      }
    }
  };

  return (
    <FormContent>
      {!isFirstTicket && (
        <div className="flex items-center gap-2.5 p-3.5 text-xs font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20">
          <img src={infoIcon} alt="" className="w-4 h-4 shrink-0" />
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
          id="ticket-price-input"
          key={`ticket-price-${currentIndex}`}
          value={activeTicket.ticketPrice ?? 0}
          priceType={activeTicket.priceType || (isFirstTicketPaid ? "paid" : "free")}
          currencySymbol={selectedCurrency.symbol}
          returnType="number"
          allowType={allowType}
          helperText={helperText}
          onDisabledClick={handleDisabledClick}
          onChange={handlePriceChange}
        />
      </FormField>

      {(activeTicket.priceType === "paid" || (activeTicket.ticketPrice ?? 0) > 0) && (
        <>
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
        </>
      )}

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
        <TicketQuantitySelect
          id="ticket-quantity-input"
          value={activeTicket.signUpLimit ?? 0}
          quantityType={
            activeTicket.quantityType ||
            (Number(activeTicket.signUpLimit ?? 0) === 0
              ? "unlimited"
              : "limited")
          }
          onChange={(newLimit, qtyType) => {
            if (
              qtyType === "unlimited" ||
              (qtyType === undefined && newLimit === 0)
            ) {
              handleToggleUnlimited(true);
            } else {
              handleSignUpLimitChange(newLimit, "limited");
            }
          }}
        />
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
