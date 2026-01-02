import {
  Form,
  FormContent,
  FormFooter,
  FormField,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { useWalletDetailsByCurrencyQuery } from "../../hooks/query";
import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateBankDetailsMutation } from "../hooks/mutation";
import { Header } from "@/features/app/global/header";
import { CurrencySelect } from "@/modules/units/form/currency";

type Form = {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  sortCode: string;
  pin: string;
};

const SetupBankAccount = () => {
  const { data: wallet } = useWalletDetailsByCurrencyQuery();
  const [form, setForm] = useState<Form>({
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    sortCode: "",
    pin: "",
  });
  const { mutate, isPending } = useUpdateBankDetailsMutation(form);

  const pageTitle = wallet?.owner?.bankName
    ? "Update Bank Details"
    : "Setup Bank Account";

  const handleBankDetails = useCallback(() => {
    const bankName = wallet?.owner?.bankName || "";
    const bankAccountName = wallet?.owner?.bankAccountName || "";
    const bankAccountNumber = wallet?.owner?.bankAccountNumber || "";
    const sortCode = wallet?.owner.sortCode || "";
    const pin = "";

    const defaultBankDetails = {
      bankName,
      bankAccountName,
      bankAccountNumber,
      sortCode,
      pin,
    };

    setForm(defaultBankDetails);
  }, [wallet]);

  useEffect(() => {
    handleBankDetails();
  }, []);

  const handleSubmit = () => {
    const { bankAccountName, bankAccountNumber, bankName, sortCode, pin } =
      form;
    if (
      bankAccountName === "" ||
      bankAccountNumber === "" ||
      bankName === "" ||
      sortCode === "" ||
      pin === ""
    ) {
      toast.info("Please complete the form to continue");
    } else {
      mutate();
    }
  };

  return (
    <Fragment>
      <Header
        header={{
          title: pageTitle,
          position: "stacked",
          subtitle: "Update your bank details",
        }}
        addOns={{
          content: <CurrencySelect />,
        }}
      />
      <Form
        className="min-h-fit"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <FormContent>
          <FormField>
            <Label>Bank Name</Label>
            <Input
              required
              value={form.bankName}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  bankName: target.value,
                }));
              }}
            />
          </FormField>
          <FormField>
            <Label>Account Name</Label>
            <Input
              required
              value={form.bankAccountName}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  bankAccountName: target.value,
                }));
              }}
            />
          </FormField>
          <FormField>
            <Label>Account Number</Label>
            <Input
              required
              type="number"
              value={form.bankAccountNumber}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  bankAccountNumber: target.value,
                }));
              }}
            />
          </FormField>
          <FormField>
            <Label>Sort Code</Label>
            <Input
              required
              value={form.sortCode}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  sortCode: target.value,
                }));
              }}
            />
          </FormField>
          <FormField>
            <Label>Pin</Label>
            <Input
              required
              type="number"
              value={form.pin}
              onChange={({ target }) => {
                setForm((prev) => ({
                  ...prev,
                  pin: target.value,
                }));
              }}
            />
          </FormField>
        </FormContent>

        <FormFooter className="pt-5">
          <Button isPending={isPending} size="lg" className="w-full">
            Save Bank Account
          </Button>
        </FormFooter>
      </Form>
    </Fragment>
  );
};

export default SetupBankAccount;
