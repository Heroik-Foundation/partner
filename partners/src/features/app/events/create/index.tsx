import {
  Form,
  FormContent,
  FormCounter,
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

import { ChevronDown, PlusCircle, XCircle } from "lucide-react";
import { InputWithPrefix } from "../../global/form";
import { useCreateEventMutation } from "./hooks/mutation";
import { Link, useRouter } from "@tanstack/react-router";
import { useEventFormStore } from "../../global/hooks/logic";
import { ActionDrawer } from "@/modules/units/page/action";
import { useEffect } from "react";
import { Switch } from "@/modules/ui/switch";

const CreateEvent = () => {
  const { formState, setFundraiser, updateForm, reset } = useEventFormStore();
  const { navigate } = useRouter();
  const {
    isFundraiser,
    isPaid,
    startDate,
    endDate,
    minimumPledge,
    ticketPrice,
    charityPartners,
    subCategory,
    category,
    time,
    ...rest
  } = formState;
  const { mutate, isPending, isError, isSuccess } = useCreateEventMutation({
    privacy: "public",
    endTime: startDate,
    eventEndDate: endDate,
    ...(subCategory.name !== "" && {
      subCategory: subCategory.id,
    }),
    ...(isFundraiser && {
      eventPledge: {
        minimumPledge: Number(minimumPledge || 0),
        organizations: charityPartners.map((partner) => partner.id) || [],
      },
    }),
    eventTicket: {
      ticketPrice: Number(ticketPrice || 0),
      totalTicket: Number(rest.signUpLimit || 0),
    },
    category: category.id,
    time,
    ...rest,
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  const removeCharityOrganizationById = (id: string) => {
    const currentPartners = formState.charityPartners as Array<{
      id: string;
      name: string;
    }>;

    const updatedPartners = currentPartners.filter(
      (partner) => partner.id !== id
    );

    updateForm("charityPartners", updatedPartners);
  };

  return (
    <Fragment>
      <Header
        header={{
          position: "stacked",
          title: "Create New Event",
          subtitle: "Enter the required information below.",
        }}
      />
      <Form>
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
            <Input
              required
              placeholder="Type Event/Address here"
              value={formState.address}
              onChange={({ target }) => {
                updateForm("address", target.value);
              }}
            />
          </FormField>
          <FormField>
            <Label>Set Signup Limit</Label>
            <FormCounter
              required
              value={formState.signUpLimit}
              onChange={({ target }) => {
                updateForm("signUpLimit", Number(target.value));
              }}
              increment={() => {
                updateForm("signUpLimit", formState.signUpLimit + 1);
              }}
              decrement={() => {
                if (formState.signUpLimit > 0) {
                  updateForm("signUpLimit", formState.signUpLimit - 1);
                }
              }}
            />
          </FormField>
          <FormField>
            <Label>Event Category</Label>
            <Link
              to="/app/events/create/category"
              className="bg-primary text-white h-14 rounded-xl font-bold ring-primary flex items-center justify-between p-2.5"
            >
              <span className="text-sm font-semibold">
                {formState.subCategory.name ||
                  formState.category.name ||
                  "Event Category"}
              </span>
              <ChevronDown size={14} />
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
          <FormField>
            <Label>Time</Label>
            <Input
              required
              className="text-primary border-none bg-primary/5"
              type="time"
              value={time}
              onChange={({ target }) => {
                updateForm("time", target.value);
              }}
            />
          </FormField>

          <div className="w-full flex justify-between items-center">
            <Label>Is this a Paid ticketed event?</Label>
            <Switch
              checked={isPaid}
              onCheckedChange={() => {
                updateForm("isPaid", !isPaid);

                if (isPaid === false) {
                  updateForm("ticketPrice", 0);
                }
              }}
            />
          </div>

          {isPaid && (
            <FormField>
              <Label>Event Ticket Price</Label>
              <InputWithPrefix
                prefixItem={<span className="font-bold">£</span>}
                type="number"
                value={String(formState.ticketPrice)}
                onChange={({ target }) => {
                  updateForm("ticketPrice", Number(target.value));
                }}
                placeholder="0"
                className="pl-7"
              />
            </FormField>
          )}

          {isFundraiser === false && (
            <div className="w-full flex justify-between items-center">
              <Label>Is this a Fundraiser Event?</Label>
              <Switch
                checked={isPaid}
                onCheckedChange={() => {
                  updateForm("isFundraiser", !isFundraiser);
                }}
              />
            </div>
          )}

          {isFundraiser === true && (
            <div className="p-5 bg-primary rounded-xl text-white space-y-5">
              <div className="flex items-center justify-between">
                <Label className="text-white">Set Minimum Pledge</Label>
                <button type="button" onClick={() => setFundraiser(false)}>
                  <XCircle className="stroke-primary fill-white" />
                </button>
              </div>
              <FormField>
                <InputWithPrefix
                  prefixItem={<span>£</span>}
                  placeholder="0"
                  value={Number(formState.minimumPledge)}
                  onChange={({ target }) => {
                    updateForm("minimumPledge", Number(target.value));
                  }}
                  className="bg-primary text-white border-white/50 ring-white border pl-7"
                />
              </FormField>
              <FormField>
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {formState.charityPartners.length >= 1 &&
                    formState.charityPartners.map((partner, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1.5 bg-white/30 py-2 px-3.5 rounded-full w-fit whitespace-nowrap"
                      >
                        <span className="text-white text-sm font-bold">
                          {partner.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            removeCharityOrganizationById(partner.id);
                          }}
                        >
                          <XCircle className="stroke-1 fill-white/60 stroke-primary" />
                        </button>
                      </div>
                    ))}
                </div>

                <InputWithPrefix
                  prefixItem={
                    <PlusCircle className="stroke-1 fill-white/60 stroke-primary" />
                  }
                  onFocus={() => {
                    navigate({
                      to: "/app/events/create/partners",
                    });
                  }}
                  className="text-white border-white/50 border bg-primary placeholder:text-white font-normal text-sm"
                  readOnly
                  placeholder="Add Charity Partner"
                />
              </FormField>
            </div>
          )}
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
                Create Event
              </Button>
            }
            callback={{
              title: "Create Event",
              fn: () => {
                mutate();
                // reset();
              },
            }}
            title={{
              initial: "Create New Event",
              pending: "Creating Your Event",
              success: "Event Created Successfully!",
              error: "Unable to Create Your Event",
            }}
            isError={isError}
            isPending={isPending}
            isSuccess={isSuccess}
            description="Are you sure you want to create this new event?"
          />
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEvent;
