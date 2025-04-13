import { useRouter } from "@tanstack/react-router";
import { Header } from "../../global/header";

import { EventCategory } from "./modules/category";
import { Button } from "@/modules/ui/button";
import { useEventFormStore } from "../../global/hooks/logic";
import { useEventCategoriesQuery } from "./hooks/query";

const SelectEventCategory = () => {
  const { formState, updateForm } = useEventFormStore();
  const { data } = useEventCategoriesQuery();
  const { history } = useRouter();

  const rows = data?.pages || [];

  return (
    <div className="space-y-5 relative min-h-screen">
      <Header
        header={{
          position: "stacked",
          title: "Select your Preferred Category for The Event",
        }}
      />
      {rows.map((category, index) => (
        <EventCategory
          formState={formState}
          updateForm={updateForm}
          {...category}
          key={index}
        />
      ))}

      <div />

      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          history.back();
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default SelectEventCategory;
