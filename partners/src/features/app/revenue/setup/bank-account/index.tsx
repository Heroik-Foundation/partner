import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Form,
  FormContent,
  FormFooter,
  FormField,
} from "@/features/auth/global/form";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Header } from "@/features/app/global/header";
import { CurrencySelect } from "@/modules/units/form/currency";

import { useWalletDetailsQuery } from "../../hooks/query";
import { useUpdateBankDetailsMutation } from "../hooks/mutation";
import { useCurrencyStore } from "@/stores/currency";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Currency = "gbp" | "usd" | "eur" | "cad" | "aud" | "nzd";

interface BankDetailsForm {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  pin: string;
  sortCode?: string;
  routingNumber?: string;
  iban?: string;
  transitNumber?: string;
  institutionNumber?: string;
  bsbNumber?: string;
}

type UpdateBankDetailsVariables = BankDetailsForm & { currency: Currency };

const EMPTY_FORM: BankDetailsForm = {
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  pin: "",
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const SetupBankAccount = () => {
  const { data: wallet } = useWalletDetailsQuery();
  const { selectedCurrency } = useCurrencyStore();

  const [form, setForm] = useState<BankDetailsForm>(EMPTY_FORM);

  const owner = wallet?.owner;

  const isBeingUpdated =
    !!owner &&
    isNonEmptyString(owner.bankName) &&
    isNonEmptyString(owner.bankAccountName) &&
    isNonEmptyString(owner.bankAccountNumber);

  const { mutate, isPending } = useUpdateBankDetailsMutation();

  useEffect(() => {
    if (!owner) return;

    const currencyFields: Partial<BankDetailsForm> = {};

    switch (selectedCurrency.value) {
      case "gbp":
        currencyFields.sortCode = (owner as any).sortCode ?? "";
        break;
      case "usd":
        currencyFields.routingNumber = (owner as any).routingNumber ?? "";
        break;
      case "eur":
        currencyFields.iban = (owner as any).iban ?? "";
        break;
      case "cad":
        currencyFields.transitNumber = (owner as any).transitNumber ?? "";
        currencyFields.institutionNumber =
          (owner as any).institutionNumber ?? "";
        break;
      case "aud":
        currencyFields.bsbNumber = (owner as any).bsbNumber ?? "";
        break;
    }

    setForm({
      bankName: owner.bankName ?? "",
      bankAccountName: owner.bankAccountName ?? "",
      bankAccountNumber: owner.bankAccountNumber ?? "",
      pin: "",
      ...currencyFields,
    });
  }, [owner, selectedCurrency]);

  const handleSubmit = () => {
    const requiredFields: (keyof BankDetailsForm)[] = [
      "bankName",
      "bankAccountName",
      "bankAccountNumber",
    ];

    if (isBeingUpdated) requiredFields.push("pin");

    const hasEmptyFields = requiredFields.some((field) => !form[field]?.trim());

    if (hasEmptyFields) {
      toast.info("Please complete all required fields");
      return;
    }

    const currencyPayload: Partial<BankDetailsForm> = {};

    switch (selectedCurrency.value) {
      case "gbp":
        currencyPayload.sortCode = form.sortCode;
        break;
      case "usd":
        currencyPayload.routingNumber = form.routingNumber;
        break;
      case "eur":
        currencyPayload.iban = form.iban;
        break;
      case "cad":
        currencyPayload.transitNumber = form.transitNumber;
        currencyPayload.institutionNumber = form.institutionNumber;
        break;
      case "aud":
        currencyPayload.bsbNumber = form.bsbNumber;
        break;
    }

    const payload: UpdateBankDetailsVariables = {
      bankName: form.bankName,
      bankAccountName: form.bankAccountName,
      bankAccountNumber: form.bankAccountNumber,
      pin: form.pin,
      currency: selectedCurrency.value,
      ...currencyPayload,
    };

    mutate(payload);
  };

  const renderCurrencySpecificFields = () => {
    switch (selectedCurrency.value) {
      case "gbp":
        return (
          <FormField>
            <Label>Sort Code</Label>
            <Input
              required
              value={form.sortCode ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, sortCode: e.target.value }))
              }
            />
          </FormField>
        );

      case "usd":
        return (
          <FormField>
            <Label>Routing Number (ABA)</Label>
            <Input
              required
              value={form.routingNumber ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, routingNumber: e.target.value }))
              }
            />
          </FormField>
        );

      case "eur":
        return (
          <FormField>
            <Label>IBAN</Label>
            <Input
              required
              value={form.iban ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, iban: e.target.value.toUpperCase() }))
              }
              placeholder="DE89370400440532013000"
            />
          </FormField>
        );

      case "cad":
        return (
          <>
            <FormField>
              <Label>Transit Number</Label>
              <Input
                required
                value={form.transitNumber ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, transitNumber: e.target.value }))
                }
              />
            </FormField>
            <FormField>
              <Label>Institution Number</Label>
              <Input
                required
                value={form.institutionNumber ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    institutionNumber: e.target.value,
                  }))
                }
              />
            </FormField>
          </>
        );

      case "aud":
        return (
          <FormField>
            <Label>BSB Number</Label>
            <Input
              required
              value={form.bsbNumber ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, bsbNumber: e.target.value }))
              }
              placeholder="062-000"
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <Fragment>
      <Header
        header={{
          title: isBeingUpdated ? "Update Bank Details" : "Setup Bank Account",
          position: "stacked",
          subtitle: `Bank details for ${selectedCurrency.value.toUpperCase()}`,
        }}
        addOns={{ content: <CurrencySelect /> }}
      />

      <Form
        className="min-h-fit"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormContent>
          <FormField>
            <Label>Bank Name</Label>
            <Input
              required
              value={form.bankName}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankName: e.target.value }))
              }
            />
          </FormField>

          <FormField>
            <Label>Account Name</Label>
            <Input
              required
              value={form.bankAccountName}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankAccountName: e.target.value }))
              }
            />
          </FormField>

          <FormField>
            <Label>Account Number</Label>
            <Input
              required
              type="tel"
              value={form.bankAccountNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankAccountNumber: e.target.value }))
              }
            />
          </FormField>

          {renderCurrencySpecificFields()}

          {isBeingUpdated && (
            <FormField>
              <Label>Pin</Label>
              <Input
                required
                type="password"
                value={form.pin}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pin: e.target.value }))
                }
              />
            </FormField>
          )}
        </FormContent>

        <FormFooter className="pt-5 space-y-2.5">
          <Button isPending={isPending} size="lg" className="w-full">
            Save Bank Account
          </Button>

          <Link
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full",
              }),
            )}
            to="/app/revenue/setup-pin"
          >
            <span>Update Security Pin</span>
          </Link>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default SetupBankAccount;
