import { InputWithPrefix } from "@/features/app/global/form";
import {
  FundraiserState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { useNavigate } from "@tanstack/react-router";

export const FundraisingEventDetails = () => {
  const { formState, updateForm } = useEventFormStore();
  const navigate = useNavigate();

  const fundRaiserState = formState.fundRaiser || {};

  const updateFundraiserField = <K extends keyof FundraiserState>(
    field: K,
    value: FundraiserState[K]
  ) => {
    updateForm("fundRaiser", {
      ...(formState.fundRaiser || {}),
      [field]: value,
    });
  };

  return (
    <FormContent>
      <FormField>
        <Label>Set Minimum Pledge</Label>
        <InputWithPrefix
          prefixItem={<span className="font-bold text-primary/30">£</span>}
          placeholder="0"
          value={fundRaiserState.fundRaisingGoal}
          onChange={({ target }) => {
            updateFundraiserField("fundRaisingGoal", Number(target.value));
          }}
        />
      </FormField>

      <FormField>
        <Label>Add Charity Partner</Label>
        <Input
          onClick={() => {
            navigate({
              to: "/app/events/create/partners",
            });
          }}
          readOnly
          placeholder="Charity Partner"
        />
      </FormField>
    </FormContent>
  );
};
