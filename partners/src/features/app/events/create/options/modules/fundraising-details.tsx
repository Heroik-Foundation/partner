import { InputWithPrefix } from "@/features/app/global/form";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Label } from "@/modules/ui/label";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

export const FundraisingEventDetails = () => {
    const { formState, updateForm } = useEventFormStore();
    // const fundRaiserState = formState.fundRaiser || {};

    const organizations = formState.fundRaiser?.recipientCharities || [""];

    const updateFundraiserField = (value: string, index: number) => {
        const clone = [...organizations];
        clone[index] = value;

        updateForm("fundRaiser", {
            ...(formState.fundRaiser || {}),
            recipientCharities: clone,
        });
    };

    const addOrganizationField = () => {
        updateForm("fundRaiser", {
            ...(formState.fundRaiser || {}),
            recipientCharities: [...organizations, ""],
        });
    };

    return (
        <FormContent>
            <FormField>
                <Label>Add Charity Partner</Label>
                {organizations.map((org, index) => {
                    return (
                        <div
                            key={index}
                            className="w-full flex items-center gap-3"
                        >
                            <InputWithPrefix
                                required
                                placeholder="Enter Organisation name"
                                value={org}
                                onChange={({ target }) => {
                                    updateFundraiserField(
                                        target.value,
                                        index,
                                    );
                                }}
                            />
                            {organizations.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const filtered = organizations.filter(
                                            (_, i) => i !== index,
                                        );
                                        updateForm("fundRaiser", {
                                            ...(formState.fundRaiser || {}),
                                            recipientCharities: filtered,
                                        });
                                        toast.success("Removed", {
                                            id: "removed-oragnization",
                                        });
                                    }}
                                >
                                    <XCircle className="stroke-white fill-rose-500" />
                                </button>
                            )}
                        </div>
                    );
                })}
                <div className="w-full flex justify-end">
                    <button
                        type="button"
                        className="!text-bold px-3 text-sm h-[45px] text-primary"
                        onClick={addOrganizationField}
                    >
                        + Add Another Organisation
                    </button>
                </div>
            </FormField>

            {/* <FormField>
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
            </FormField> */}

            <ul className="space-y-3">
                {/* {organizations.length >= 1 &&
                    organizations.map((org, index) => {
                        return (
                            <li
                                key={index}
                                className="p-3 rounded-full border border-primay/25 flex items-center justify-between"
                            >
                                <span className="text-sm font-bold text-primary">
                                    {org}
                                </span>

                            </li>
                        );
                    })} */}
            </ul>
        </FormContent>
    );
};
