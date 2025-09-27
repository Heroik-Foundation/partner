import { InputWithPrefix } from "@/features/app/global/form";
import {
  FundraiserState,
  useEventFormStore,
} from "@/features/app/global/hooks/logic";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Label } from "@/modules/ui/label";
import { Link } from "@tanstack/react-router";
import { Building2, ChevronRight, XCircle } from "lucide-react";
import { toast } from "sonner";

export const FundraisingEventDetails = () => {
  const { formState, updateForm, removeOrganization } = useEventFormStore();

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
          required
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

        <Link
          to="/app/events/create/partners"
          className="border-2 border-primary/25 rounded-xl py-3 px-3 flex items-center justify-between"
        >
          <div className="text-primary flex items-center space-x-1.5">
            <Building2 size={18} />
            <span className="text-sm font-bold">View Partners</span>
          </div>

          <ChevronRight className="stroke-2 stroke-primary/50" />
        </Link>
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
