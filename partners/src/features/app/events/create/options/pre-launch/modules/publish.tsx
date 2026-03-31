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
    meetingLink,
    isOnlineEvent,
    isRefundable,
    promoCode,
  } = formState;

  const locationData = isOnlineEvent
    ? { meetingLink }
    : { address, latitude, longitude };

  const { mutate, isPending, isSuccess } = useCreateEventMutation({
    name,
    category: category.id,
    description,
    subcategory: subCategory?.id,
    privacy: "public",
    isRefundable,
    ...(photo ? { photo: photo as string | File } : {}),
    ...locationData,
    endTime: convertDateTimeInputToISOString(startDate, startTime),
    eventEndDate: convertDateTimeInputToISOString(endDate, endTime),
    ...(mapRecurrenceStateToMutation(recurrence) && {
      recurrence: mapRecurrenceStateToMutation(recurrence)!,
    }),
    ...(promoCode &&
      promoCode.code &&
      promoCode.discount &&
      promoCode.discount > 0 &&
      promoCode.discount <= 100 && {
        promoCode: {
          code: promoCode.code,
          discount: Number(promoCode.discount) * 100,
        },
      }),
    ...(ticketing &&
      ticketing.length > 0 && {
        ticketing: ticketing
          .filter((t) => t.salesStartDate && t.salesEndDate)
          .map((t) => ({
            ticketType: t.ticketType,
            ticketPrice: Math.abs(Number(t.ticketPrice) * 100),
            signUpLimit: t.signUpLimit,
            salesStartDate: t.salesStartDate!,
            salesEndDate: t.salesEndDate!,
          })),
      }),
    ...(fundRaiser &&
      fundRaiser.organizations && {
        eventPledge: {
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
          console.log("hello here pick me");
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
