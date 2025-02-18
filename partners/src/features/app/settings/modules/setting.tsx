"use client";

import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Icons } from "./icons";
import { UrlObject } from "url";
import { Switch } from "@/modules/ui/switch";

export interface SettingProps {
  title: string;
  description?: string;
  icon: keyof typeof Icons;
  toggles?: {
    label: string;
    value: boolean;
    setValue: (value: boolean) => void;
  }[];
  link?: UrlObject | any;
}

export function Setting({ ...props }: SettingProps) {
  const { title, description, link, icon, toggles } = props;
  const SettingIcon = Icons[icon];

  return (
    <div className="w-full p-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-start space-x-2">
          <SettingIcon className="mt-1" />

          <div className="text-primary">
            <span className="text-sm font-bold">{title}</span>
            {description && (
              <p className="text-primary/50 text-sm font-semibold">
                {description}
              </p>
            )}
          </div>
        </div>

        {link && (
          <Link href={link}>
            <ChevronRight className="stroke-none fill-primary" />
          </Link>
        )}
      </div>

      {toggles && (
        <ul className="w-full pl-6 pt-2 space-y-2.5">
          {toggles.map((toggle, index) => {
            return (
              <li
                className="flex justify-between items-center space-x-1.5 w-full"
                key={index}
              >
                <p className="text-sm font-semibold text-primary/50">
                  {toggle.label}
                </p>
                <Switch />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
