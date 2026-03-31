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
import { Fragment } from "react/jsx-runtime";
import { Header } from "../../global/header";

import { ChevronRight, Video } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";
import { useEventFormStore, defaultValue } from "../../global/hooks/logic";

import PlaceAutocomplete from "@/modules/units/form/address";
import { useMapStore } from "@/stores/maps";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ActionDialog } from "@/modules/units/page/action";
import { useState } from "react";
import { InputWithPrefix } from "../../global/form";
import { Switch } from "@/modules/ui/switch";

const CreateEvent = () => {
  const { formState, updateForm, reset } = useEventFormStore();
  const { resetStore } = useMapStore();
  const navigate = useNavigate();

  const [openClosingDialog, setOpenClosingDialogState] =
    useState<boolean>(false);
  const hasUserInput =
    JSON.stringify(defaultValue) !== JSON.stringify(formState);

  const handleSubmit = () => {
    if (!formState.category) {
      toast.info("Please select a category");
      return;
    }

    navigate({
      to: "/app/events/create/options",
    });
  };

  const handleUnresolvedUserInput = () => {
    reset();
    resetStore();
    navigate({
      to: "/app",
    });
  };

  return (
    <Fragment>
      <Header
        header={{
          position: "stacked",
          title: "Create New Event",
          subtitle: "Enter the required information below.",
        }}
        previousRouteCallback={() => {
          if (hasUserInput) {
            setOpenClosingDialogState(true);
          } else {
            navigate({
              to: "/app",
            });
          }
        }}
      />

      <Form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <FormContent className="space-y-8">
          <ImageWithPreview
            state={formState.photo}
            handleState={(file) => {
              updateForm("photo", file);
            }}
            initialPreview={
              typeof formState.photo === "string" ? formState.photo : undefined
            }
          />

          <div className="w-full px-3 py-4 bg-primary/10 rounded-xl text-primary">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-primary">
                Is this an online event ?
              </span>
              <Switch
                checked={formState.isOnlineEvent}
                onCheckedChange={(value) => {
                  updateForm("isOnlineEvent", value);
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
              {formState.isOnlineEvent ? "Event Meeting Link" : "Event Venue"}
            </Label>
            {formState.isOnlineEvent ? (
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
            ) : (
              <PlaceAutocomplete
                required
                placeholder="Type Event/Address here"
                initialValue={
                  formState.address && formState.latitude && formState.longitude
                    ? {
                        address: formState.address,
                        lat: formState.latitude,
                        lng: formState.longitude,
                      }
                    : undefined
                }
                callback={(value) => {
                  updateForm("address", String(value.address));
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
          <Button className="w-full" size="lg">
            Continue
          </Button>
        </FormFooter>
      </Form>

      {hasUserInput && openClosingDialog && (
        <ActionDialog
          isOpen={openClosingDialog}
          setIsOpen={setOpenClosingDialogState}
          title="Discard this event"
          description="Clicking on Accept would clear out all previously inputed details"
          callback={{
            fn: handleUnresolvedUserInput,
          }}
        />
      )}
    </Fragment>
  );
};

export default CreateEvent;
