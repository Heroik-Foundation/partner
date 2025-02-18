import { links, LinkorButton } from "./sidebar";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Sidenav() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <button
        className={cn(
          "fixed rounded-full right-5 top-7 p-2 z-50 border bg-white lg:hidden",
          open && "bg-red-100"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <aside
        className={cn(
          "fixed z-20 transition-all w-[300px] h-[100vh] top-0 bottom-0 bg-white border-l px-5 pt-24 space-y-10 lg:hidden",
          open ? "right-0" : "-right-[300px]"
        )}
      >
        <nav className="space-y-8">
          {links.map((link, index) => (
            <LinkorButton {...link} key={index} />
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="h-[100vh] fixed z-10 bg-black/25 w-full inset-0 lg:hidden"
          onClick={() => setOpen(!open)}
        />
      )}
    </Fragment>
  );
}
