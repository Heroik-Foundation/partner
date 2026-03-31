import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
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
import { useMapStore } from "@/stores/maps";
import { InputWithPrefix } from "../../global/form";

const EditEvent = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({
    id,
  });

  const { resetStore } = useMapStore();

  const { formState, updateForm, setFormState, reset } = useEventFormStore();

  const { mutate, isPending, isSuccess, isError } = useUpdateEventMutation({
    mode: "diff",
    //@ts-ignore
    event: event,
    ...formState,
  });

  const handleInitialEventDataUpdate = () => {
    if (event && (formState.name === "" || formState.name !== event.name)) {
      setFormState(getInitialEventState(event) as any);
    }
  };

  useEffect(() => {
    handleInitialEventDataUpdate();

    return () => {
      reset();
      resetStore();
    };
  }, [event, id]);

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
          <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary">
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
          </div>
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
            <Textarea
              required
              value={formState.description}
              onChange={({ target }) => {
                updateForm("description", target.value);
              }}
              placeholder="Type Event Description here..."
            />
          </FormField>
          <FormField>
            <Label>
              {" "}
              {formState.isOnlineEvent ? "Event Meeting Link" : "Event Venue"}
            </Label>
            {formState.isOnlineEvent && (
              <InputWithPrefix
                required
                pattern="https://(www\.)?(zoom\.us/j/\d+|meet\.google\.com/[a-zA-Z-]+|teams\.microsoft\.com/l/meetup-join/.+)"
                title="Enter a Zoom, Google Meet, or Microsoft Teams meeting link"
                value={formState.meetingLink}
                onChange={({ target }) => {
                  updateForm("meetingLink", String(target.value));
                }}
                prefixItem={<Video className="stroke-primary/50" />}
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
              className=" text-primary h-14 rounded-xl font-bold ring-primary flex items-center justify-between p-2.5 border-2 border-pirmary/15"
            >
              <div className="flex items-center space-x-2.5 w-6 h-6">
                <img src={formState.category.image} className="" />
                <span
                  className={cn(
                    "font-bold whitespace-nowrap text-primary/50",
                    (formState?.subCategory?.name || formState.category.name) &&
                      "text-primary",
                  )}
                >
                  {formState?.subCategory?.name ||
                    formState.category.name ||
                    "Select Event Category"}
                </span>
              </div>
              <ChevronRight size={14} className="stroke-2 stroke-primary" />
            </Link>
          </FormField>

          <div className="w-full space-x-5 flex items-center justify-between">
            <FormField>
              <Label>Start Date</Label>
              <Input
                required
                value={formState.startDate}
                onChange={({ target }) => {
                  updateForm("startDate", target.value);
                }}
                className="text-primary border-none bg-primary/5"
                type="date"
              />
            </FormField>
            <FormField>
              <Label>End Date</Label>
              <Input
                required
                value={formState.endDate}
                onChange={({ target }) => {
                  updateForm("endDate", target.value);
                }}
                className="text-primary border-none bg-primary/5"
                type="date"
              />
            </FormField>
          </div>

          <div className="w-full space-x-5 flex items-center justify-between">
            <FormField>
              <Label>Start Time</Label>
              <Input
                required
                className="text-primary border-none bg-primary/5"
                type="time"
                value={formState.startTime}
                onChange={({ target }) => {
                  updateForm("startTime", target.value);
                }}
              />
            </FormField>
            <FormField>
              <Label>End Time</Label>
              <Input
                required
                className="text-primary border-none bg-primary/5"
                type="time"
                value={formState.endTime}
                onChange={({ target }) => {
                  updateForm("endTime", target.value);
                }}
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
