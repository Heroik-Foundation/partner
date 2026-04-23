// components/action-drawer.tsx
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

type DrawerState = "initial" | "step" | "pending" | "success" | "error";

type DrawerProps = {
  trigger?: ReactNode;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  callback: {
    title: string;
    fn: () => void;
  };
  initialContent?: ReactNode;
  /** Optional extra confirmation steps rendered after initial, before pending */
  extraSteps?: ReactNode[];
  title: {
    initial: string;
    pending: string;
    success: string;
    error: string;
  };
  description: string | ReactNode;
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
    initialContent,
    extraSteps = [],
  } = props;

  const [open, setOpen] = useState(false);
  const [currentState, setCurrentState] = useState<DrawerState>("initial");
  // Which extra step we're on (0-indexed)
  const [stepIndex, setStepIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const hasSteps = extraSteps.length > 0;

  const resetState = useCallback(() => {
    setCurrentState("initial");
    setStepIndex(0);
  }, []);

  const updateStateFromProps = useCallback(() => {
    if (externalPending) setCurrentState("pending");
    else if (externalSuccess) setCurrentState("success");
    else if (externalError) setCurrentState("error");
    // Don't reset to "initial" here — let the drawer manage step/initial itself
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
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  // "Next" from initial — either advance to first extra step or fire callback
  const handleInitialNext = () => {
    if (hasSteps) {
      setStepIndex(0);
      setCurrentState("step");
    } else {
      callback.fn();
    }
  };

  // "Next" from an extra step
  const handleStepNext = () => {
    const isLastStep = stepIndex === extraSteps.length - 1;
    if (isLastStep) {
      callback.fn();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  // "Back" from an extra step
  const handleStepBack = () => {
    if (stepIndex === 0) {
      setCurrentState("initial");
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  const isNonInteractive =
    currentState === "pending" ||
    currentState === "success" ||
    currentState === "error";

  const getCurrentTitle = () => {
    if (currentState === "step") return ""; // no title on extra steps
    return title[currentState as Exclude<DrawerState, "step">];
  };

  // Animations
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

  const ContentBody = () => (
    <>
      {/* Status icons for pending/success/error */}
      <div
        className={cn(
          "flex items-center justify-center",
          isNonInteractive && "pb-10",
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

      <AnimatePresence mode="wait">
        {/* ── Initial page ── */}
        {currentState === "initial" && (
          <motion.div
            key="initial"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {initialContent}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                className="rounded-full w-fit"
                onClick={handleInitialNext}
              >
                {hasSteps ? "Proceed" : callback.title}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" className="bg-none text-rose-500">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </motion.div>
        )}

        {/* ── Extra steps ── */}
        {currentState === "step" && (
          <motion.div
            // key changes on stepIndex so AnimatePresence remounts between steps
            key={`step-${stepIndex}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* User-supplied step content — no title/description wrapper */}
            <div className="py-2">{extraSteps[stepIndex]}</div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button className="rounded-full w-fit" onClick={handleStepNext}>
                {stepIndex === extraSteps.length - 1 ? callback.title : "Next"}
              </Button>
              <Button
                variant="ghost"
                className="bg-none text-rose-500"
                onClick={handleStepBack}
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // ── Mobile: Drawer ──────────────────────────────────────────────────────────
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentState === "step" ? "step-header" : currentState}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {/* Title hidden on extra steps */}
                  {currentState !== "step" && (
                    <DrawerTitle className="text-primary text-lg font-extrabold text-center">
                      {getCurrentTitle()}
                    </DrawerTitle>
                  )}
                  {currentState === "initial" && (
                    <DrawerDescription className="text-primary/50 text-sm font-semibold text-center">
                      {description}
                    </DrawerDescription>
                  )}
                </motion.div>
              </AnimatePresence>
            </DrawerHeader>
            <ContentBody />
          </motion.div>
        </DrawerContent>
      </Drawer>
    );
  }

  // ── Desktop: Dialog ─────────────────────────────────────────────────────────
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentState === "step" ? "step-header" : currentState}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Title hidden on extra steps */}
                {currentState !== "step" && (
                  <DialogTitle className="text-primary text-lg font-extrabold text-center">
                    {getCurrentTitle()}
                  </DialogTitle>
                )}
                {currentState === "initial" && (
                  <DialogDescription className="text-primary/50 text-sm font-semibold text-center">
                    {description}
                  </DialogDescription>
                )}
              </motion.div>
            </AnimatePresence>
          </DialogHeader>
          <ContentBody />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// ── ActionDialog (unchanged) ───────────────────────────────────────────────────

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
            onClick={() => fn()}
          >
            {isPending ? <Loader /> : String(callback.title || "Accept")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
