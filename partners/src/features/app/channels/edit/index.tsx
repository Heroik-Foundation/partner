import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Textarea } from "@/modules/ui/textarea";
import { ImageWithPreview } from "@/modules/units/form/image";
import { Label } from "@radix-ui/react-label";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChannelDetailsQuery } from "../hooks/query";
import { useEditChannelMutation } from "./hooks/mutation";
import { toast } from "sonner";
import { ActionDrawer } from "@/modules/units/page/action";

const EditChannel = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: channel } = useChannelDetailsQuery({ id });
  const [form, setForm] = useState({
    name: channel?.name,
    description: channel?.description,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const { mutate, isPending, isError, isSuccess } = useEditChannelMutation({
    name: String(form.name),
    description: String(form.description),
    id: id,
    photo,
  });

  return (
    <Form
      title="Edit Channel"
      description="Effortless Event Creation and Community Engagement."
      previousRoute={true}
      onSubmit={(event) => {
        event.preventDefault();

        if (form.name !== "" && form.description !== "") {
          mutate();
        } else {
          toast.error("Title and description can't be empty");
        }
      }}
    >
      <FormContent>
        <ImageWithPreview initialPreview={channel?.photo} setState={setPhoto} />
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
      <FormFooter>
        <ActionDrawer
          trigger={
            <Button
              type="button"
              isPending={isPending}
              size="lg"
              className="w-full"
            >
              Update Channel
            </Button>
          }
          isError={isError}
          isPending={isPending}
          isSuccess={isSuccess}
          title={{
            error: "Unable to Update Channel",
            initial: "Update Channel",
            pending: "Updating Your Channel",
            success: "Channel Updated Successfully!",
          }}
          description="Are you sure you want to update this channel"
          callback={{
            fn: mutate,
            title: "Yes, Proceed",
          }}
        />
      </FormFooter>
    </Form>
  );
};

export default EditChannel;
