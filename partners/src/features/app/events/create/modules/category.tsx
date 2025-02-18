import { cn } from "@/lib/utils";
import { Category } from "./categories";
import { Check } from "lucide-react";
import { EventFormState } from "@/features/app/global/hooks/logic";

type EventCategoryProps = {
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
  formState: EventFormState;
} & Category;

export const EventCategory = (props: EventCategoryProps) => {
  const { name, icon, updateForm, formState } = props;

  return (
    <button
      className={cn(
        "w-full flex items-center justify-between p-2.5 border-b",
        formState.category === name && "bg-primary/5"
      )}
      onClick={() => {
        updateForm("category", name);
      }}
    >
      <div className="flex items-center space-x-1.5">
        <img src={icon} alt="icon" className="w-6 h-6" />
        <span className="text-sm font-semibold text-primary">{name}</span>
      </div>

      {formState.category === name ? <Check size={14} /> : <div />}
    </button>
  );
};
