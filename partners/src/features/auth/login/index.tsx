"use client";

import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import {
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
    <form
      className="space-y-10"
      onSubmit={(event) => {
        event.preventDefault();

        if (form.email !== "" && form.password !== "") {
          mutate();
        } else {
          toast.info("Please complete the form and try again");
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
          Login
        </h1>
      </div>
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
    </form>
  );
};

export default Login;
