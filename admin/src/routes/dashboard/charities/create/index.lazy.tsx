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
import { toast } from "sonner";
import { useCreateOrganizationMutation } from "@/hooks/mutation/organization";
import { useInterests } from "@/hooks/fetch/organization";
import { Label } from "@/components/ui/label";
import { findObjectById, removeObjectById } from "@/helpers/array";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/layout/page-title";
import useIntersectionObserver from "@/hooks/logic/observer";

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

  const [interests, setInterests] = useState<string[]>([]);

  const { mutate, isPending } = useCreateOrganizationMutation();

  const { data, hasNextPage, fetchNextPage } = useInterests();

  const interestsList = data?.pages.flat() || [];

  const lastInterestRef = useIntersectionObserver(fetchNextPage, [hasNextPage]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    if (interests.length < 1) {
      toast.error("Please select at least one interest");
      return;
    }

    const interestString = JSON.stringify(interests);

    formData.append("interests[]", interestString);

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
        <div className="flex flex-col space-y-1">
          <Label className="text-base font-cairo">Interests</Label>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {data &&
              interestsList.map((interest: any, index, interestsList) => {
                const foundObject = findObjectById(interests, interest._id);

                return (
                  //@ts-ignore
                  <button
                    key={index}
                    onClick={() => {
                      if (foundObject) {
                        const newArr = removeObjectById(
                          interests,
                          interest._id
                        );
                        setInterests([...newArr]);

                        return;
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                    className={cn(
                      "rounded-full w-full sm:min-w-[300px] flex justify-center items-center py-2 font-medium text-sm relative",
                      foundObject
                        ? "bg-violet-500 text-white"
                        : "bg-violet-500/10 text-violet-500 border border-violet-500"
                    )}
                    {...(interestsList.length - 1 === index && {
                      ref: lastInterestRef,
                    })}
                  >
                    <img
                      src={interest.image}
                      className="w-5 h-5 rounded-full absolute left-2 top-2 bg-white"
                      alt=""
                    />
                    <span> {interest.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
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
