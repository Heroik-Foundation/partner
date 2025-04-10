import { useState, useEffect, useCallback } from "react";
import { Button } from "@/modules/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/modules/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/modules/ui/dialog";

import { ReactNode } from "@tanstack/react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type DrawerState = "initial" | "pending" | "success" | "error";

type DrawerProps = {
  trigger: ReactNode;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  callback: {
    title: string;
    fn: () => void;
  };
  title: {
    initial: string;
    pending: string;
    success: string;
    error: string;
  };
  description: string;
  onOpenChange?: (open: boolean) => void;
};

type DialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  callback: () => void;
};

export const ActionDrawer = (props: DrawerProps) => {
  const {
    title,
    description,
    isPending: externalPending,
    isSuccess: externalSuccess,
    isError: externalError,
    trigger,
    callback,
    onOpenChange,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentState, setCurrentState] = useState<DrawerState>("initial");

  // Reset state function using useCallback
  const resetDrawerState = useCallback(() => {
    setCurrentState("initial");
  }, []);

  // Update state based on external props using useCallback
  const updateStateFromProps = useCallback(() => {
    if (externalPending) setCurrentState("pending");
    else if (externalSuccess) setCurrentState("success");
    else if (externalError) setCurrentState("error");
    else setCurrentState("initial");
  }, [externalPending, externalSuccess, externalError]);

  useEffect(() => {
    if (!drawerOpen) {
      // Delayed reset to allow closing animation to complete
      const timeout = setTimeout(() => {
        resetDrawerState();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [drawerOpen, resetDrawerState]);

  // Update state based on external props
  useEffect(() => {
    updateStateFromProps();
  }, [updateStateFromProps]);

  // Handle drawer open state changes
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setDrawerOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  // Get title based on current state
  const getCurrentTitle = useCallback(
    () => title[currentState],
    [title, currentState]
  );

  // Animation variants
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, type: "spring" },
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <motion.div
          initial="initial"
          animate="animate"
          variants={contentVariants}
        >
          <DrawerHeader>
            <DrawerTitle className="text-primary text-lg font-extrabold">
              {getCurrentTitle()}
            </DrawerTitle>
            <AnimatePresence>
              {currentState === "initial" && (
                <motion.div
                  key="description"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={contentVariants}
                >
                  <DrawerDescription className="text-primary/50 text-sm font-semibold">
                    {description}
                  </DrawerDescription>
                </motion.div>
              )}
            </AnimatePresence>
          </DrawerHeader>

          <div
            className={cn(
              "flex items-center justify-center",
              currentState !== "initial" && "pb-10"
            )}
          >
            <AnimatePresence mode="wait">
              {currentState === "error" && (
                <motion.div
                  key="error"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                >
                  <XCircle className="stroke-white fill-rose-500" size={60} />
                </motion.div>
              )}

              {currentState === "success" && (
                <motion.div
                  key="success"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                >
                  <CheckCircle
                    className="stroke-white fill-emerald-500"
                    size={60}
                  />
                </motion.div>
              )}

              {currentState === "pending" && (
                <motion.div
                  key="pending"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                >
                  <img
                    src="/loader/loading.gif"
                    className="w-10 h-10"
                    alt="Loading"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {currentState === "initial" && (
              <motion.div
                key="footer"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={contentVariants}
              >
                <DrawerFooter className="flex items-center justify-center">
                  <Button className="rounded-full w-fit" onClick={callback.fn}>
                    {callback.title}
                  </Button>
                  <DrawerClose>
                    <Button variant="ghost" className="bg-none text-rose-500">
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

export const ActionDialog = (props: DialogProps) => {
  const { trigger, title, description } = props;
  return (
    <Dialog>
      <DialogTrigger className="w-full">{trigger}</DialogTrigger>
      <DialogContent className="px-0 pb-0">
        <DialogHeader className="px-5">
          <DialogTitle className="font-extrabold text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm font-semibold text-primary/50">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex border-t">
          <DialogClose asChild>
            <button className="w-full text-rose-500 py-5">Cancel</button>
          </DialogClose>
          <button className="w-full text-emerald-500 py-5 border-l">
            Accept
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
