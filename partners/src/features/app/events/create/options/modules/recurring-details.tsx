import {
  EventFormRecurrenceState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import {
  FormContent,
  FormCounter,
  FormField,
} from "@/features/auth/global/form";
import { sanitizeNumericInput } from "@/helpers/input";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { RadioGroup, RadioGroupItem } from "@/modules/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/modules/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const RecurringEventDetails = () => {
  const { formState, updateForm } = useEventFormStore();

  const updateRecurrenceField = <K extends keyof EventFormRecurrenceState>(
    field: K,
    value: EventFormRecurrenceState[K]
  ) => {
    updateForm("recurrence", {
      ...(formState.recurrence || {}),
      [field]: value,
    });
  };

  const days = [
    {
      name: "Sunday",
      day: 0,
    },
    {
      name: "Monday",
      day: 1,
    },
    {
      name: "Tuesday",
      day: 2,
    },
    {
      name: "Wednesday",
      day: 3,
    },
    {
      name: "Thursday",
      day: 4,
    },
    {
      name: "Friday",
      day: 5,
    },
    {
      name: "Saturday",
      day: 6,
    },
  ];

  const recurrence = [
    {
      title: "Never",
      value: "NEVER",
    },
    {
      title: "On",
      value: "UNTIL_DATE",
      input: "date",
      inputValue: formState.recurrence?.endDate,
      updateInputValue: (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecurrenceField("endDate", event.target.value);
      },
    },
    {
      title: "After",
      value: "AFTER_OCCURRENCES",
      input: "number",
      inputValue: formState.recurrence?.occurrenceCount,
      updateInputValue: (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRecurrenceField(
          "occurrenceCount",
          //@ts-ignore
          sanitizeNumericInput(event.target.value)
        );
      },
    },
  ];

  return (
    <FormContent className="space-y-7">
      <FormField>
        <Label>Repeats Every</Label>
        <div className="flex items-center max-w-xs space-x-2">
          <FormCounter
            required
            value={formState.recurrence?.interval}
            onChange={({ target }) => {
              updateRecurrenceField(
                "interval",
                //@ts-ignore
                sanitizeNumericInput(target.value)
              );
            }}
            increment={() => {
              updateRecurrenceField(
                "interval",
                Math.abs(Number(formState.recurrence?.interval || 0) + 1)
              );
            }}
            decrement={() => {
              updateRecurrenceField(
                "interval",
                Math.abs(Number(formState.recurrence?.interval || 0) - 1)
              );
            }}
          />

          <Select
            required
            onValueChange={(value: "WEEKLY" | "MONTHLY") => {
              updateRecurrenceField("frequency", value);
            }}
            value={formState.recurrence?.frequency}
          >
            <SelectTrigger className="w-[180px] h-[56px]" asChild>
              <Button
                className="border-2 border-primary/20 justify-between"
                variant={"outline"}
              >
                <SelectValue placeholder="Frequency" />

                <ChevronDown />
              </Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormField>

      <FormField>
        <Label>Repeats On</Label>
        <div className="space-x-2.5">
          {days.map((item, index) => {
            const isSelected =
              formState.recurrence?.daysOfWeek?.includes(item.day) || false;

            return (
              <Button
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={`rounded-full h-10 w-10 ${isSelected ? "bg-primary text-white" : ""}`}
                key={index}
                onClick={() => {
                  const currentDays = formState.recurrence?.daysOfWeek || [];
                  let newDays: number[];

                  if (currentDays.includes(item.day)) {
                    newDays = currentDays.filter((day) => day !== item.day);
                  } else {
                    newDays = [...currentDays, item.day];
                  }

                  updateRecurrenceField("daysOfWeek", newDays);
                }}
              >
                {item.name.slice(0, 1)}
              </Button>
            );
          })}
        </div>
      </FormField>

      <FormField className="space-y-5">
        <Label>Recurrence Ends</Label>
        <RadioGroup
          className="space-y-5"
          onValueChange={(
            value: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES"
          ) => {
            updateRecurrenceField("endType", value);
          }}
          value={formState.recurrence?.endType}
        >
          {recurrence.map((item, index) => {
            return (
              <div
                className="flex items-center space-x-2 border-b pb-2.5"
                key={index}
              >
                <RadioGroupItem value={item.value} id={item.value} />
                <div className="flex items-center space-x-2">
                  <Label htmlFor={item.value}>{item.title}</Label>
                  {item.input && (
                    <Input
                      name={item.title.toLowerCase()}
                      value={item.inputValue}
                      type={item.input}
                      onChange={(event) => {
                        item.updateInputValue(event);
                      }}
                      readOnly={formState.recurrence?.endType !== item.value}
                      required={
                        (formState.recurrence?.endType === "UNTIL_DATE" &&
                          item.value === "UNTIL_DATE") ||
                        (formState.recurrence?.endType ===
                          "AFTER_OCCURRENCES" &&
                          item.value === "AFTER_OCCURRENCES")
                      }
                      onFocus={() => {
                        if (formState.recurrence?.endType !== item.value) {
                          toast.info("Select this option to input value");
                        }
                      }}
                      className={cn(
                        "w-fit h-10",
                        item.input === "number" && "w-20"
                      )}
                    />
                  )}
                  {item.input === "number" && (
                    <Label htmlFor={item.value}>Occurances</Label>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </FormField>
    </FormContent>
  );
};
