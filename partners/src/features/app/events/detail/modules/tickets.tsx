import { type EventTicketing } from "@/features/app/global/types";

import editIcon from "../assets/edit.svg";
import { Link } from "@tanstack/react-router";
import { formatCurrency } from "@/helpers/text";
import { getReadableTime, isPastDate } from "@/helpers/time";

type Props = {
  tickets: EventTicketing[];
  eventId: string;
};

export const Tickets = ({ tickets, eventId }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-5 w-full">
      <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
        Tickets Available
      </h5>

      <ul className="w-full">
        {tickets.map((item, index) => (
          <Ticket eventId={eventId} {...item} key={index} />
        ))}
      </ul>
    </div>
  );
};

const Ticket = (props: EventTicketing & { eventId: string }) => {
  const { ticketType, ticketPrice, salesEndDate, signUpLimit, _id, eventId } =
    props;

  const isPastDeadline = isPastDate(salesEndDate);

  return (
    <div className="text-primary flex items-center justify-between w-full p-4 shadow rounded-lg">
      <div className="space-y-2.5">
        <h5 className="first-letter:uppercase text-xs font-semibold text">
          {ticketType} Tickets
        </h5>
        <h2 className="font-extrabold text-base">
          {formatCurrency(ticketPrice)}{" "}
          <span className="text-xs font-semibold">
            {signUpLimit > 0
              ? `${signUpLimit} Tickets Available`
              : "Per Ticket"}
          </span>
        </h2>
        <span className="text-xs font-semibold">
          Sales End{isPastDeadline && "ed"} {getReadableTime(salesEndDate)}
        </span>
      </div>

      <Link
        to="/app/events/$id/edit/$ticketTypeId"
        params={{
          id: eventId,
          ticketTypeId: _id,
        }}
      >
        <img src={editIcon} alt="" className="w-5 h-5" />
      </Link>
    </div>
  );
};
