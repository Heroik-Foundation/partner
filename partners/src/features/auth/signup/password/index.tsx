import { useAuthStore } from "@/stores/auth";
import { handleInputChangeEvent } from "../../global/helpers/input";
import { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormContent,
  FormField,
  FormFooter,
  FormPassword,
} from "../../global/form";
import { Label } from "@/modules/ui/label";
import { Button } from "@/modules/ui/button";
import { toast } from "sonner";
import { Route } from "@/routes/auth/signup/password";
import { useRouter } from "@tanstack/react-router";
import { useOTPValidationMutation } from "./hooks/mutation";

const SetupPassword = () => {
  const [password, setPassword] = useState("");
  const { form, setForm } = useAuthStore();
  const { verificationCode } = Route.useSearch();
  const { navigate } = useRouter();
  const { mutate, isPending } = useOTPValidationMutation();

  const handleVerificationCode = useCallback(() => {
    if (verificationCode && verificationCode.length > 3) {
      setForm({
        ...form,
        code: verificationCode,
      });
    } else {
      toast.error("Invalid verification link, please try again");
      navigate({
        to: "/auth/signup",
      });
    }
  }, [verificationCode]);

  useEffect(() => {
    handleVerificationCode();
  }, [verificationCode]);

  return (
    <Form
      title="Setup Password"
      description="Please setup your password for better security."
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.password !== "" && form.password === password) {
          mutate();
        } else if (form.password === password) {
          toast.info("Passwords don't match");
        }
      }}
    >
      <FormContent>
        <FormField>
          <Label htmlFor="password">Password</Label>
          <FormPassword
            name="password"
            value={form.password}
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>
        <FormField>
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <FormPassword
            name="confirm_password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
      </FormContent>
      <FormFooter absolute>
        <Button
          className="w-full font-axiforma font-semibold text-sm"
          disabled={!verificationCode}
          isPending={isPending}
          color="primary"
          size="lg"
        >
          Continue
        </Button>
      </FormFooter>
    </Form>
  );
};

export default SetupPassword;
