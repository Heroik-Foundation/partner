import { useState, useMemo, useEffect } from "react";
import { useEventDetailsQuery } from "../../../hooks/query";

interface EventFormState {
  salesEndDate: string | null;
  salesStartDate: string | null;
  ticketDetails?: string;
  signUpLimit: number;
  ticketPrice: string;
  ticketType: string;
}

const DEFAULT_FORM_STATE: EventFormState = {
  salesEndDate: null,
  salesStartDate: null,
  signUpLimit: 0,
  ticketPrice: "",
  ticketType: "Standard",
};

const convertTicketPrice = (price: number | undefined): number => {
  if (!price) return 0;
  return Number(price) / 100;
};

export const useUpdateEventTicketTypeForm = ({
  id,
  ticketTypeId,
}: {
  id: string | undefined;
  ticketTypeId: string | undefined;
}) => {
  const { data: event } = useEventDetailsQuery({
    id: id,
  });

  const currentTicketDetails = useMemo(() => {
    if (!event?.ticketing || !ticketTypeId) return null;
    return event.ticketing.find((item) => item._id === ticketTypeId) || null;
  }, [event?.ticketing, ticketTypeId]);

  const initialState = useMemo((): EventFormState => {
    if (!currentTicketDetails) {
      return DEFAULT_FORM_STATE;
    }

    return {
      salesEndDate:
        currentTicketDetails.salesEndDate.split("T")[0] ??
        DEFAULT_FORM_STATE.salesEndDate,
      salesStartDate:
        currentTicketDetails.salesStartDate.split("T")[0] ??
        DEFAULT_FORM_STATE.salesStartDate,
      ...(currentTicketDetails.ticketDetails && {
        ticketDetails: currentTicketDetails.ticketDetails,
      }),
      signUpLimit:
        currentTicketDetails.signUpLimit ?? DEFAULT_FORM_STATE.signUpLimit,
      ticketPrice: String(convertTicketPrice(currentTicketDetails.ticketPrice)),
      ticketType:
        currentTicketDetails.ticketType || DEFAULT_FORM_STATE.ticketType,
      ...(currentTicketDetails.ticketDetails &&
        currentTicketDetails.ticketDetails.length >= 1 && {
          ticketDetails: currentTicketDetails.ticketDetails,
        }),
    };
  }, [currentTicketDetails]);

  const [formState, setFormState] = useState<EventFormState>(initialState);

  useEffect(() => {
    if (
      (currentTicketDetails?.salesStartDate ||
        currentTicketDetails?.salesEndDate) &&
      (formState.salesEndDate === null || formState.salesStartDate === null)
    ) {
      setFormState(initialState);
    }
  }, [event]);

  const updateFormField = <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K],
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(formState) !== JSON.stringify(initialState);
  }, [formState, initialState]);

  return {
    formState,
    updateFormField,
    setFormState,
    resetForm,
    isDirty,
    hasTicketData: !!currentTicketDetails,
    absorbFees: event?.absorbFees || false,
    event,
    currentTicketDetails,
  };
};
