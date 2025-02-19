import { FormContent, FormFooter } from "../global/form";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import illustration from "./assets/intro.png";

const Onboarding = () => {
  return (
    <div className="flex flex-col items-start relative h-screen">
      <FormContent className="flex flex-col items-center justify-center space-y-10 xs:pt-0">
        <img src="/logo/text.svg" alt="" width={100} height={100} />
        <div className="space-y-2.5 flex flex-col items-center w-full xs:w-[60%]">
          <img
            src={illustration}
            className="rounded-xl max-h-[400px]"
            alt="Event partner illustration"
          />
          <p className="text-sm font-bold font-axiforma text-center text-primary">
            Elevate Your Events, Connect with Your Audience.{" "}
            <br className="hidden sm:block" /> Increase Visibility and Ease of
            Discovery.
          </p>
        </div>
      </FormContent>

      <FormFooter className="flex flex-col items-center space-y-2.5" absolute>
        <Link
          className={cn(
            buttonVariants({
              size: "lg",
              className: "w-full",
            })
          )}
          to="/auth/signup"
        >
          Get Started
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

export default Onboarding;
