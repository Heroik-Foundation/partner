import { FormContent, FormFooter } from "../global/form";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { OnboardingCarousel } from "./carousel";

const Onboarding = () => {
  return (
    <div className="flex flex-col items-start relative h-screen space-y-5 p-4">
      <FormContent className="flex flex-col items-center justify-center xs:pt-0">
        <img src="/logo/text.svg" alt="" width={100} height={100} />
        <OnboardingCarousel />
      </FormContent>

      <FormFooter className="flex flex-col items-center space-y-2.5 pb-10">
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
