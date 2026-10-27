import {
    Form,
    FormContent,
    FormField,
    FormFooter,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";

import { ImageWithPreview } from "@/modules/units/form/image";
import { Fragment, useEffect } from "react";
import { Header } from "../../global/header";
import { ChevronRight, Video } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { useUpdateEventMutation } from "./hooks/mutation";
import { useEventDetailsQuery } from "../hooks/query";
import { getInitialEventState } from "./helpers/data";
import { ActionDrawer } from "@/modules/units/page/action";
import PlaceAutocomplete from "@/modules/units/form/address";
import { useEventFormStore } from "../../global/hooks/logic";
import { cn } from "@/lib/utils";
import { Switch } from "@/modules/ui/switch";
import { InputWithPrefix } from "../../global/form";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";
import { TimePicker } from "@/modules/ui/time-picker";

const EditEvent = () => {
    const { id } = useParams({
        strict: false,
    });
    const { data: event } = useEventDetailsQuery({
        id,
    });

    const { formState, updateForm, setFormState } = useEventFormStore();

    const { mutate, isPending, isSuccess, isError } = useUpdateEventMutation({
        mode: "diff",
        event: event,
        ...formState,
        eventId: id as string,
    });

    useEffect(() => {
        if (event && formState.eventId !== id) {
            setFormState(getInitialEventState(event) as any);
        }
    }, [event, id, formState.eventId, setFormState]);

    return (
        <Fragment>
            <Header
                header={{
                    position: "stacked",
                    title: "Edit Event",
                    subtitle: "Choose the below information to update.",
                }}
            />
            <Form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <FormContent className="space-y-8">
                    <ImageWithPreview
                        handleState={(file) => {
                            updateForm("photo", file);
                        }}
                        //@ts-ignore
                        initialPreview={event?.photo}
                    />
                    {/* <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-primary">
                                Do you want to absorb all the ticket fees?
                            </span>
                            <Switch
                                checked={formState.absorbFees}
                                onCheckedChange={(value) => {
                                    updateForm("absorbFees", value);
                                }}
                            />
                        </div>
                    </div> */}
                    <FormField>
                        <Label>Event Name</Label>
                        <Input
                            required
                            value={formState.name}
                            onChange={({ target }) => {
                                updateForm("name", target.value);
                            }}
                            placeholder="Type Event Name here..."
                        />
                    </FormField>
                    <FormField>
                        <Label>Event Description</Label>
                        <MarkdownEditor
                            value={formState.description}
                            onChange={(markdownContent) => {
                                updateForm("description", markdownContent);
                            }}
                        />
                    </FormField>
                    <FormField>
                        <Label>
                            {" "}
                            {formState.isOnlineEvent
                                ? "Event Meeting Link"
                                : "Event Venue"}
                        </Label>
                        {formState.isOnlineEvent && (
                            <InputWithPrefix
                                required
                                pattern="https://(www\.)?(zoom\.us/j/\d+|meet\.google\.com/[a-zA-Z-]+|teams\.microsoft\.com/l/meetup-join/.+)"
                                title="Enter a Zoom, Google Meet, or Microsoft Teams meeting link"
                                value={formState.meetingLink}
                                onChange={({ target }) => {
                                    updateForm(
                                        "meetingLink",
                                        String(target.value),
                                    );
                                }}
                                prefixItem={
                                    <Video className="stroke-primary/50" />
                                }
                            />
                        )}

                        {formState.address && (
                            <PlaceAutocomplete
                                initialValue={{
                                    address: formState.address,
                                    lat: formState.latitude,
                                    lng: formState.longitude,
                                }}
                                required
                                placeholder="Type Event/Address here"
                                callback={(value) => {
                                    updateForm("address", value.address);
                                    updateForm("longitude", value.lng);
                                    updateForm("latitude", value.lat);
                                }}
                            />
                        )}
                    </FormField>
                    <FormField>
                        <Label>Event Category</Label>
                        <Link
                            to="/app/events/create/category"
                            className=" text-primary h-14 rounded-xl font-bold ring-primary flex items-center justify-between p-2.5 border-2 border-primary/15"
                        >
                            <div className="flex items-center space-x-2.5 w-6 h-6">
                                {formState.category?.image && (
                                    <img
                                        src={formState.category.image}
                                        className=""
                                        alt=""
                                    />
                                )}
                                <span
                                    className={cn(
                                        "font-bold whitespace-nowrap text-primary/50",
                                        (formState?.subCategory?.name ||
                                            formState.category?.name) &&
                                        "text-primary",
                                    )}
                                >
                                    {formState?.subCategory?.name ||
                                        formState.category?.name ||
                                        "Select Event Category"}
                                </span>
                            </div>
                            <ChevronRight
                                size={14}
                                className="stroke-2 stroke-primary"
                            />
                        </Link>
                    </FormField>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField>
                            <Label>Start Date</Label>
                            <DatePicker
                                required
                                value={formState.startDate}
                                onChange={(date) => {
                                    updateForm("startDate", date);
                                    if (!formState.endDate || formState.endDate < date) {
                                        updateForm("endDate", date);
                                    }
                                }}
                                minDate={formatDateToISO(new Date())}
                                placeholder="Select start date"
                            />
                        </FormField>
                        <FormField>
                            <Label>End Date</Label>
                            <DatePicker
                                required
                                value={formState.endDate}
                                onChange={(date) => updateForm("endDate", date)}
                                minDate={formState.startDate || formatDateToISO(new Date())}
                                placeholder="Select end date"
                            />
                        </FormField>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField>
                            <Label>Start Time</Label>
                            <TimePicker
                                required
                                value={formState.startTime}
                                onChange={(time) => {
                                    updateForm("startTime", time);
                                    if (
                                        formState.startDate &&
                                        formState.endDate &&
                                        formState.startDate === formState.endDate &&
                                        formState.endTime &&
                                        formState.endTime <= time
                                    ) {
                                        const [h, m] = time.split(":").map(Number);
                                        const nextHour = (h + 1) % 24;
                                        updateForm("endTime", `${String(nextHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
                                    }
                                }}
                                placeholder="Select start time"
                            />
                        </FormField>
                        <FormField>
                            <Label>End Time</Label>
                            <TimePicker
                                required
                                value={formState.endTime}
                                onChange={(time) => updateForm("endTime", time)}
                                minTime={
                                    formState.startDate &&
                                    formState.endDate &&
                                    formState.startDate === formState.endDate
                                        ? formState.startTime
                                        : undefined
                                }
                                placeholder="Select end time"
                            />
                        </FormField>
                    </div>

                    <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-primary">
                                Is this event refundable ?
                            </span>
                            <Switch
                                checked={formState.isRefundable}
                                onCheckedChange={(value) => {
                                    updateForm("isRefundable", value);
                                }}
                            />
                        </div>
                    </div>
                </FormContent>
                <FormFooter>
                    <ActionDrawer
                        trigger={
                            <Button
                                className="w-full"
                                size="lg"
                                type="button"
                                isPending={isPending}
                            >
                                Update Event
                            </Button>
                        }
                        callback={{
                            title: "Update Event",
                            fn: () => {
                                mutate();
                            },
                        }}
                        title={{
                            initial: "Update Event",
                            pending: "Updating Your Event",
                            success: "Event Updated Successfully!",
                            error: "Unable to Update Your Event",
                        }}
                        isError={isError}
                        isPending={isPending}
                        isSuccess={isSuccess}
                        description="Are you sure you want to update this event?"
                    />
                </FormFooter>
            </Form>
        </Fragment>
    );
};

export default EditEvent;
