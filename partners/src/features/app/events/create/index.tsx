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

import { ChevronRight } from "lucide-react";

import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEventFormStore } from "../../global/hooks/logic";

import PlaceAutocomplete from "@/modules/units/form/address";
import { useMapStore } from "@/stores/maps";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouteStore } from "@/hooks/router";

const CreateEvent = () => {
  const { formState, updateForm, reset } = useEventFormStore();
  const { previousPath } = useRouteStore();
  const { resetStore } = useMapStore();
  const navigate = useNavigate();
  const { history } = useRouter();

  const backRoute = previousPath?.toLowerCase().includes("pre-launch")
    ? `/app/`
    : undefined;

  const handleSubmit = () => {
    if (!formState.category) {
      toast.info("Please select a category");
      return;
    }

    navigate({
      to: "/app/events/create/options",
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
          reset();
          resetStore();
          history.back();
        }}
        previousButtonRoute={backRoute}
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
            <Label>Event Venue</Label>
            <PlaceAutocomplete
              required
              placeholder="Type Event/Address here"
              callback={(value) => {
                updateForm("address", String(value.address));
                updateForm("longitude", value.lng);
                updateForm("latitude", value.lat);
              }}
            />
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
                    (formState.subCategory.name || formState.category.name) &&
                      "text-primary"
                  )}
                >
                  {formState.subCategory.name ||
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
        </FormContent>
        <FormFooter>
          <Button className="w-full" size="lg">
            Continue
          </Button>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEvent;
