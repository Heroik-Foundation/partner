import { EventFormState } from "@/features/app/global/hooks/logic";
import { truncateText } from "@/helpers/text";
import { Button } from "@/modules/ui/button";
import { Building } from "lucide-react";

export type CharityOrganizationProps = {
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
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
  const isOrgPresent = formState.charityPartners.includes(id);

  const handleOrgArrUpdates = () => {
    const initialData = formState.charityPartners;

    const newData = isOrgPresent
      ? initialData.filter((orgId) => orgId !== id)
      : [...initialData, id];
    updateForm("charityPartners", newData);
  };

  return (
    <div
      className="w-full p-2.5 rounded-xl flex items-center justify-between shadow"
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
          <div className="w-16 h-16 flex items-center justify-center text-primary bg-primary/10 rounded-xl">
            <Building />
          </div>
        )}
        <div>
          <h4 className="text-sm font-extrabold">{truncateText(title, 14)}</h4>
          {address && (
            <p className="text-xs font-bold">{truncateText(address, 20)}</p>
          )}
        </div>
      </div>

      <Button onClick={handleOrgArrUpdates} size="sm" variant="secondary">
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
