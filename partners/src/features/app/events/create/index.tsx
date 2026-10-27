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
import { Fragment } from "react/jsx-runtime";
import { Header } from "../../global/header";

import { ChevronRight, Video } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";
import { useEventFormStore } from "../../global/hooks/logic";
import { fileToDataUrl } from "@/helpers/file";

import PlaceAutocomplete from "@/modules/units/form/address";
import { useMapStore } from "@/stores/maps";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ActionDialog } from "@/modules/units/page/action";
import { useState } from "react";
import { InputWithPrefix } from "../../global/form";
import { Switch } from "@/modules/ui/switch";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { DatePicker, formatDateToISO } from "@/modules/ui/date-picker";
import { TimePicker } from "@/modules/ui/time-picker";

const CreateEvent = () => {
  const { formState, updateForm, reset } = useEventFormStore();
  const { resetStore } = useMapStore();
  const navigate = useNavigate();

  const [openClosingDialog, setOpenClosingDialogState] =
    useState<boolean>(false);
  const hasUserInput = Boolean(
    formState.name ||
    formState.description ||
    formState.photo ||
    formState.address ||
    formState.meetingLink ||
    formState.category.id ||
    formState.startDate ||
    formState.endDate ||
    formState.startTime ||
    formState.endTime,
  );

  const handleStartDateChange = (date: string) => {
    updateForm("startDate", date);
  };

  const handleEndDateChange = (date: string) => {
    updateForm("endDate", date);
  };

  const handleStartTimeChange = (time: string) => {
    updateForm("startTime", time);
  };

  const handleSubmit = () => {
    if (!formState.name?.trim()) {
      toast.info("Please enter an event name");
      return;
    }

    if (!formState.category.id && !formState.category.name) {
      toast.info("Please select a category");
      return;
    }

    if (!formState.startDate) {
      toast.info("Please select a start date");
      return;
    }

    if (!formState.endDate) {
      toast.info("Please select an end date");
      return;
    }

    if (formState.endDate < formState.startDate) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    if (!formState.startTime) {
      toast.info("Please select a start time");
      return;
    }

    if (!formState.endTime) {
      toast.info("Please select an end time");
      return;
    }

    if (
      formState.startDate === formState.endDate &&
      formState.endTime <= formState.startTime
    ) {
      toast.error("End time must be after start time");
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
            handleState={async (file) => {
              const dataUrl = await fileToDataUrl(file);
              updateForm("photo", dataUrl);
            }}
          />

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
              {formState.isOnlineEvent ? "Event Meeting Link" : "Event Venue"}
            </Label>
            {formState.isOnlineEvent ? (
              <InputWithPrefix
                required
                pattern="https://(www\.)?(zoom\.us/j/\d+|meet\.google\.com/[a-zA-Z-]+|teams\.microsoft\.com/l/meetup-join/.+)"
                title="Enter a Zoom, Google Meet, or Microsoft Teams meeting link"
                value={formState.meetingLink || ""}
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
                  formState.address
                    ? {
                      address: formState.address,
                      lat: formState.latitude || 0,
                      lng: formState.longitude || 0,
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

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField>
              <Label>Start Date</Label>
              <DatePicker
                required
                value={formState.startDate}
                onChange={handleStartDateChange}
                minDate={formatDateToISO(new Date())}
                placeholder="Select start date"
              />
            </FormField>
            <FormField>
              <Label>End Date</Label>
              <DatePicker
                required
                value={formState.endDate}
                onChange={handleEndDateChange}
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
                onChange={handleStartTimeChange}
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
                  updateForm("isRefundable", Boolean(value));
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
