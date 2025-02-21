"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus, Ticket, Hash, CalendarPlus2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function Actions() {
  const [extended, setExtended] = useState<boolean>(false);

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
    },
    {
      path: "/app/channels/create",
      title: "Create Channel",
      icon: Hash,
      id: 3,
    },
  ];

  return (
    <div className="absolute right-0 bottom-0 flex flex-col items-end space-y-5 z-10">
      <AnimatePresence>
        {extended && (
          <motion.div
            className="flex flex-col items-end justify-center space-y-2.5 backdrop-blur-sm rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {actions.map((action) => {
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
                        className: "rounded-full shadow",
                      })
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
          "rounded-full transition-all shadow-none primary-box-shadow-hidden w-12 h-12 z-10 bg-accent hover:bg-accent",
          extended && "rotate-180"
        )}
        onClick={() => setExtended(!extended)}
        size="sm"
      >
        {extended ? <X /> : <Plus />}
      </Button>
    </div>
  );
}
