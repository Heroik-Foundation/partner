import { Button } from "@/modules/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/modules/ui/drawer";
import { Dispatch, ReactNode, SetStateAction } from "react";

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
  trigger,
  callback,
  title,
}: Props) => {
  const { primary, secondary } = callback;

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-extrabold text-primary text-base text-center tracking-normal">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="flex items-center flex-row w-full sm:max-w-sm sm:min-w-sm mx-auto">
          <Button
            className="rounded-full w-full"
            size={"lg"}
            type="button"
            onClick={() => {
              primary();
            }}
          >
            Yes
          </Button>
          <Button
            size={"lg"}
            variant={"outline"}
            type="button"
            className="border-accent text-accent rounded-full w-full"
            onClick={() => {
              secondary();
            }}
          >
            No
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
