"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Ticket,
  Hash,
  CalendarPlus2,
  X,
  MapPin,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { useMediaQuery } from "@/hooks/media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/modules/ui/drawer";
import { useEventFormStore } from "@/features/app/global/hooks/logic";

export function Actions() {
  const [extended, setExtended] = useState<boolean>(false);
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { updateForm } = useEventFormStore();
  const navigate = useNavigate();

  const actions = [
    {
      path: "/app/tickets/scan",
      title: "Scan Ticket",
      icon: Ticket,
      id: 1,
    },
    {
      path: "/app/events/create",
      title: "Create Event",
      icon: CalendarPlus2,
      id: 2,
      isDialogTrigger: true,
    },
    {
      path: "/app/channels/create",
      title: "Create Channel",
      icon: Hash,
      id: 3,
    },
  ];

  const eventTypeOptions = [
    {
      title: "Create In-Person Event",
      icon: MapPin,
      path: "/app/events/create",
      isOnlineEvent: false,
      id: 1,
    },
    {
      title: "Create Online Event",
      icon: Globe,
      path: "/app/events/create",
      isOnlineEvent: true,
      id: 2,
    },
    // {
    //   title: "Create Hybrid Event",
    //   icon: Blend,
    //   path: "/app/events/create",
    //   isOnlineEvent: true,
    //   id: 3,
    // },
  ];

  const handleEventTypeSelect = (path: string, isOnlineEvent: boolean) => {
    setCreateEventDialogOpen(false);
    updateForm("isOnlineEvent", isOnlineEvent);
    navigate({
      to: path,
    });
  };

  const EventTypeOptionsList = () => (
    <div className="flex flex-col gap-3 w-full py-4">
      {eventTypeOptions.map((option) => (
        <Button
          key={option.id}
          variant="accent"
          className="w-full h-12 justify-center gap-3 px-4 rounded-full "
          onClick={() =>
            handleEventTypeSelect(option.path, option.isOnlineEvent)
          }
        >
          <option.icon className="w-5 h-5" />
          <span className="font-semibold">{option.title}</span>
        </Button>
      ))}
    </div>
  );

  // Mobile: Drawer
  const CreateEventDrawer = () => (
    <Drawer
      open={createEventDialogOpen}
      onOpenChange={setCreateEventDialogOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant="accent"
          className="rounded-full px-5 h-12 shadow bg-accent-900 w-full"
        >
          <CalendarPlus2 /> <span>Create Event</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-primary font-extrabold">
            Choose Event Type
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <EventTypeOptionsList />
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Desktop: Dialog
  const CreateEventDialog = () => (
    <Dialog
      open={createEventDialogOpen}
      onOpenChange={setCreateEventDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="accent"
          className="rounded-full px-5 h-12 shadow bg-accent-900 w-full"
        >
          <CalendarPlus2 /> <span>Create Event</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-primary font-extrabold">
            Choose Event Type
          </DialogTitle>
        </DialogHeader>
        <EventTypeOptionsList />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="fixed right-5 bottom-20 flex flex-col items-end space-y-5 z-10">
      <AnimatePresence>
        {extended && (
          <motion.div
            className="flex flex-col items-end justify-center space-y-2.5 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {actions.map((action) => {
              // Special handling for Create Event button (opens dialog instead of direct link)
              if (action.isDialogTrigger) {
                return (
                  <motion.div
                    initial={{
                      y: 20 * action.id,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: 20 * action.id,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                    }}
                    key={action.id}
                    className="w-full"
                  >
                    {isDesktop ? <CreateEventDialog /> : <CreateEventDrawer />}
                  </motion.div>
                );
              }

              // Regular action buttons (direct links)
              return (
                <motion.div
                  initial={{
                    y: 20 * action.id,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: 20 * action.id,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                  }}
                  key={action.id}
                >
                  <Link
                    to={action.path}
                    className={cn(
                      buttonVariants({
                        variant: "accent",
                        className:
                          "rounded-full px-5 h-12 shadow bg-accent-900",
                      }),
                    )}
                  >
                    <action.icon /> <span>{action.title}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className={cn(
          "rounded-full transition-all shadow-none primary-box-shadow-hidden w-12 h-12 z-10",
          extended ? "rotate-180 bg-rose-600" : "bg-accent",
        )}
        onClick={() => setExtended(!extended)}
        size="sm"
      >
        {extended ? <X /> : <Plus />}
      </Button>
    </div>
  );
}
