import { EventFormState } from "@/features/app/global/hooks/logic";
import { truncateText } from "@/helpers/text";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { Building } from "lucide-react";

export type CharityOrganizationProps = {
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K],
  ) => void;
  formState: EventFormState;
  thumbnail: string;
  title: string;
  address: string;
  nodeRef?: any;
  id: string;
};

export const CharityOrganization = (props: CharityOrganizationProps) => {
  const { thumbnail, title, address, nodeRef, id, formState, updateForm } =
    props;
  const isOrgPresent = (formState.fundRaiser?.recipientCharities || []).some(
    (partner) => partner === id,
  );

  const handleOrgArrUpdates = () => {
    const initialData = formState.fundRaiser?.recipientCharities || [];

    const newData = isOrgPresent
      ? initialData.filter((partner) => partner !== id)
      : [...initialData, id];

    updateForm("fundRaiser", {
      recipientCharities: newData,
    });
  };

  return (
    <div
      className="w-full p-2.5 rounded-xl flex items-center justify-between border-2 border-primary/5"
      ref={nodeRef}
    >
      <div className="flex items-center space-x-1.5">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Logo"
            loading="eager"
            className="rounded-md bg-primary/10 w-16 h-16 object-cover"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center text-primary bg-primary/10 rounded-md">
            <Building />
          </div>
        )}
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold">{truncateText(title, 14)}</h4>

          <p className="text-xs font-bold text-black/50">
            {address ? truncateText(address, 16) : "-"}
          </p>
        </div>
      </div>

      <Button
        onClick={handleOrgArrUpdates}
        size="sm"
        className={cn(
          "transition-all rounded-full px-4 font-bold text-sm bg-accent",
          isOrgPresent && "bg-rose-500",
        )}
      >
        {isOrgPresent ? "Unselect" : "Select"}
      </Button>
    </div>
  );
};

export const CharityOrganizationSkeletonLoader = () => {
  return (
    <div className="w-full h-[84px] bg-gray-300 animate-pulse rounded-xl" />
  );
};
