import { InputWithPrefix } from "@/features/app/global/form";
import {
  FundraiserState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

export const FundraisingEventDetails = () => {
  const { formState, updateForm, removeOrganization } = useEventFormStore();
  const navigate = useNavigate();

  const fundRaiserState = formState.fundRaiser || {};
  const organizations = formState.fundRaiser?.organizations || [];

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

      <ul className="space-y-3">
        {organizations.length >= 1 &&
          organizations.map((org, index) => {
            return (
              <li
                key={index}
                className="p-3 rounded-full border border-primay/25 flex items-center justify-between"
              >
                <span className="text-sm font-bold text-primary">
                  {org.name}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    removeOrganization(org.id);
                    toast.success("Removed", {
                      id: "removed-oragnization",
                    });
                  }}
                >
                  <XCircle className="stroke-white fill-rose-500" />
                </button>
              </li>
            );
          })}
      </ul>
    </FormContent>
  );
};
