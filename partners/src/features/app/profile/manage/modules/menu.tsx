import { cn } from "@/lib/utils";
import { Drawer, DrawerContent } from "@/modules/ui/drawer";
import { LogIn, UserRoundPlus } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  primaryCTAFn: () => void;
  secondaryCTAFn: () => void;
};

export const ManageProfileMenu = ({
  open,
  setOpen,
  primaryCTAFn,
  secondaryCTAFn,
}: Props) => {
  const options = [
    {
      title: "Create New Account",
      icon: LogIn,
      fn: primaryCTAFn,
    },
    {
      title: "Add Acount",
      icon: UserRoundPlus,
      fn: secondaryCTAFn,
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="pb-5">
        <div className="pt-5">
          {options.map((option, index, list) => {
            return (
              <button
                key={index}
                className={cn(
                  "flex text-primary py-3.5 space-x-1.5 px-2 w-full",
                  list.length - 1 !== index && "border-b"
                )}
                onClick={() => {
                  option.fn();
                }}
              >
                <option.icon className="stroke-background" size={16} />
                <span className="text-sm font-bold">{option.title}</span>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
