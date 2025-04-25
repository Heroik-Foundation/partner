"use client";

import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import {
  Form,
  FormContent,
  FormField,
  FormFooter,
  FormPassword,
} from "../global/form";
import { Input } from "@/modules/ui/input";
import { Button } from "@/modules/ui/button";
import { Label } from "@/modules/ui/label";
import { handleInputChangeEvent } from "../global/helpers/input";
import { useLoginMutation } from "./hooks/mutation";
import { toast } from "sonner";
import { AutoCompleteInput } from "@/modules/units/form/address";

const Login = () => {
  const { form, setForm } = useAuthStore();
  const { mutate, isPending } = useLoginMutation();

  return (
    <Form
      title="Log In"
      description="Please enter your account details."
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.email !== "" && form.password !== "") {
          mutate();
        } else {
          toast.info("Please complete the form and try again");
        }
      }}
    >
      <FormContent>
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
          <Label htmlFor="password">Password</Label>
          <FormPassword
            name="password"
            value={form.password}
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>
        <Link
          to="/auth/recovery"
          className="text-sm font-axiforma font-bold float-right text-primary"
        >
          Forgot Password ?
        </Link>

        <AutoCompleteInput />
      </FormContent>
      <FormFooter absolute>
        <Button
          className="w-full font-axiforma font-semibold text-sm"
          color="primary"
          size="lg"
          isPending={isPending}
        >
          Log In
        </Button>
      </FormFooter>
    </Form>
  );
};

export default Login;
