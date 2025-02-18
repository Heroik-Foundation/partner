"use client";

import { useAuthStore } from "@/stores/auth";
import { Form, FormContent, FormField, FormFooter } from "../global/form";
import { Input } from "@/modules/ui/input";
import { Button } from "@/modules/ui/button";
import { Label } from "@/modules/ui/label";
import { handleInputChangeEvent } from "../global/helpers/input";
import { toast } from "sonner";
import { useRecoveryMutation } from "./hooks/mutation";

const Recovery = () => {
  const { form, setForm } = useAuthStore();
  const { mutate, isPending } = useRecoveryMutation();

  return (
    <Form
      title="Reset Password"
      description="Please enter your email address to reset your password"
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.email !== "") {
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
      </FormContent>
      <FormFooter>
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

export default Recovery;
