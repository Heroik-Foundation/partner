import { Highlight } from "../../../detail/modules/highlight";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { convertDateTimeInputToISOString, formatISODate } from "@/helpers/time";
import { Header } from "@/features/app/global/header";
import { decimalFormatter, trimNumber } from "@/helpers/text";
import { Link, useNavigate } from "@tanstack/react-router";
import eyeIcon from "@/features/app/events/detail/assets/eye.svg";
import editIcon from "@/features/app/events/detail/assets/edit.svg";
import { useEffect, useMemo, useCallback } from "react";
import { Publish } from "./modules/publish";
import { toast } from "sonner";
import { useCurrencyStore } from "@/stores/currency";
import { cn } from "@/lib/utils";
import { MarkdownPreview } from "@/modules/ui/markdown-preview";

export const PreLaunch = () => {
    const { selectedCurrency } = useCurrencyStore();
    const { formState, setFormState } = useEventFormStore();

    const navigate = useNavigate();

    const tickets = useMemo(
        () => formState.ticketing || [],
        [formState.ticketing],
    );

    const totalTickets = useMemo(
        () => tickets.reduce((sum, ticket) => sum + ticket.signUpLimit, 0),
        [tickets],
    );

    const thumbnailUrl = useMemo(() => {
        if (!formState.photo) return "";
        if (typeof formState.photo === "string") return formState.photo;
        if (
            typeof formState.photo === "object" &&
            formState.photo !== null &&
            formState.photo instanceof Blob
        ) {
            return URL.createObjectURL(formState.photo);
        }
        return "";
    }, [formState.photo]);

    const eventDate = useMemo(
        () =>
            convertDateTimeInputToISOString(
                formState.startDate,
                formState.startTime,
            ),
        [formState.startDate, formState.startTime],
    );

    const validatePreLaunchProps = useCallback(() => {
        const {
            endDate,
            startDate,
            name,
            description,
            isOnlineEvent,
            meetingLink,
            address,
            ticketing,
        } = formState;

        const hasMissingRequired =
            !name?.trim() ||
            !description?.trim() ||
            !startDate ||
            !endDate ||
            (isOnlineEvent ? !meetingLink?.trim() : !address?.trim());

        const validTickets = (ticketing || []).filter(
            (t) => t.ticketType && t.salesStartDate && t.salesEndDate,
        );

        if (hasMissingRequired || validTickets.length === 0) {
            toast.info("Please complete required event details before continuing.", {
                id: "pre-launch-invalid-details-info",
            });
            navigate({ to: "/app/events/create" });
        }
    }, [formState, navigate]);

    useEffect(() => {
        validatePreLaunchProps();
    }, [validatePreLaunchProps]);

    const handleEditTicket = useCallback(
        (index: number) => {
            setFormState({
                ...formState,
                currentTicketIndex: index,
            });
        },
        [formState, setFormState],
    );

    return (
        <div className="pb-32">
            <Header
                header={{
                    title: "",
                    position: "inline",
                }}
                previousButtonVariant="backlight"
                previousRouteCallback={() => {
                    navigate({
                        to: "/app/events/create/options",
                        search: { step: 3 },
                    });
                }}
            />

            <Highlight
                currency={selectedCurrency.value}
                availableTickets={trimNumber(totalTickets)}
                title={formState.name}
                thumbnail={thumbnailUrl || ""}
                date={eventDate}
                {...(formState.meetingLink
                    ? { meetingLink: formState.meetingLink || "" }
                    : { location: formState.address || "" })}
            />

            <div className="space-y-5 mt-2.5">
                <div className="space-y-2 text-center">
                    <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
                        About Event
                    </h5>
                    <p
                        className={cn(
                            "text-sm font-semibold text-primary",
                            "text-start",
                        )}
                    >
                        <MarkdownPreview content={formState.description} />
                    </p>
                </div>

                {formState.fundRaiser?.recipientCharities && (
                    <>
                        {formState.fundRaiser?.recipientCharities[0]!== "" && (
                            <div className="flex items-start justify-around">
                                <div className="space-y-2.5 flex flex-col items-center">
                                    <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
                                        Charity Partner (s)
                                    </h5>
                                    <Link
                                        to="/app/events/create/options"
                                        search={{ step: 4 }}
                                        className="font-bold text-xs rounded-full bg-primary py-4 px-5 w-fit mx-auto text-white inline-flex items-center space-x-2.5"
                                    >
                                        <span> View Charity Partners</span>{" "}
                                        <img src={eyeIcon} alt="" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {tickets.length >= 1 && (
                    <div className="space-y-2.5 w-full flex flex-col items-center">
                        <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
                            Tickets Available
                        </h5>
                        <ul className="space-y-2.5 w-full">
                            {tickets.map((ticket, index) => {
                                const {
                                    ticketType,
                                    ticketPrice,
                                    signUpLimit,
                                    salesEndDate,
                                } = ticket;

                                const formattedDate = formatISODate(
                                    convertDateTimeInputToISOString(
                                        String(salesEndDate),
                                    ),
                                ).date;

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
                                                {selectedCurrency.symbol}
                                                {decimalFormatter.format(
                                                    ticketPrice,
                                                )}{" "}
                                                <span className="text-xs font-semibold">
                                                    {signUpLimit > 0
                                                        ? `${signUpLimit} Tickets Available`
                                                        : "Per Ticket"}
                                                </span>
                                            </h2>
                                            <span className="text-xs font-semibold">
                                                Sales End On {formattedDate}
                                            </span>
                                        </div>

                                        <Link
                                            to="/app/events/create/options"
                                            search={{ step: 2 }}
                                            onClick={() =>
                                                handleEditTicket(index)
                                            }
                                        >
                                            <img
                                                src={editIcon}
                                                alt=""
                                                className="w-5 h-5"
                                            />
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
