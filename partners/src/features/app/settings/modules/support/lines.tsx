"use client";

import { SupportIcon, PhoneSupport, EmailSupport, LiveChat } from "../icons";

const lines = [
  {
    title: "Phone Support",
    icon: PhoneSupport,
    link: "",
  },
  {
    title: "Email Support",
    icon: EmailSupport,
    link: "",
  },
  {
    title: "Live Chat",
    icon: LiveChat,
    link: "",
  },
];

export function SupportLines() {
  return (
    <div className="w-full space-y-1.5 p-4">
      <div className="flex items-center space-x-1.5">
        <SupportIcon width={24} height={24} />
        <span className="text-sm font-bold text-primary">Contact Us On:</span>
      </div>
      <ul className="px-5 space-y-5 pt-2.5">
        {lines.map((line, index) => (
          <li key={index} className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">{line.title}</p>

            <line.icon />
          </li>
        ))}
      </ul>
    </div>
  );
}
