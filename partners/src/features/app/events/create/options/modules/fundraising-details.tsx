import { InputWithPrefix } from "@/features/app/global/form";
import {
    FundraiserState,
    useEventFormStore,
} from "@/features/app/global/hooks/logic";
import { FormContent, FormField } from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Label } from "@/modules/ui/label";
import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const FundraisingEventDetails = () => {
    const { formState, removeOrganization, updateForm } = useEventFormStore();

    const organizations = formState.fundRaiser?.recipientCharities || [];

    const updateFundraiserField = <K extends keyof FundraiserState>(
        field: K,
        value: string,
        index: number,
    ) => {
        const clone = organizations;

        clone[index] = value + "";

        updateForm("fundRaiser", {
            ...(formState.fundRaiser || {}),
            [field]: clone,
        });
    };

    useEffect(() => {
        if (organizations.length === 0) {
            updateFundraiserField("recipientCharities", "", 0);
        }
    }, []);

    return (
        <FormContent>
            <FormField>
                <Label>Add Charity Partner</Label>
                {organizations.length >= 1 &&
                    organizations.map((org, index) => {
                        return (
                            <div className=" w-full flex items-center gap-3 ">
                                <InputWithPrefix
                                    key={index}
                                    required
                                    // prefixItem={
                                    //   <span className="font-bold text-primary/30">
                                    //     {selectedCurrency.symbol}
                                    //   </span>
                                    // }
                                    placeholder="Enter Organization name"
                                    value={org}
                                    onChange={({ target }) => {
                                        updateFundraiserField(
                                            "recipientCharities",
                                            target.value,
                                            index,
                                        );
                                    }}
                                />
                                {organizations.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            removeOrganization(org);
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
                    <div className=" w-full flex justify-end " >

                    <Button onClick={()=> updateFundraiserField("recipientCharities", "", organizations.length + 1)} >Add Organisation</Button>
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
