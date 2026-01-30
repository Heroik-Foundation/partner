import { useAuthStore } from "@/stores/auth";
import { handleInputChangeEvent } from "../../global/helpers/input";
import { useState } from "react";
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
import { useRecoveryValidationMutation } from "./hooks/mutation";

const SetupRecoveryPassword = () => {
  const [password, setPassword] = useState("");
  const { form, setForm } = useAuthStore();
  const { mutate, isPending } = useRecoveryValidationMutation();

  return (
    <Form
      title="Reset Password"
      description="Please setup your password for better security."
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.email === "" || form.password === "") {
          return;
        }

        if (form.password.trim() !== password.trim()) {
          toast.info("Passwords don't match");
          return;
        }

        mutate();
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
          color="primary"
          size="lg"
          isPending={isPending}
        >
          Reset Password
        </Button>
      </FormFooter>
    </Form>
  );
};

export default SetupRecoveryPassword;
