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
import { ImageWithPreview } from "@/modules/ui/units/form/image";
import { Fragment } from "react/jsx-runtime";
import { Header } from "../../global/header";
import { Switch } from "@/modules/ui/switch";
import { ChevronDown, XCircle } from "lucide-react";
import { SearchInput } from "../../global/form";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import { useUpdateEventMutation } from "./hooks/mutation";
import { useEventFormStore } from "../../global/hooks/logic";
import { useEventDetailsQuery } from "../hooks/query";
import { useEffect } from "react";
import { getInitialEventState } from "./helpers/data";

const CreateEvent = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({
    id,
  });
  const { formState, setPaid, setFundraiser, updateForm, setFormState } =
    useEventFormStore();
  const { navigate } = useRouter();
  const {
    isPaid,
    isFundraiser,
    startDate,
    endDate,
    minimumPledge,
    ticketPrice,
    charityPartners,
    ...rest
  } = formState;
  const { mutate, isPending } = useUpdateEventMutation({
    eventId: id,
    privacy: "public",
    endTime: startDate,
    eventEndDate: endDate,
    ...rest,
    ...(isPaid && {
      eventTicket: {
        ticketPrice: Number(ticketPrice || 0),
        totalTicket: Number(rest.signUpLimit || 0),
      },
      ...(isFundraiser && {
        eventPledge: {
          minimumPledge: Number(minimumPledge || 0),
          organizations: charityPartners || [],
        },
      }),
    }),
  });

  useEffect(() => {
    if (event && formState.name === "") {
      setFormState(getInitialEventState(event));
    }
  }, [event]);

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
          mutate();
        }}
      >
        <FormContent>
          <ImageWithPreview
            handleState={(file) => {
              updateForm("photo", file);
            }}
            //@ts-ignore
            initialPreview={formState.photo}
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
                {formState.category || "Event Category"}
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
                type="date"
              />
            </FormField>
          </div>
          <div className="flex items-center justify-between">
            <Label>Is this a Paid ticketed event?</Label>
            <Switch
              checked={isPaid}
              onCheckedChange={() => {
                setPaid(!isPaid);
              }}
            />
          </div>
          {isPaid && (
            <>
              <FormField>
                <Label>Event Ticket Price</Label>
                <Input
                  type="number"
                  value={String(formState.ticketPrice)}
                  onChange={({ target }) => {
                    updateForm("ticketPrice", Number(target.value));
                  }}
                  placeholder="0"
                />
              </FormField>
            </>
          )}
          <div className="flex items-center justify-between">
            <Label>Do you want to use the event for a fundraiser ?</Label>
            <Switch
              checked={isFundraiser}
              onCheckedChange={() => {
                setFundraiser(!isFundraiser);
              }}
            />
          </div>
          {isFundraiser && (
            <div className="p-5 bg-primary rounded-xl text-white">
              <FormField>
                <div className="flex items-center justify-between">
                  <Label className="text-white">Set Minimum Pledge</Label>
                  <button onClick={() => setFundraiser(false)}>
                    <XCircle className="stroke-primary fill-white" />
                  </button>
                </div>
                <Input
                  placeholder="0"
                  value={Number(formState.minimumPledge)}
                  onChange={({ target }) => {
                    updateForm("minimumPledge", Number(target.value));
                  }}
                  className="bg-primary text-white border-white/50 ring-white"
                />
              </FormField>
              <FormField>
                <Label>Add Charity Partners</Label>

                <SearchInput
                  onFocus={() => {
                    navigate({
                      to: "/app/events/create/partners",
                    });
                  }}
                  className="text-white border-white/50 bg-primary placeholder:text-white/50"
                  readOnly
                  value={formState.charityPartners.join(", ")}
                  searchIconClassName="stroke-white"
                  placeholder="Search Charity Partners"
                />
              </FormField>
            </div>
          )}
        </FormContent>
        <FormFooter>
          <Button className="w-full" size="lg" isPending={isPending}>
            Update Event
          </Button>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default CreateEvent;
