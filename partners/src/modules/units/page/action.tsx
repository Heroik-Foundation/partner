import { useState, useEffect, useCallback } from "react";
import { Button, Loader } from "@/modules/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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

import { ReactNode } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/media-query";

type DrawerState = "initial" | "pending" | "success" | "error";

type DrawerProps = {
  trigger?: ReactNode;
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
  trigger?: ReactNode;
  title: string;
  description: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  callback: {
    fn: () => void;
    title?: string;
    isPending?: boolean;
    isSuccess?: boolean;
  };
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

  const [open, setOpen] = useState(false);
  const [currentState, setCurrentState] = useState<DrawerState>("initial");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Reset state
  const resetState = useCallback(() => setCurrentState("initial"), []);

  // Sync with external props
  const updateStateFromProps = useCallback(() => {
    if (externalPending) setCurrentState("pending");
    else if (externalSuccess) setCurrentState("success");
    else if (externalError) setCurrentState("error");
    else setCurrentState("initial");
  }, [externalPending, externalSuccess, externalError]);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(resetState, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, resetState]);

  useEffect(() => {
    updateStateFromProps();
  }, [updateStateFromProps]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  const getCurrentTitle = () => title[currentState];

  // Shared animations
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

  // Shared content (body + footer) to avoid duplication
  const ContentBody = () => (
    <>
      <div
        className={cn(
          "flex items-center justify-center",
          currentState !== "initial" && "pb-10",
        )}
      >
        <AnimatePresence mode="wait">
          {currentState === "error" && (
            <motion.div
              key="error"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <XCircle className="stroke-white fill-rose-500" size={60} />
            </motion.div>
          )}
          {currentState === "success" && (
            <motion.div
              key="success"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button className="rounded-full w-fit" onClick={callback.fn}>
                {callback.title}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" className="bg-none text-rose-500">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Mobile: Drawer
  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent>
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            <DrawerHeader>
              <DrawerTitle className="text-primary text-lg font-extrabold text-center">
                {getCurrentTitle()}
              </DrawerTitle>
              <AnimatePresence>
                {currentState === "initial" && (
                  <motion.div
                    key="description"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DrawerDescription className="text-primary/50 text-sm font-semibold text-center">
                      {description}
                    </DrawerDescription>
                  </motion.div>
                )}
              </AnimatePresence>
            </DrawerHeader>
            <ContentBody />
          </motion.div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          <DialogHeader>
            <DialogTitle className="text-primary text-lg font-extrabold text-center">
              {getCurrentTitle()}
            </DialogTitle>
            <AnimatePresence>
              {currentState === "initial" && (
                <motion.div
                  key="description"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DialogDescription className="text-primary/50 text-sm font-semibold text-center">
                    {description}
                  </DialogDescription>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogHeader>
          <ContentBody />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export const ActionDialog = (props: DialogProps) => {
  const [open, setOpen] = useState(false);
  const { trigger, title, description, callback, isOpen, setIsOpen } = props;
  const { fn, isPending, isSuccess } = callback;

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpen || open} onOpenChange={setIsOpen || setOpen}>
      {trigger && (
        <DialogTrigger className="w-full" asChild>
          {trigger}
        </DialogTrigger>
      )}
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
            <button className="w-full text-rose-500 py-4">Cancel</button>
          </DialogClose>
          <button
            className="w-full text-emerald-500 py-4 border-l flex items-center justify-center"
            onClick={() => {
              fn();
            }}
          >
            {isPending ? <Loader /> : String(callback.title || "Accept")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
