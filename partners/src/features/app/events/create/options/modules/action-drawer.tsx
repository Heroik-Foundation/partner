import { Button } from "@/modules/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/modules/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { useMediaQuery } from "@/hooks/media-query";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  trigger: ReactNode;
  title: string;
  callback: {
    primary: () => void;
    secondary: () => void;
  };
};

export const CreateEventActionDrawer = ({
  open,
  setOpen,
  trigger,
  callback,
  title,
}: Props) => {
  const { primary, secondary } = callback;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Shared footer buttons
  const ActionButtons = () => (
    <div className="flex items-center flex-row w-full gap-3">
      <Button
        className="rounded-full flex-1"
        size={"lg"}
        type="button"
        onClick={() => {
          primary();
          setOpen(false);
        }}
      >
        Yes
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        type="button"
        className="border-accent text-accent rounded-full flex-1"
        onClick={() => {
          secondary();
          setOpen(false);
        }}
      >
        No
      </Button>
    </div>
  );

  // Shared header
  const Header = () => (
    <DrawerHeader className="text-center">
      <DrawerTitle className="font-extrabold text-primary text-base text-center tracking-normal">
        {title}
      </DrawerTitle>
    </DrawerHeader>
  );

  // Mobile: Drawer
  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <Header />
          <DrawerFooter className="pb-6">
            <ActionButtons />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-primary text-base text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-3">
          <ActionButtons />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
