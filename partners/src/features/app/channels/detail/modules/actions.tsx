import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus, X, Mic, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function Actions({ id }: { id: string }) {
  const [extended, setExtended] = useState<boolean>(false);

  const actions = [
    {
      path: "/app/channels/$id/post/create?broadcast=false",
      title: "Add New Post",
      icon: MessageSquareText,
      id: 1,
    },
    {
      path: "/app/channels/$id/post/create?broadcast=true",
      title: "Add New Broadcast",
      icon: Mic,
      id: 2,
    },
  ];

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
                      })
                    )}
                    params={{
                      id: id,
                    }}
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
          extended ? "rotate-180 bg-rose-600" : "bg-accent"
        )}
        onClick={() => setExtended(!extended)}
        size="sm"
      >
        {extended ? <X /> : <Plus />}
      </Button>
    </div>
  );
}
