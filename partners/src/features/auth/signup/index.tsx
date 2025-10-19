"use client";

import { useAuthStore } from "@/stores/auth";
import { Form, FormContent, FormField, FormFooter } from "../global/form";
import { ImageWithPreview } from "@/modules/units/form/image";
import { Input } from "@/modules/ui/input";
import { handleInputChangeEvent } from "../global/helpers/input";
import { Label } from "@/modules/ui/label";
import { Button } from "@/modules/ui/button";
import { useSignUpMutation } from "./hooks/mutation";
import { toast } from "sonner";
import PlaceAutocomplete from "@/modules/units/form/address";
import { Textarea } from "@/modules/ui/textarea";

const SignUp = () => {
  const { form, setForm } = useAuthStore();
  const { mutate, isPending } = useSignUpMutation();

  return (
    <Form
      title="Sign Up"
      description="Please enter your details."
      previousRoute
      onSubmit={(event) => {
        event.preventDefault();

        if (
          form.name === "" ||
          form.address === "" ||
          form.email === "" ||
          form.number === "" ||
          form.image === null ||
          form.bio === ""
        ) {
          toast.info("Please complete the form and try again");
        } else if (!form.number.startsWith("+") || form.number.length < 8) {
          toast.info("Please enter a valid international phone number");
        } else {
          mutate();
        }
      }}
    >
      <FormContent>
        <ImageWithPreview />
        <FormField>
          <Label>Name</Label>
          <Input
            required
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>
        <FormField>
          <Label>Address</Label>
          <PlaceAutocomplete
            required
            callback={(value) => {
              const event: any = {
                target: {
                  value: value.address,
                  name: "address",
                },
              };

              handleInputChangeEvent(event, form, setForm);
            }}
          />
        </FormField>

        <FormField>
          <Label htmlFor="email">Email Address</Label>

          <Input
            name="email"
            placeholder="example@gmail.com"
            value={form.email}
            type="email"
            required
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
          <Label htmlFor="number">Partner Bio</Label>
          <Textarea
            required
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
          Sign Up
        </Button>
      </FormFooter>
    </Form>
  );
};

export default SignUp;
