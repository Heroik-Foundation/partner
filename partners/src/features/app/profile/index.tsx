import { useAuthStore } from "@/stores/auth";
import { ImageWithPreview } from "@/modules/units/form/image";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Button } from "@/modules/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormContent,
  FormField,
  FormFooter,
} from "@/features/auth/global/form";
import { handleInputChangeEvent } from "@/features/auth/global/helpers/input";
import { useUserPropertiesQuery } from "../global/hooks/query";
import { useCallback, useEffect } from "react";
import { useUpdateUserDetailsMutation } from "./hooks/mutation";
import { Textarea } from "@/modules/ui/textarea";

const Profile = () => {
  const { form, setForm, resetForm } = useAuthStore();
  const { data: user } = useUserPropertiesQuery();
  const { mutate, isPending } = useUpdateUserDetailsMutation({
    name: form.name,
    address: form.address,
    eventsPerYear: String(form.events),
    logo: form.image as any,
    telephone: form.number,
    bio: form.bio,
  });

  const handleInitialData = useCallback(() => {
    if (user) {
      if ((!form.email || !form.number || !form.name) && user) {
        setForm({
          ...form,
          name: user.name,
          address: user.address,
          email: user.email,
          events: user.eventsPerYear,
          number: user.telephone,
          image: user.logo as any,
          bio: user.bio,
        });
      }
    }
  }, [user]);

  useEffect(() => {
    handleInitialData();

    return () => {
      resetForm();
    };
  }, [form.email, form.number, user]);

  return (
    <Form
      title="Profile"
      description="Please Update Your Profile Details"
      previousRoute
      onSubmit={(event) => {
        event.preventDefault();

        if (form.name === "" || form.address === "" || form.number === "") {
          toast.info("Please complete the form and try again");
        } else if (!form.number.startsWith("+") || form.number.length < 8) {
          toast.info("Please enter a valid international phone number");
        } else {
          mutate();
        }
      }}
    >
      <FormContent>
        <ImageWithPreview initialPreview={user?.logo} />
        <FormField>
          <Label>Name</Label>
          <Input
            required
            name="name"
            value={form.name}
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>
        <FormField>
          <Label>Address</Label>
          <Input
            required
            name="address"
            value={form.address}
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>

        <FormField>
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            placeholder="example@gmail.com"
            value={form.email}
            type="email"
            disabled
            readOnly
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>

        <FormField>
          <Label htmlFor="number">Phone number</Label>
          <Input
            name="number"
            placeholder="+41 ******"
            value={form.number}
            type="tel"
            required
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>

        <FormField>
          <Label htmlFor="number">Partner Bio</Label>
          <Textarea
            name="bio"
            placeholder="Write something about you"
            value={form.bio}
            onChange={(event: any) =>
              handleInputChangeEvent(event, form, setForm)
            }
          />
        </FormField>

        <FormField>
          <Label htmlFor="number">Number of Events Held Per Year</Label>
          <Input
            name="events"
            placeholder="0"
            value={form.events}
            type="number"
            onChange={(event) => handleInputChangeEvent(event, form, setForm)}
          />
        </FormField>
      </FormContent>

      <FormFooter>
        <Button isPending={isPending} className="w-full" size="lg">
          Update Profile
        </Button>
      </FormFooter>
    </Form>
  );
};

export default Profile;
