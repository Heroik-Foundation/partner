import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import { ImageWithPreview } from "@/modules/ui/units/form/image";
import { useState } from "react";
import { useCreateChannelMutation } from "./hooks/mutation";
import { toast } from "sonner";

const CreateChannel = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const { mutate, isPending } = useCreateChannelMutation({
    name: form.name,
    description: form.description,
    photo,
  });

  return (
    <Form
      title="Create Channel"
      description="Effortless Event Creation and Community Engagement."
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.name !== "" && form.description !== "" && photo !== null) {
          mutate();
        } else {
          toast.error("Please complete the form and try again");
        }
      }}
    >
      <FormContent>
        <ImageWithPreview setState={setPhoto} />
        <FormField>
          <Label>Channel Name</Label>
          <Input
            value={form.name}
            onChange={({ target }) => {
              setForm((prev) => ({
                ...prev,
                name: target.value,
              }));
            }}
            placeholder="Type Channel Name here ..."
          />
        </FormField>
        <FormField>
          <Label>Channel Description</Label>
          <Textarea
            value={form.description}
            onChange={({ target }) => {
              setForm((prev) => ({
                ...prev,
                description: target.value,
              }));
            }}
            placeholder="Type Channel Name here ..."
          />
        </FormField>
      </FormContent>
      <FormFooter absolute>
        <Button
          type="submit"
          isPending={isPending}
          size="lg"
          className="w-full"
        >
          Create New Channel
        </Button>
      </FormFooter>
    </Form>
  );
};

export default CreateChannel;
