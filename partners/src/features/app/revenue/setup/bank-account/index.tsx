import {
  Form,
  FormContent,
  FormFooter,
  FormField,
} from "@/features/auth/global/form";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { useRouter } from "@tanstack/react-router";

const SetupBankAccount = () => {
  const { navigate } = useRouter();
  return (
    <div>
      <Form
        title="Update Bank Details"
        description="update your bank details"
        previousRoute={true}
      >
        <FormContent>
          <FormField>
            <Label>Bank Name</Label>
            <Input />
          </FormField>
          <FormField>
            <Label>Account Name</Label>
            <Input />
          </FormField>
          <FormField>
            <Label>Account Number</Label>
            <Input />
          </FormField>
          <FormField>
            <Label>Sort Code</Label>
            <Input />
          </FormField>
          <FormField>
            <Label>Other Notes</Label>
            <Input />
          </FormField>
        </FormContent>

        <FormFooter absolute>
          <Button
            onClick={() => {
              navigate({
                to: "/app/revenue/setup-pin",
              });
            }}
            size="lg"
            className="w-full"
          >
            Save Bank Account
          </Button>
        </FormFooter>
      </Form>
    </div>
  );
};

export default SetupBankAccount;
