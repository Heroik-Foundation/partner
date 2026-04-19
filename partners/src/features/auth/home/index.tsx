import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightCircle } from "lucide-react";
import bgImg from "@/assets/images/landing-page.jpeg";

const Onboarding = () => {
  return (
    <div className="flex flex-col items-center relative space-y-12 pb-4 pt-0 max-h-screen min-h-screen overflow-y-hidden text-center">
      <img
        src={bgImg}
        className="h-[55vh] w-full bg-cover rounded-b-[30px] object-cover"
      />

      <div className="flex flex-col items-center justify-center text-center xs:pt-0 px-4">
        <img
          src="/logo/logo-purple.svg"
          alt=""
          className="size-11 lg:size-24"
        />
        <div className="space-y-2.5">
          <h1 className="text-primary font-bold text-3xl">Hiroek</h1>

          <p className="text font-semibold text-primary">
            Event Creator Platform <br />
            Built for <span className="text-accent">Creators</span>. Designed
            For <span className="text-accent">Growth</span>.
          </p>
        </div>
      </div>

      <div className="p-5 w-full lg:p-0 lg:max-w-sm">
        <Link
          className={cn(
            buttonVariants({
              size: "lg",
              className: "w-full rounded-full",
            }),
          )}
          to="/auth/login"
        >
          <span>Get Started</span> <ArrowRightCircle />
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;
