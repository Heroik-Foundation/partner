import { AuthForm, initialValues } from "@/stores/auth";
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
import { Fragment, useCallback, useEffect, useState } from "react";
import { useUpdateUserDetailsMutation } from "./hooks/mutation";

import { Header } from "../global/header";
import MarkdownEditor from "@/modules/ui/markdown-editor";
import { usePermissions } from "@/hooks/use-permissions";
import { ShieldAlert } from "lucide-react";

const Profile = () => {
  const [form, setForm] = useState<AuthForm>(initialValues);
  const { data: user } = useUserPropertiesQuery();
  const { canUpdateUserInfo } = usePermissions();
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
  }, [form.email, form.number, user]);

  return (
    <Fragment>
      <Header
        header={{
          title: "Profile",
          position: "stacked",
          subtitle: canUpdateUserInfo
            ? "Please Update Your Profile Details"
            : "View Your Profile Details (Read Only)",
        }}
      />

      {!canUpdateUserInfo && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5">
          <ShieldAlert className="text-amber-600 flex-shrink-0" size={18} />
          <span>
            User information updates are restricted to the account owner. You have view-only access to this profile.
          </span>
        </div>
      )}

      <Form
        onSubmit={(event) => {
          event.preventDefault();

          if (!canUpdateUserInfo) {
            toast.error("Profile updates are restricted to the account owner.");
            return;
          }

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
          <div className={!canUpdateUserInfo ? "pointer-events-none opacity-80" : ""}>
            <ImageWithPreview
              handleState={(file) => {
                if (!canUpdateUserInfo) return;
                setForm({
                  ...form,
                  image: file,
                });
              }}
              initialPreview={user?.logo}
            />
          </div>
          <FormField>
            <Label>Name</Label>
            <Input
              required
              disabled={!canUpdateUserInfo}
              name="name"
              value={form.name}
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>
          <FormField>
            <Label>Address</Label>
            <Input
              required
              disabled={!canUpdateUserInfo}
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
              disabled={!canUpdateUserInfo}
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>

          <FormField>
            <Label htmlFor="bio">Bio</Label>

            <div className={!canUpdateUserInfo ? "pointer-events-none opacity-80" : ""}>
              <MarkdownEditor
                value={form.bio}
                onChange={(markdownContent) => {
                  if (!canUpdateUserInfo) return;
                  setForm({
                    ...form,
                    bio: markdownContent,
                  });
                }}
              />
            </div>
          </FormField>

          <FormField>
            <Label htmlFor="number">Number of Events Held Per Year</Label>
            <Input
              name="events"
              placeholder="0"
              value={form.events}
              type="number"
              disabled={!canUpdateUserInfo}
              onChange={(event) => handleInputChangeEvent(event, form, setForm)}
            />
          </FormField>
        </FormContent>

        <FormFooter>
          {canUpdateUserInfo ? (
            <Button isPending={isPending} className="w-full" size="lg">
              Update Profile
            </Button>
          ) : (
            <div className="w-full text-center py-2 text-xs font-semibold text-primary/50 bg-primary/5 rounded-lg border border-primary/10">
              Only the account owner can update profile information
            </div>
          )}
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default Profile;
