"use client";

import Link from "next/link";
import { GithubIcon } from "./icons/github-icon";
import { useSidebar } from "./ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";

export const AuthorTag = () => {
  const { open } = useSidebar();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.225 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="flex flex-col items-center pb-12 overflow-hidden"
        >
          <Link
            title="Open source"
            className="mb-2"
            href="https://github.com/matheusbronca/magic-tube"
            rel="external"
          >
            <GithubIcon className="size-4 fill-muted-foreground" />
          </Link>
          <div className="text-muted-foreground text-[8.5px] whitespace-nowrap">
            Non-commercial purposes
          </div>
          <Link
            className="text-[12px] text-muted-foreground text-semibold whitespace-nowrap"
            href="https://matheusbronca.com"
            title="Personal website"
            rel="external"
          >
            @Matheus Bronca
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
