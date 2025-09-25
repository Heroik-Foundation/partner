import { Highlight } from "../../../detail/modules/highlight";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { convertDateTimeInputToISOString, formatISODate } from "@/helpers/time";
import { Header } from "@/features/app/global/header";

import { decimalFormatter } from "@/helpers/text";
import { Link, useRouter } from "@tanstack/react-router";

import eyeIcon from "@/features/app/events/detail/assets/eye.svg";
import editIcon from "@/features/app/events/detail/assets/edit.svg";
import { objectHasNullOrUndefined } from "@/helpers/object";
import { useEffect } from "react";
import { Publish } from "./modules/publish";

export const PreLaunch = () => {
  const { formState, setFormState } = useEventFormStore();
  const { history } = useRouter();

  const tickets = formState.ticketing ? formState.ticketing : [];

  function validatePreLaunchProps() {
    if (
      (formState.recurrence &&
        objectHasNullOrUndefined(formState.recurrence)) ||
      (formState.fundRaiser && objectHasNullOrUndefined(formState.fundRaiser))
    ) {
      history.back();
    }
  }

  useEffect(() => {
    validatePreLaunchProps();
  }, []);

  return (
    <div>
      <Header
        header={{
          title: "",
          position: "inline",
        }}
        previousButtonVariant="backlight"
      />

      <Highlight
        availableTickets={formState.ticketing ? formState.ticketing.length : 0}
        title={formState.name}
        thumbnail={
          formState.photo ? URL.createObjectURL(formState.photo as File) : ""
        }
        members={0}
        date={convertDateTimeInputToISOString(
          formState.startDate,
          formState.startTime
        )}
        avatars={[""]}
        location={formState.address}
      />

      <div className="space-y-5 mt-2.5">
        <div className="space-y-2 text-center">
          <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
            About Event
          </h5>
          <p className="text-sm font-semibold text-primary">
            {formState.description}
          </p>
        </div>

        {formState.fundRaiser && (
          <div className="flex items-start justify-around">
            <div className="space-y-2.5 flex flex-col items-center">
              <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
                Charity Partner (s)
              </h5>
              <Link
                to="/app/events/create/partners"
                className="font-bold text-xs rounded-full bg-primary py-4 px-5 w-fit mx-auto text-white inline-flex items-center space-x-2.5"
              >
                <span> View Charity Partners</span> <img src={eyeIcon} alt="" />
              </Link>
            </div>
            <div className="space-y-2.5 flex flex-col items-center">
              <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
                Minimum Pledge
              </h5>

              <span className="font-bold text-sm w-fit mx-auto rounded-full bg-primary py-3 px-5 text-white">
                £
                {decimalFormatter.format(
                  Number(formState.fundRaiser.fundRaisingGoal)
                )}
              </span>
            </div>
          </div>
        )}

        {tickets.length >= 1 && (
          <div className="space-y-2.5 w-full flex flex-col items-center">
            <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
              Tickets Available
            </h5>
            <ul className="space-y-2.5 w-full">
              {tickets.map((ticket, index) => {
                const { ticketType, ticketPrice, signUpLimit, salesEndDate } =
                  ticket;
                return (
                  <li
                    key={index}
                    className="text-primary flex items-center justify-between w-full p-4 shadow rounded-lg"
                  >
                    <div className="space-y-2.5">
                      <h5 className="first-letter:uppercase text-xs font-semibold text">
                        {ticketType} Tickets
                      </h5>
                      <h2 className="font-extrabold text-base">
                        {decimalFormatter.format(ticketPrice)}{" "}
                        <span className="text-xs font-semibold">
                          {signUpLimit > 0
                            ? `${signUpLimit} Tickets Available`
                            : "Per Ticket"}
                        </span>
                      </h2>
                      <span className="text-xs font-semibold">
                        Sales End On{" "}
                        {
                          formatISODate(
                            convertDateTimeInputToISOString(
                              String(salesEndDate)
                            )
                          ).date
                        }
                      </span>
                    </div>

                    <Link
                      to="/app/events/create/options"
                      search={{
                        step: 1,
                      }}
                      onClick={() => {
                        setFormState({
                          ...formState,
                          currentTicketIndex: index,
                        });
                      }}
                    >
                      <img src={editIcon} alt="" className="w-5 h-5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <Publish />
    </div>
  );
};
