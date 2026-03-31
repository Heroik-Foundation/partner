import { AuthForm, initialValues } from "@/stores/auth";
import { ImageWithPreview } from "@/modules/units/form/image";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Button, buttonVariants } from "@/modules/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { handleInputChangeEvent } from "@/features/auth/global/helpers/input";
import { useUserPropertiesQuery } from "../global/hooks/query";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useUpdateUserDetailsMutation } from "./hooks/mutation";
import { Textarea } from "@/modules/ui/textarea";
import { Header } from "../global/header";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { UserRoundPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";

const FONT_SIZE_OPTIONS = [
  { label: "sm", value: "text-xs" },
  { label: "md", value: "text-sm" },
  { label: "lg", value: "text-base" },
  { label: "xl", value: "text-lg" },
] as const;

const Profile = () => {
  const [form, setForm] = useState<AuthForm>(initialValues);
  const { data: user } = useUserPropertiesQuery();
  const { mutate, isPending } = useUpdateUserDetailsMutation({
    name: form.name,
    address: form.address,
    eventsPerYear: String(form.events),
    logo: form.image as any,
    telephone: form.number,
    bio: form.bio,
  });
  const [bioFontSize, setBioFontSize] = useState<string>("text-base");

  const handleInitialData = useCallback(() => {
    if (user) {
      if ((!form.email || !form.number || !form.name) && user) {
        setForm({
          ...form,
          name: user.name,
          address: user.address,
          email: user.email,
          events: user.eventsPerYear,
          number: user.telephone,
          image: user.logo as any,
          bio: user.bio,
        });
      }
    }
  }, [user]);

  useEffect(() => {
    handleInitialData();
  }, [form.email, form.number, user]);

  return (
    <Fragment>
      <Header
        header={{
          title: "Profile",
          position: "stacked",
          subtitle: "Please Update Your Profile Details",
        }}
        addOns={{
          content: (
            <Link
              to="/app/profile/manage"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
              )}
            >
              <span>Manage</span>
              <UserRoundPlus className="mb-1" />
            </Link>
          ),
        }}
      />
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          if (form.name === "" || form.address === "" || form.number === "") {
            toast.info("Please complete the form and try again");
          } else if (!form.number.startsWith("+") || form.number.length < 8) {
            toast.info("Please enter a valid international phone number");
          } else {
            mutate();
          }
        }}
      >
        <FormContent>
          <ImageWithPreview
            handleState={(file) => {
              setForm({
                ...form,
                image: file,
              });
            }}
            initialPreview={user?.logo}
          />
          <FormField>
            <Label>Name</Label>
            <Input
              required
              name="name"
              value={form.name}
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>
          <FormField>
            <Label>Address</Label>
            <Input
              required
              name="address"
              value={form.address}
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>

          <FormField>
            <Label htmlFor="email">Email Address</Label>
            <Input
              name="email"
              placeholder="example@gmail.com"
              value={form.email}
              type="email"
              disabled
              readOnly
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>

          <FormField>
            <Label htmlFor="number">Phone number</Label>
            <Input
              name="number"
              placeholder="+41 ******"
              value={form.number}
              type="tel"
              required
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>

          <FormField>
            <div className="relative flex items-center justify-between">
              <Label htmlFor="bio">Partner Bio</Label>
              <Select value={bioFontSize} onValueChange={setBioFontSize}>
                <SelectTrigger
                  className="w-fit gap-1.5 text-xs border-primary/20 text-primary border-2 font-semibold focus:ring-primary h-7 px-2.5 rounded-md cursor-pointer"
                  aria-label="Select bio font size"
                >
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs font-semibold cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              className={bioFontSize}
              name="bio"
              placeholder="Write something about you"
              value={form.bio}
              onChange={(event: any) =>
                handleInputChangeEvent(event, form, setForm)
              }
            />
          </FormField>

          <FormField>
            <Label htmlFor="number">Number of Events Held Per Year</Label>
            <Input
              name="events"
              placeholder="0"
              value={form.events}
              type="number"
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>
        </FormContent>

        <FormFooter>
          <Button isPending={isPending} className="w-full" size="lg">
            Update Profile
          </Button>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default Profile;
