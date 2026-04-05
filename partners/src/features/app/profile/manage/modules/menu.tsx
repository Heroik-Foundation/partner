import { cn } from "@/lib/utils";
import { Drawer, DrawerContent } from "@/modules/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { LogIn, UserRoundPlus } from "lucide-react";
import { useMediaQuery } from "@/hooks/media-query";

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
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const options = [
    {
      title: "Create New Account",
      icon: LogIn,
      fn: primaryCTAFn,
    },
    {
      title: "Add Account",
      icon: UserRoundPlus,
      fn: secondaryCTAFn,
    },
  ];

  // Shared options list
  const OptionsList = () => (
    <div className="py-5">
      {options.map((option, index, list) => {
        return (
          <button
            key={index}
            className={cn(
              "flex text-primary py-3.5 space-x-1.5 px-2 w-full",
              list.length - 1 !== index && "border-b",
            )}
            onClick={() => {
              option.fn();
              setOpen(false);
            }}
          >
            <option.icon className="stroke-background" size={16} />
            <span className="text-sm font-bold">{option.title}</span>
          </button>
        );
      })}
    </div>
  );

  // Mobile: Drawer
  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="pb-5">
          <OptionsList />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 pt-5">
        <DialogHeader>
          <DialogTitle className="text-primary font-extrabold text-center">
            Manage Profile
          </DialogTitle>
        </DialogHeader>
        <OptionsList />
      </DialogContent>
    </Dialog>
  );
};
