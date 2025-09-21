import { InputWithPrefix } from "@/features/app/global/form";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";

export const FundraisingEventDetails = () => {
  return (
    <FormContent>
      <FormField>
        <Label>Set Minimum Pledge</Label>
        <InputWithPrefix
          prefixItem={<span className="font-bold text-primary/30">£</span>}
          placeholder="0"
        />
      </FormField>

      <FormField>
        <Label>Add Charity Partner</Label>
        <Input placeholder="Charity Partner" />
      </FormField>
    </FormContent>
  );
};
