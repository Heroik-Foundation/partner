import football from "@features/app/events/create/assets/category/football.svg";
import yoga from "@features/app/events/create/assets/category/yoga.svg";
import skating from "@features/app/events/create/assets/category/skating.svg";
import cycling from "@features/app/events/create/assets/category/cycling.svg";
import entertainment from "@features/app/events/create/assets/category/entertainment.svg";
import swimming from "@features/app/events/create/assets/category/swimming.svg";
import hiking from "@features/app/events/create/assets/category/hiking.svg";
import walking from "@features/app/events/create/assets/category/walking.svg";
import running from "@features/app/events/create/assets/category/running.svg";

export const allCategories: string[] = [
  "Running (Subcategory: 3 Mile, 3.5k, 5k, 10k, 15k, Half marathon, Marathon, Ultra marathon)",
  "Trail Running",
  "Duathlon",
  "Triathlon",
  "Iron man",
  "Obstacles Racing",
  "Adventure Races",
  "Swimming",
  "Roller Skating",
  "Hiking",
  "Walkathon (Subcategory: 3.5k, 5k, 10k)",
  "Yoga",
  "Circuits Workout",
  "Cycling",
  "Football (5 A-Side, 6 A-Side, 7 A-Side, 11 A-Side)",
  "Charity Events",
  "Entertainment (Subcategory: Comedy, Festivals, Coffee Morning, Tea Party, Talent Show, Art Exhibition, Music Concerts)",
];

export type Category = {
  name: string;
  icon: string;
};

export const eventCategories: Category[] = [
  {
    name: "Running",
    icon: running,
  },
  {
    name: "Walkathon",
    icon: walking,
  },
  {
    name: "Football",
    icon: football,
  },
  {
    name: "Entertainment",
    icon: entertainment,
  },
  {
    name: "Swimming",
    icon: swimming,
  },
  {
    name: "Yoga",
    icon: yoga,
  },
  {
    name: "Hiking",
    icon: hiking,
  },
  {
    name: "Roller skating",
    icon: skating,
  },
  {
    name: "Cycling",
    icon: cycling,
  },
];
