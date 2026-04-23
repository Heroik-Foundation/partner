"use client";

import { useAuthStore } from "@/stores/auth";
import { FormContent, FormField, FormFooter } from "../global/form";
import { ImageWithPreview } from "@/modules/units/form/image";
import { Input } from "@/modules/ui/input";
import { handleInputChangeEvent } from "../global/helpers/input";
import { Label } from "@/modules/ui/label";
import { Button } from "@/modules/ui/button";
import { useSignUpMutation } from "./hooks/mutation";
import { toast } from "sonner";
import PlaceAutocomplete from "@/modules/units/form/address";
import { Textarea } from "@/modules/ui/textarea";
import { Link } from "@tanstack/react-router";

const SignUp = () => {
  const { form, setForm } = useAuthStore();
  const { mutate, isPending } = useSignUpMutation();

  return (
    <form
      className="space-y-10"
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
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src="/logo/logo-purple.svg"
          alt=""
          className="size-11 lg:size-24"
        />
        <div className="space-y-2.5">
          <h1 className="text-primary font-bold text-3xl">Hiroek</h1>

          <p className="text font-semibold text-primary">
            Event Creator Platform <br />
            Built for <span className="text-accent">Creators</span>. Designed
            For <span className="text-accent">Growth</span>.
          </p>
        </div>
      </div>
      <div className="text-center">
        <h1 className="font-black text-primary text-2xl font-axiforma">
          Signup
        </h1>
      </div>
      <FormContent>
        <FormField>
          <Label>Setup Profile</Label>
          <ImageWithPreview />
        </FormField>
        <FormField>
          <Label>Company Name / Fullname</Label>
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

        <ul className="mx-auto w-fit text-center mt-5 space-y-5">
          <li className="font-normal text-black/50">
            Already Have An Account ?{" "}
            <Link to="/auth/login" className="font-bold text-primary underline">
              Login
            </Link>
          </li>
        </ul>
      </FormFooter>
    </form>
  );
};

export default SignUp;
