import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Props = {
  content: string;
  author: "sender" | "receiver";
  index: number; // Used for staggered animation
};

export const Messages = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-20 space-y-2.5 flex flex-col w-full pb-20">
      {children}
    </div>
  );
};

export const Message = ({ content, author, index }: Props) => {
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        damping: 15,
        stiffness: 400,
      },
    }),
  };

  const bounceTransition = {
    type: "spring",
    damping: 20,
    stiffness: 300,
  };

  return (
    <motion.div
      className="w-full flex"
      initial="hidden"
      animate="visible"
      custom={index}
      variants={variants}
    >
      <motion.pre
        className={cn(
          "bg-primary/10 max-w-[83%] w-fit p-3.5 rounded-t-3xl text-primary text-xs font-semibold leading-6 tracking-wider font-axiforma",
          author === "sender" && "rounded-bl-3xl ml-auto bg-primary text-white",
          author === "receiver" && "rounded-br-3xl mr-auto",
          "whitespace-pre-wrap break-words",
        )}
        whileHover={{ scale: 1.02 }}
        transition={bounceTransition}
      >
        {content}
      </motion.pre>
    </motion.div>
  );
};
