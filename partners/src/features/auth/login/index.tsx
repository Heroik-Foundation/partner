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
        {/* <AutoCompleteInput /> */}
      </FormContent>
      <FormFooter>
        <Button
          className="w-full font-axiforma font-semibold text-sm"
          color="primary"
          size="lg"
          isPending={isPending}
        >
          Log In
        </Button>

        <ul className="mx-auto w-fit text-center mt-5 space-y-5">
          <li className="font-normal text-black/50">
            Don't Have An Account ?{" "}
            <Link
              to="/auth/signup"
              className="font-bold text-primary underline"
            >
              Register
            </Link>
          </li>

          <li className="font-normal text-black/50">
            Forgot Password ?{" "}
            <Link
              to="/auth/recovery"
              className="font-bold text-primary underline"
            >
              Reset
            </Link>
          </li>
        </ul>
      </FormFooter>
    </Form>
  );
};

export default Login;
