import { useState, useMemo, useEffect } from "react";
import { useEventDetailsQuery } from "../../../hooks/query";

interface EventFormState {
  absorbFees: boolean;

  salesEndDate: string | null;
  salesStartDate: string | null;
  signUpLimit: number;
  ticketPrice: number;
  ticketType: string;
}

const DEFAULT_FORM_STATE: EventFormState = {
  absorbFees: true,
  salesEndDate: null,
  salesStartDate: null,
  signUpLimit: 0,
  ticketPrice: 0,
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
      absorbFees:
        currentTicketDetails.absorbFees ?? DEFAULT_FORM_STATE.absorbFees,
      salesEndDate:
        currentTicketDetails.salesEndDate.split("T")[0] ??
        DEFAULT_FORM_STATE.salesEndDate,
      salesStartDate:
        currentTicketDetails.salesStartDate.split("T")[0] ??
        DEFAULT_FORM_STATE.salesStartDate,
      signUpLimit:
        currentTicketDetails.signUpLimit ?? DEFAULT_FORM_STATE.signUpLimit,
      ticketPrice: convertTicketPrice(currentTicketDetails.ticketPrice),
      ticketType:
        currentTicketDetails.ticketType || DEFAULT_FORM_STATE.ticketType,
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
    value: EventFormState[K]
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
  };
};
