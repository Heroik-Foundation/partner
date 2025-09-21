import { InputWithPrefix } from "@/features/app/global/form";
import {
  FormContent,
  FormCounter,
  FormField,
} from "@/features/auth/global/form";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";

export const TicketEventDetails = () => {
  return (
    <FormContent>
      <FormField>
        <Label>Event Ticket Price</Label>
        <InputWithPrefix
          prefixItem={<span className="font-bold text-primary/30">£</span>}
          placeholder="0"
        />
      </FormField>

      <FormField>
        <Label>Ticket Type Name</Label>
        <Input placeholder="Enter Ticket Type Name" />
      </FormField>

      <FormField>
        <Label>No of Tickets Available</Label>
        <FormCounter />
      </FormField>

      <div className="space-x-2.5 flex items-center">
        <FormField>
          <Label>Sale Starts</Label>
          <Input type="date" />
        </FormField>
        <FormField>
          <Label>Sale Starts</Label>
          <Input type="date" />
        </FormField>
      </div>
    </FormContent>
  );
};
