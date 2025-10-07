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
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";

export const TicketEventDetails = () => {
  const { formState, updateForm } = useEventFormStore();

  const currentIndex = formState.currentTicketIndex;

  const currentIndexState: TicketTierState =
    formState.ticketing && formState.ticketing[currentIndex]
      ? formState.ticketing[currentIndex]
      : {
          salesEndDate: null,
          salesStartDate: null,
          signUpLimit: 0,
          ticketPrice: 0,
          ticketType: "Standard",
        };

  const updateSpecificTicketTier = (
    index: number,
    updates: Partial<TicketTierState>
  ) => {
    // Debug: Log initial state
    console.log("Before update - formState.ticketing:", formState.ticketing);
    console.log("Update requested - index:", index, "updates:", updates);

    const currentTiers = formState.ticketing || [];

    // If index is out of bounds or array is empty, create/add the tier
    if (
      index < 0 ||
      index >= currentTiers.length ||
      currentTiers.length === 0
    ) {
      console.log("Creating new tier at index:", index);

      const newTier: TicketTierState = {
        ticketType: "Standard",
        ticketPrice: 0,
        signUpLimit: 0,
        salesStartDate: null,
        salesEndDate: null,
        ...updates, // Apply the updates to the new tier
      };

      // If we need to fill gaps (index > current length), create array with empty slots
      let updatedTiers: TicketTierState[];
      if (index >= currentTiers.length) {
        updatedTiers = [...currentTiers];
        // Fill gaps with default values if needed
        while (updatedTiers.length <= index) {
          updatedTiers.push({
            ticketType: "Standard",
            ticketPrice: 0,
            signUpLimit: 0,
            salesStartDate: null,
            salesEndDate: null,
          });
        }
        updatedTiers[index] = newTier;
      } else {
        // Just add to the end if index is 0 and array is empty
        updatedTiers = [...currentTiers, newTier];
      }

      console.log("Adding new tier - updatedTiers:", updatedTiers);
      updateForm("ticketing", updatedTiers);
      return;
    }

    // Update existing tier
    const updatedTiers = currentTiers.map((tier, i) =>
      i === index ? { ...tier, ...updates } : tier
    );

    console.log("Updating existing tier - updatedTiers:", updatedTiers);
    updateForm("ticketing", updatedTiers);
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
                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-full cursor-pointer"
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
          value={currentIndexState.signUpLimit}
          onChange={({ target }) => {
            updateSpecificTicketTier(currentIndex, {
              signUpLimit: Number(target.value),
            });
          }}
          decrement={() => {
            updateSpecificTicketTier(currentIndex, {
              signUpLimit: Math.abs(Number(currentIndexState.signUpLimit) - 1),
            });
          }}
          increment={() => {
            updateSpecificTicketTier(currentIndex, {
              signUpLimit: Math.abs(Number(currentIndexState.signUpLimit) + 1),
            });
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
