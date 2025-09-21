import {
  FormContent,
  FormCounter,
  FormField,
} from "@/features/auth/global/form";
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

export const RecurringEventDetails = () => {
  const days = [
    {
      name: "Monday",
      day: 0,
    },
    {
      name: "Tuesday",
      day: 1,
    },
    {
      name: "Wednesday",
      day: 2,
    },
    {
      name: "Thursday",
      day: 3,
    },
    {
      name: "Friday",
      day: 4,
    },
    {
      name: "Saturday",
      day: 5,
    },
    {
      name: "Sunday",
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
    },
    {
      title: "After",
      value: "AFTER_OCCURRENCES",
      input: "number",
    },
  ];

  return (
    <FormContent className="space-y-7">
      <FormField>
        <Label>Repeats Every</Label>
        <div className="flex items-center max-w-xs space-x-2">
          <FormCounter />
          <Select>
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
            return (
              <Button
                type="button"
                variant={"outline"}
                className="rounded-full h-10 w-10"
                key={index}
              >
                {item.name.slice(0, 1)}
              </Button>
            );
          })}
        </div>
      </FormField>

      <FormField className="space-y-5">
        <Label>Recurrence Ends</Label>
        <RadioGroup className="space-y-5" value={recurrence[0].value}>
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
                      type={item.input}
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
