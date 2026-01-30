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
import { useSearch } from "@tanstack/react-router";

const SetupRecoveryPassword = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const {
    email,
    resetCode,
  }: {
    email: string;
    resetCode: string;
  } = useSearch({
    from: "/auth/recovery/password/",
  });

  const { mutate, isPending } = useRecoveryValidationMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.trim() !== form.confirmPassword.trim()) {
      toast.info("Passwords don't match");
      return;
    }

    mutate({
      email,
      password: form.password.trim(),
      resetCode,
    });
  };

  return (
    <Form
      title="Reset Password"
      description="Please setup your password for better security."
      previousRoute={true}
      onSubmit={handleSubmit}
    >
      <FormContent>
        {email && (
          <div className="mb-4 text-sm text-muted-foreground">
            Resetting password for: <strong>{email}</strong>
          </div>
        )}

        <FormField>
          <Label htmlFor="password">New Password</Label>
          <FormPassword
            id="password"
            name="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            autoComplete="new-password"
          />
        </FormField>

        <FormField>
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <FormPassword
            id="confirm_password"
            name="confirm_password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            autoComplete="new-password"
          />
        </FormField>
      </FormContent>

      <FormFooter absolute>
        <Button
          type="submit"
          className="w-full font-axiforma font-semibold text-sm"
          color="primary"
          size="lg"
          isPending={isPending}
          disabled={isPending}
        >
          Reset Password
        </Button>
      </FormFooter>
    </Form>
  );
};

export default SetupRecoveryPassword;
