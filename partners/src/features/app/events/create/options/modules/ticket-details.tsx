import { InputWithPrefix } from "@/features/app/global/form";
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
import { getValidTicketCount } from "../helper/ticket";

type Props = {
  ticketStateContext: "adding" | "creating";
};

const DEFAULT_TICKET_STATE: TicketTierState = {
  salesEndDate: null,
  salesStartDate: null,
  signUpLimit: 0,
  ticketPrice: 0,
  ticketType: "Standard",
};

export const TicketEventDetails = ({ ticketStateContext }: Props) => {
  const { formState, updateForm } = useEventFormStore();
  const { ticketing } = formState;

  const currentIndex =
    ticketStateContext === "creating"
      ? Math.abs(
          getValidTicketCount(ticketing) -
            (getValidTicketCount(ticketing) === 0 ? 0 : 1)
        ) || 0
      : formState.currentTicketIndex;

  const getCurrentTicketState = (): TicketTierState => {
    const hasExistingTickets = ticketing && ticketing.length > 0;
    const ticketExistsAtIndex = hasExistingTickets && ticketing[currentIndex];

    if (ticketStateContext !== "adding" && ticketExistsAtIndex) {
      return ticketing[currentIndex];
    }

    if (ticketStateContext !== "adding" && !ticketExistsAtIndex) {
      return DEFAULT_TICKET_STATE;
    }

    if (ticketStateContext === "adding" && ticketExistsAtIndex) {
      return ticketing[currentIndex];
    }

    return DEFAULT_TICKET_STATE;
  };

  const currentIndexState = getCurrentTicketState();

  const feeBreakdown = calculateFees(
    currentIndexState.ticketPrice,
    formState.absorbFees
  );

  const firstTicketHasUnlimitedSignup =
    ticketing &&
    ticketing.length >= 1 &&
    Number(ticketing[0].signUpLimit) === 0;

  const isSignUpLimitDisabled =
    firstTicketHasUnlimitedSignup && currentIndex > 1;

  const updateSpecificTicketTier = (
    index: number,
    updates: Partial<TicketTierState>
  ) => {
    const currentTiers = formState.ticketing || [];

    if (
      index < 0 ||
      index >= currentTiers.length ||
      currentTiers.length === 0
    ) {
      const newTier: TicketTierState = {
        ...DEFAULT_TICKET_STATE,
        ...updates,
      };

      let updatedTiers: TicketTierState[];

      if (index >= currentTiers.length) {
        updatedTiers = [...currentTiers];

        while (updatedTiers.length <= index) {
          updatedTiers.push({ ...DEFAULT_TICKET_STATE });
        }
        updatedTiers[index] = newTier;
      } else {
        updatedTiers = [...currentTiers, newTier];
      }

      updateForm("ticketing", updatedTiers);
      return;
    }

    const updatedTiers = currentTiers.map((tier, i) =>
      i === index ? { ...tier, ...updates } : tier
    );

    updateForm("ticketing", updatedTiers);
  };

  const handleSignUpLimitChange = (value: number) => {
    if (firstTicketHasUnlimitedSignup && currentIndex > 0) {
      updateSpecificTicketTier(currentIndex, {
        signUpLimit: 0,
      });
      return;
    }

    updateSpecificTicketTier(currentIndex, {
      signUpLimit: value,
    });
  };

  return (
    <FormContent>
      <FormField>
        <Label>Event Ticket Price</Label>
        <InputWithPrefix
          required
          prefixItem={<span className="font-bold text-primary/30">£</span>}
          placeholder="0"
          type="number"
          value={
            currentIndexState.ticketPrice === 0
              ? undefined
              : currentIndexState.ticketPrice
          }
          onChange={({ target }) => {
            updateSpecificTicketTier(currentIndex, {
              ticketPrice: Number(target.value),
            });
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
            £{formatter.format(currentIndexState.ticketPrice)}
          </span>
        </div>
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Hiroek Fee:</span>
          <span className="font-black text-primary">
            {Math.abs(currentIndexState.ticketPrice || 0) > 0 ? "£0.60" : "£0"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Payment Processing Fee:</span>
          <span className="font-black text-primary">
            {Math.abs(currentIndexState.ticketPrice || 0) > 0
              ? "1.5% + £0.20"
              : "£0"}
          </span>
        </div>
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Buyers Pay:</span>
          <span className="font-black text-primary">
            £{formatter.format(feeBreakdown.buyersPay)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">You Receive:</span>
          <span className="font-black text-primary">
            £{formatter.format(feeBreakdown.youReceive)}
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
          value={currentIndexState.ticketType}
          placeholder="Enter Ticket Type Name"
          onChange={({ target }) => {
            updateSpecificTicketTier(currentIndex, {
              ticketType: target.value,
            });
          }}
        />

        <ul className="flex items-center w-full justify-between">
          {["Standard", "Silver", "Gold", "Platnium"].map((option, index) => {
            return (
              <li
                className={cn(
                  "px-4 py-2 text-xs font-bold bg-primary text-white rounded-full cursor-pointer transition-all",
                  currentIndexState.ticketType === option &&
                    "text-primary bg-primary/10 border border-primary"
                )}
                key={index}
                onClick={() => {
                  updateSpecificTicketTier(currentIndex, {
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
        <Label>No of Tickets Available</Label>
        <FormCounter
          required
          disabled={isSignUpLimitDisabled}
          value={
            currentIndexState.signUpLimit === 0
              ? undefined
              : currentIndexState.signUpLimit
          }
          onChange={({ target }) => {
            //@ts-ignore
            handleSignUpLimitChange(sanitizeNumericInput(target.value));
          }}
          decrement={() => {
            const newValue = Math.max(
              0,
              Number(currentIndexState.signUpLimit) - 1
            );
            handleSignUpLimitChange(newValue);
          }}
          increment={() => {
            handleSignUpLimitChange(Number(currentIndexState.signUpLimit) + 1);
          }}
        />
      </FormField>

      <div className="space-x-2.5 flex items-center">
        <FormField>
          <Label>Sale Starts</Label>
          <Input
            required
            value={currentIndexState.salesStartDate || ""}
            onChange={({ target }) => {
              updateSpecificTicketTier(currentIndex, {
                salesStartDate: target.value,
              });
            }}
            className="placeholder:text-primary/50"
            type="date"
          />
        </FormField>
        <FormField>
          <Label>Sale Ends</Label>
          <Input
            required
            value={currentIndexState.salesEndDate || ""}
            onChange={({ target }) => {
              updateSpecificTicketTier(currentIndex, {
                salesEndDate: target.value,
              });
            }}
            className="placeholder:text-primary/50"
            type="date"
          />
        </FormField>
      </div>
    </FormContent>
  );
};
