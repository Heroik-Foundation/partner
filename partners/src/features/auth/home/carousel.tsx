import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/modules/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import illustration from "./assets/intro.png";

const slides = [
  {
    id: 1,
    image: illustration,
    title: "Elevate Your Events, Connect with Your Audience.",
    description: "Increase Visibility and Ease of Discovery.",
  },
  {
    id: 2,
    image: illustration,
    title: "Enhanced User Experience",
    description:
      "Simplified Registration and Improved Registration Experience.",
  },
  {
    id: 3,
    image: illustration,
    title: "Improved Communication, Real-time Updates",
    description:
      "Send push notifications for important updates, changes, or reminders directly to participants.",
  },
  {
    id: 4,
    image: illustration,
    title: "Community Building",
    description:
      "Participants can connect with each other, share their experiences, and build a community around your events.",
  },
];

export function OnboardingCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // Attach the event listener for slide changes
    api.on("select", handleSlideChange);

    // Cleanup
    return () => {
      api.off("select", handleSlideChange);
    };
  }, [api, handleSlideChange]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover"
                />
              </div>
              <div className="text-center text-primary text-sm space-y-0.5">
                <h5 className="font-bold">{slide.title}</h5>
                <p className="font-semibold">{slide.description}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center gap-1.5 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`p-0 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-5 h-2 bg-primary"
                  : "w-2 h-2 bg-primary/50"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
