import { useEditOrganizationMutation } from "@/hooks/mutation/organization";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrganizationDetails } from "@/hooks/fetch/organization";

export const Route = createLazyFileRoute("/dashboard/charities/$id/edit")({
  component: Page,
});

const formSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "An organization's name must be at least 4 characters.",
      })
      .optional(),
    charityRegNumber: z
      .string()
      .min(3, {
        message: "Enter a valid registration number",
      })
      .optional(),
    email: z
      .string()
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Enter a valid email",
      })
      .optional(),
    description: z
      .string()
      .min(1, {
        message: "Description is required",
      })
      .optional(),
    bankAccountName: z
      .string()
      .min(1, {
        message: "Bank Account Name is required",
      })
      .optional(),
    bankAccountNumber: z
      .string()
      .min(1, {
        message: "Bank Account Number is required",
      })
      .optional(),
    bankName: z
      .string()
      .min(1, {
        message: "Bank name is required",
      })
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined && value !== ""),
    {
      message: "At least one field must be completed",
    }
  );

function Page() {
  const { id } = useParams({
    strict: false,
  });

  const { data } = useOrganizationDetails({
    id: String(id),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      charityRegNumber: "",
      email: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
      description: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "John",
        charityRegNumber: data.charityRegNumber || "",
        email: data.email || "",
        bankAccountName: data.bankAccountName || "",
        bankAccountNumber: data.bankAccountNumber || "",
        bankName: data.bankName || "",
        description: data.description || "",
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useEditOrganizationMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(String(key), String(value));
    }

    mutate({
      id: String(id),
      formData: formData,
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="font-cairo font-bold text-xl">Charities</h1>
      <h1 className="font-cairo font-bold text-xl">{data?.name}</h1>
      <div className="p-5 rounded-xl bg-white border space-y-5">
        <h1 className="font-cairo font-bold text-xl">Edit Profile</h1>
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
                    <Input placeholder={data?.name} {...field} />
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
                    <Input
                      type="number"
                      placeholder={data?.charityRegNumber}
                      {...field}
                    />
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
                    <Input type="text" placeholder={data?.email} {...field} />
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
                    <Input
                      type="text"
                      placeholder={data?.description}
                      {...field}
                    />
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
                    <Input
                      type="text"
                      placeholder={data?.bankName}
                      {...field}
                      readOnly
                    />
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
                    <Input
                      type="text"
                      placeholder={data?.bankAccountName}
                      {...field}
                      readOnly
                    />
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
                    <Input
                      type="number"
                      placeholder={data?.bankAccountNumber}
                      {...field}
                      readOnly
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} isLoading={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
