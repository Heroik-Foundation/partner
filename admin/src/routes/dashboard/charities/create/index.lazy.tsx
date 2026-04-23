import { createLazyFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useCreateOrganizationMutation } from "@/hooks/mutation/organization";

import { PageTitle } from "@/components/layout/page-title";

export const Route = createLazyFileRoute("/dashboard/charities/create/")({
  component: Page,
});

const formSchema = z.object({
  name: z.string().min(4, {
    message: "An organization's name must be at least 4 characters.",
  }),
  charityRegNumber: z.string().min(3, {
    message: "Enter a valid registration number",
  }),
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Enter a valid email",
  }),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .min(1),
  country: z
    .string({
      required_error: "Country is required",
    })
    .min(1),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1),
  bankAccountName: z
    .string({
      required_error: "Bank Account Name is required",
    })
    .min(1),
  bankAccountNumber: z
    .string({
      required_error: "Bank Account Number is required",
    })
    .min(1),
  longitude: z
    .string({
      required_error: "Bank Account Number is required",
    })
    .min(1),
  latitude: z
    .string({
      required_error: "Bank Account Number is required",
    })
    .min(1),
  bankName: z
    .string({
      required_error: "Bank namd is required",
    })
    .min(1),
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      charityRegNumber: "",
      email: "",
      postalCode: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
      city: "",
      country: "",
      description: "",
      longitude: "",
      latitude: "",
    },
  });

  const [logo, setLogo] = useState<any>(null);

  const { mutate, isPending } = useCreateOrganizationMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(String(key), String(value));
    }

    formData.append("logo", logo);

    mutate(formData);
  }

  return (
    <div className="space-y-8">
      <PageTitle
        title="Create Organization"
        subTitle="Create an organization/charity"
      />
      <div className="p-5 rounded-xl bg-white border space-y-5">
        <h1 className="font-cairo font-bold text-xl">Add organization</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Organization Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="charityRegNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Charity Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Longitude
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Latitude
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Bank Name
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Bank Account Name
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cairo text-black/80">
                    Bank Account Number
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormItem>
                <FormLabel className="font-cairo text-black/80">Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      //@ts-ignore
                      setLogo(e.target.files[0]);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>

            <Button type="submit" disabled={isPending} isLoading={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
