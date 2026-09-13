import { Button } from "@/modules/ui/button";
import { ArrowRight } from "lucide-react";
import { useCreateEventMutation } from "../../../hooks/mutation";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { convertDateTimeInputToISOString } from "@/helpers/time";
import { mapRecurrenceStateToMutation } from "../helper/data";
import { isDataUrl, dataUrlToFile } from "@/helpers/file";
import { useMemo } from "react";

export const Publish = () => {
  const { formState } = useEventFormStore();
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

  const resolvedPhoto = useMemo(() => {
    if (!photo) return undefined;
    if (isDataUrl(photo)) {
      try {
        return dataUrlToFile(photo, "event-photo.png");
      } catch (err) {
        console.error("Failed to convert data URL to file:", err);
        return photo;
      }
    }
    return photo;
  }, [photo]);

  const locationData = isOnlineEvent
    ? { meetingLink }
    : { address, latitude, longitude };

  const validCharities = (fundRaiser?.recipientCharities || []).filter(
    (org) => typeof org === "string" && org.trim().length > 0,
  );

  const { mutate, isPending } = useCreateEventMutation({
    name,
    category: category.id,
    description,
    subcategory: subCategory?.id,
    privacy: "public",
    isRefundable: Boolean(isRefundable),
    ...(resolvedPhoto ? { photo: resolvedPhoto as string | File } : {}),
    ...locationData,
    endTime: convertDateTimeInputToISOString(startDate, startTime),
    eventEndDate: convertDateTimeInputToISOString(endDate, endTime),
    eventType: isOnlineEvent ? "online" : "in-person",
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
        discount: Number(promoCode.discount),
      },
    }),
    ...(ticketing &&
      ticketing.length > 0 && {
      ticketing: ticketing
        .filter((t) => t.ticketType && t.salesStartDate && t.salesEndDate)
        .map((t) => ({
          ticketType: t.ticketType,
          ticketPrice: Math.abs(Number(t.ticketPrice) * 100),
          signUpLimit: t.signUpLimit,
          salesStartDate: t.salesStartDate!,
          salesEndDate: t.salesEndDate!,
          ...(t.ticketDetails && {
            ticketDetails: t.ticketDetails!,
          }),
        })),
    }),
    ...(validCharities.length > 0 && {
      fundRaiser: {
        recipientCharities: validCharities,
      },
    }),
  });

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
