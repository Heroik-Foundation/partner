"use client";

import { EllipsisVertical } from "lucide-react";

export const TicketSales = () => {
  const sales = [
    {
      image_url:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aHVtYW4lMjBmYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
      name: "Chris Doe",
      tickets: 1,
      relative_time: "24 days ago",
      amount: 100,
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="font-bold text-primary">Tickets Sold</h6>
          <p className="text-sm font-medium text-primary/50">
            Event Tickets Sold So Far
          </p>
        </div>

        <EllipsisVertical className="stroke-black/60" />
      </div>

      <div>
        {sales.map((sale, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={sale.image_url}
                alt={`${sale.name}'s Image`}
                loading="eager"
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h5 className="text-primary font-bold text-sm">{sale.name}</h5>
                <p className="text-primary/50 font-bold text-xs">
                  <span>{sale.relative_time}</span> |{" "}
                  <span>Tickets: {sale.tickets}</span>
                </p>
              </div>
            </div>

            <span className="font-extrabold text-primary">
              £{sale.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
