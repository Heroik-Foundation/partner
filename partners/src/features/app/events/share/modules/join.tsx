import { Button, buttonVariants } from "@/modules/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import playstore from "../assets/share-playstore.svg";
import appstore from "../assets/share-appstore.svg";

import { cn } from "@/lib/utils";

export const Join = () => {
  const [show, setShow] = useState(false);

  const links = [
    {
      image: playstore,
      link: "",
    },
    {
      image: appstore,
      link: "",
    },
  ];

  const containerVariants = {
    collapsed: { height: "auto", minHeight: "72px" },
    expanded: { height: "auto", minHeight: "200px" },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.4 } },
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 mx-auto right-0 max-w-lg bg-white p-5"
      variants={containerVariants}
      initial="collapsed"
      animate={show ? "expanded" : "collapsed"}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {!show ? (
          <motion.div
            key="button"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => {
                setShow(true);
              }}
              className="rounded-full w-full"
              size="lg"
            >
              Join Event
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="space-y-5"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-lg font-extrabold text-center w-full text-primary">
              Get The Full Experience In The App!
            </h1>

            <ul className="space-y-5">
              {links.map((link, index) => {
                return (
                  <motion.li
                    className="flex items-center justify-between"
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.4 + index * 0.1,
                      },
                    }}
                  >
                    <img src={link.image} alt="" />

                    <a
                      href={link.link}
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: "secondary",
                        })
                      )}
                    >
                      Download
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
