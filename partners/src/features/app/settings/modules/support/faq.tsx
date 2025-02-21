"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { FAQIcon } from "../icons";

export function SupportFAQs() {
  const faqs = [
    {
      question: "Who are event partners on Hiroek?",
      answer:
        "Event partners are individuals, organisations, or businesses that collaborate with Hiroek to host, manage, or promote events. Partners can include event organisers, sponsors, venues, and service providers.",
    },
    {
      question: "How can I become an event partner on Hiroek?",
      answer:
        "You can apply to become an event partner by visiting the Event Partners section on the Hiroek website and filling out the application form. Our team will review your application and get in touch.",
    },
    {
      question: "What benefits do event partners get?",
      answer:
        "Event partners receive access to advanced tools for event creation, promotion, and ticket sales, as well as analytics and insights. You also get opportunities for exclusive promotions, enhanced visibility, and priority technical support.",
    },
    {
      question: "Can I co-host events with other partners?",
      answer:
        "No, partners are unable to collaborate, add co-hosts or other partners to their events. This feature will be coming soon.",
    },
    {
      question: "How can Hiroek help me promote my events?",
      answer:
        "Hiroek offers several promotional tools, including:\n- Featured event listings\n- Targeted advertisements\n- Social media integration\n- Email campaigns\nThese tools help increase your event's visibility and attract the right audience.",
    },
    {
      question: "What are the fees for using Hiroek as a partner?",
      answer: "Hiroek is free to use for creating and listing events.",
    },
    {
      question: "How do I set up ticket sales for my event?",
      answer:
        "Hiroek’s ticketing platform allows you to set ticket prices, availability, and types. Payments are securely processed, and you can track sales in real time through your partner dashboard.",
    },
    {
      question: "Can I customise the event page for branding?",
      answer:
        "Yes, you can customise your event page with your logo and images. This helps ensure your event aligns with your branding and creates a professional impression.",
    },
    {
      question: "How do I access attendee information?",
      answer:
        "Once attendees join and purchase tickets, you can view their details (in compliance with privacy policies) on your event dashboard. This includes attendee names, ticket types, and any additional information collected during registration.",
    },
    {
      question: "Does Hiroek provide analytics for my events?",
      answer:
        "Yes, Hiroek provides detailed analytics, including ticket sales, attendee demographics, and engagement metrics. These insights help you make informed decisions for future events.",
    },
    {
      question: "How do payouts work for ticketed events?",
      answer:
        "Payouts are processed through our secure payment system. You can set your preferred payout method (digital wallet) and schedule payouts after the event based on Hiroek’s terms.",
    },
    {
      question: "Can I reschedule my event?",
      answer:
        "Yes, you can reschedule events directly through the event dashboard. Attendees will be notified automatically.",
    },
    {
      question: "Does Hiroek provide support for partners?",
      answer:
        "Yes, partners have access to priority technical support. You can reach our dedicated partner support team via the Support Center in the app.",
    },
    {
      question: "Can I use Hiroek to manage on-site event operations?",
      answer:
        "Yes, Hiroek offers tools for on-site event management, including ticket scanning, attendee check-ins, and live updates.",
    },
    {
      question: "Are there restrictions on the types of events I can list?",
      answer:
        "While most events are welcome, all listings must comply with Hiroek's platform guidelines and terms of service. Prohibited events include those involving illegal activities, discriminatory content, or unsafe practices.",
    },
    {
      question: "How do I update my event after it's published?",
      answer:
        "You can edit your event details, including date, time, venue, and description, through the event dashboard. Updates will be reflected in real-time, and attendees will be notified of major changes.",
    },
    {
      question: "How do I handle disputes or attendee complaints?",
      answer:
        "For disputes or complaints, Hiroek offers a mediation process. You can report issues through your partner dashboard, and our support team will assist in resolving them promptly.",
    },
  ];

  return (
    <div className="w-full space-y-1.5 p-4">
      <div className="flex items-center space-x-1.5">
        <FAQIcon />
        <span className="text-sm font-bold text-primary">FAQs</span>
      </div>
      <div>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem
              className="border-none"
              value={`item-${index + 1}`}
              key={index}
            >
              <AccordionTrigger className="text-sm font-extrabold text-primary text-start">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-medium text-primary">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
