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

// Most common pattern for update bank details mutation variables
type UpdateBankDetailsVariables = {
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
  currency: Currency;
};

const SetupBankAccount = () => {
  const { data: wallet } = useWalletDetailsQuery();
  const { selectedCurrency } = useCurrencyStore();

  const [form, setForm] = useState<BankDetailsForm>({
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    pin: "",
  });

  const { mutate, isPending } = useUpdateBankDetailsMutation();

  useEffect(() => {
    if (!wallet?.owner) return;

    const base = {
      bankName: wallet.owner.bankName || "",
      bankAccountName: wallet.owner.bankAccountName || "",
      bankAccountNumber: wallet.owner.bankAccountNumber || "",
      pin: "",
    };

    const currencyFields: Partial<BankDetailsForm> = {};

    switch (selectedCurrency.value) {
      case "gbp":
        currencyFields.sortCode = (wallet.owner as any).sortCode || "";
        break;
      case "usd":
        currencyFields.routingNumber =
          (wallet.owner as any).routingNumber || "";
        break;
      case "eur":
        currencyFields.iban = (wallet.owner as any).iban || "";
        break;
      case "cad":
        currencyFields.transitNumber =
          (wallet.owner as any).transitNumber || "";
        currencyFields.institutionNumber =
          (wallet.owner as any).institutionNumber || "";
        break;
      case "aud":
        currencyFields.bsbNumber = (wallet.owner as any).bsbNumber || "";
        break;
    }

    setForm({ ...base, ...currencyFields });
  }, [wallet, selectedCurrency]);

  const handleSubmit = () => {
    if (
      !form.bankName.trim() ||
      !form.bankAccountName.trim() ||
      !form.bankAccountNumber.trim() ||
      !form.pin.trim()
    ) {
      toast.info("Please complete all required fields");
      return;
    }

    const payload: UpdateBankDetailsVariables = {
      bankName: form.bankName,
      bankAccountName: form.bankAccountName,
      bankAccountNumber: form.bankAccountNumber,
      pin: form.pin,
      currency: selectedCurrency.value,
      // Only include fields relevant to current currency
      ...(selectedCurrency.value === "gbp" && { sortCode: form.sortCode }),
      ...(selectedCurrency.value === "usd" && {
        routingNumber: form.routingNumber,
      }),
      ...(selectedCurrency.value === "eur" && { iban: form.iban }),
      ...(selectedCurrency.value === "cad" && {
        transitNumber: form.transitNumber,
        institutionNumber: form.institutionNumber,
      }),
      ...(selectedCurrency.value === "aud" && { bsbNumber: form.bsbNumber }),
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
              value={form.sortCode || ""}
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
              value={form.routingNumber || ""}
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
              value={form.iban || ""}
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
                value={form.transitNumber || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, transitNumber: e.target.value }))
                }
              />
            </FormField>
            <FormField>
              <Label>Institution Number</Label>
              <Input
                required
                value={form.institutionNumber || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, institutionNumber: e.target.value }))
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
              value={form.bsbNumber || ""}
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
          title: wallet?.owner?.bankName
            ? "Update Bank Details"
            : "Setup Bank Account",
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

          <FormField>
            <Label>Pin</Label>
            <Input
              required
              type="password"
              value={form.pin}
              onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value }))}
            />
          </FormField>
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
