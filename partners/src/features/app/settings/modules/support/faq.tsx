"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { FAQIcon } from "../icons";

export function SupportFAQs() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";

  const faqs = [
    "How do I sign up ?",
    "How do I split my donations ?",
    "How do I delete my account ?",
  ];

  return (
    <div className="w-full space-y-1.5 p-4">
      <div className="flex items-center space-x-1.5">
        <FAQIcon />
        <span className="text-sm font-bold text-primary">FAQs</span>
      </div>
      <div className="px-5">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>{faq}</AccordionTrigger>
              <AccordionContent>{defaultContent}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
