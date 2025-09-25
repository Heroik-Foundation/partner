import { Button } from "@/modules/ui/button";
import { ArrowRight } from "lucide-react";
import { useCreateEventMutation } from "../../../hooks/mutation";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { convertDateTimeInputToISOString } from "@/helpers/time";
import { mapRecurrenceStateToMutation } from "../helper/data";
import { useEffect } from "react";

export const Publish = () => {
  const { formState, reset } = useEventFormStore();
  const {
    name,
    address,
    category,
    description,
    subCategory,
    endDate,
    endTime,
    startDate,
    startTime,
    photo,
    recurrence,
    ticketing,
    fundRaiser,
    longitude,
    latitude,
  } = formState;

  const { mutate, isPending, isSuccess } = useCreateEventMutation({
    name,
    address,
    category: category.id,
    description,
    subcategory: subCategory.id,
    privacy: "public",
    ...(photo ? { photo: photo as string | File } : {}),
    latitude,
    longitude,
    endTime: convertDateTimeInputToISOString(startDate, startTime),
    eventEndDate: convertDateTimeInputToISOString(endDate, endTime),
    ...(mapRecurrenceStateToMutation(recurrence) && {
      recurrence: mapRecurrenceStateToMutation(recurrence)!,
    }),
    ...(ticketing &&
      ticketing.length > 0 && {
        ticketing: ticketing
          .filter((t) => t.salesStartDate && t.salesEndDate) // only valid tickets
          .map((t) => ({
            ticketType: t.ticketType,
            ticketPrice: t.ticketPrice,
            signUpLimit: t.signUpLimit,
            salesStartDate: t.salesStartDate!,
            salesEndDate: t.salesEndDate!,
            absorbFees: t.absorbFees,
          })),
      }),
    ...(fundRaiser &&
      fundRaiser.fundRaisingGoal &&
      fundRaiser.organizations && {
        eventPledge: {
          minimumPledge: fundRaiser.fundRaisingGoal,
          organizations: fundRaiser.organizations.map((org) => org.id),
        },
      }),
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-sm flex items-center justify-center p-5">
      <Button
        onClick={() => {
          mutate();
        }}
        isPending={isPending}
        size={"lg"}
        className="rounded-full w-full sm:max-w-sm"
        variant={"accent"}
      >
        Launch Event <ArrowRight />
      </Button>
    </div>
  );
};
