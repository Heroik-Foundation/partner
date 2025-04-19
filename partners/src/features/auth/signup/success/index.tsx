import { Button } from "@/modules/ui/button";
import { Form, FormFooter } from "../../global/form";
import { useResendVerificationMutation } from "./hooks/mutation";

const SignUpSuccess = () => {
  const { mutate, isPending } = useResendVerificationMutation();

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        mutate();
      }}
    >
      <div className="pt-20 flex flex-col text-center space-y-1 mx-auto w-full">
        <h1 className="font-axiforma font-extrabold text-primary text-2xl">
          Account Created <br /> Successfully!
        </h1>
        <p className="font-axiforma text-center font-semibold text-sm text-primary">
          Once your account is approved by the administrator, a verification
          link will be sent to your email. Please check your inbox within a
          couple of hours to complete the verification process.
        </p>
      </div>

      <FormFooter className="flex flex-col items-center space-y-3.5" absolute>
        <Button isPending={isPending} className="w-full">
          Resend code
        </Button>
      </FormFooter>
    </Form>
  );
};

export default SignUpSuccess;
