import { FormContent, FormFooter } from "@/features/auth/global/form";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import illustration from "./assets/astronaut.svg";

const RecoverySuccess = () => {
  return (
    <div className="space-y-5 flex flex-col items-start relative min-h-screen p-5">
      <FormContent className="flex flex-col items-center justify-center space-y-14 pt-5 xs:pt-0">
        <div className="space-y-2.5 flex flex-col items-center w-full xs:w-[60%]">
          <img
            src={illustration}
            className="rounded-xl max-h-[350px]"
            alt="Event partner illustration"
          />
          <p className="text-sm font-bold font-axiforma text-center text-primary">
            A link to reset your password has been sent to your email. Please
            check your inbox and follow the instructions to complete the
            process.
          </p>
        </div>
      </FormContent>

      <FormFooter className="flex flex-col items-center space-y-3.5" absolute>
        <Link
          className={cn(
            buttonVariants({
              size: "lg",
              className: "w-full",
            })
          )}
          to="/auth/signup"
        >
          Create New Account
        </Link>
        <Link
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })
          )}
          to="/auth/login"
        >
          Already have an account? Log In
        </Link>
      </FormFooter>
    </div>
  );
};

export default RecoverySuccess;
