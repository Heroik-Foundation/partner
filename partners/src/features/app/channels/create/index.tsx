import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";

import { ImageWithPreview } from "@/modules/units/form/image";
import { useEffect, useState } from "react";
import { useCreateChannelMutation } from "./hooks/mutation";
import { toast } from "sonner";
import { ActionDrawer } from "@/modules/units/page/action";
import MarkdownEditor from "@/modules/ui/markdown-editor";

const CreateChannel = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    private: false,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const { mutate, isPending, isSuccess, isError } = useCreateChannelMutation({
    name: form.name,
    description: form.description,
    photo,
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      private: false,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  return (
    <Form
      title="Create Channel"
      description="Stay connected with your audience before, during and after every event."
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
            placeholder="Type channel name here ..."
          />
        </FormField>
        <FormField>
          <Label>Channel Description</Label>
          <MarkdownEditor
            value={form.description}
            onChange={(markdownContent) => {
              setForm((prev) => ({
                ...prev,
                description: markdownContent,
              }));
            }}
            placeholder="Type channel description here ..."
          />
        </FormField>
        {/* <FormField className="flex flex-row items-center w-full justify-between space-y-0">
          <Label>Private Channel</Label>
          <Switch
            disabled
            checked={form.private}
            // onCheckedChange={(checked) => {
            //   setForm({
            //     ...form,
            //     private: checked,
            //   });
            // }}
          />
        </FormField> */}
      </FormContent>
      <FormFooter absolute>
        <ActionDrawer
          trigger={
            <Button
              type="button"
              isPending={isPending}
              size="lg"
              className="w-full"
            >
              Create New Channel
            </Button>
          }
          isError={isError}
          isPending={isPending}
          isSuccess={isSuccess}
          title={{
            error: "Unable to create channel",
            initial: "Create New Channel",
            pending: "Creating Your Channel",
            success: "Channel Created Successfully!",
          }}
          description="Are you sure you want to create this new channel?"
          callback={{
            fn: mutate,
            title: "Yes, Proceed",
          }}
        />
      </FormFooter>
    </Form>
  );
};

export default CreateChannel;
