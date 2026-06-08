import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightCircle } from "lucide-react";
import { useState, useEffect } from "react";
import bgImg from "@/assets/images/landing-page.jpeg";
import bg2Img from "@/assets/images/auth.jpeg";
import bg3Img from "@/assets/images/auth-2.jpg";

const Onboarding = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [bgImg, bg2Img, bg3Img];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % images.length,
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex lg:flex-row flex-col items-center relative space-y-12 p-6 max-h-screen min-h-screen overflow-y-hidden text-center">
            <div className="relative w-full overflow-hidden rounded-[30px] lg:h-[90vh] h-[60vh]">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        className={`absolute top-0 left-0 w-full h-full bg-cover object-cover ${index === 1 ? " object-left " : "object-top"}  transition-opacity duration-500 ease-in-out ${
                            index === currentImageIndex
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                        alt={`Onboarding slide ${index + 1}`}
                    />
                ))}

                {/* Optional: Add dots indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex
                                    ? "bg-white w-4"
                                    : "bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className=" w-full flex flex-col gap-6 ">
                <div className="flex flex-col items-center justify-center text-center xs:pt-0 px-4">
                    <img
                        src="/logo/logo-purple.svg"
                        alt=""
                        className="size-11 lg:size-24"
                    />
                    <div className="space-y-2.5">
                        <h1 className="text-primary font-bold text-3xl">
                            Hiroek
                        </h1>

                        <p className="text font-semibold text-primary">
                            Event Creator Platform <br />
                            Built for{" "}
                            <span className="text-accent">Creators</span>.
                            Designed For{" "}
                            <span className="text-accent">Growth</span>.
                        </p>
                    </div>
                </div>

                <div className="p-5 flex justify-center mx-auto items-center w-full lg:p-0 lg:max-w-sm">
                    <Link
                        className={cn(
                            buttonVariants({
                                size: "lg",
                                className: "w-full rounded-full",
                            }),
                        )}
                        to="/auth/login"
                    >
                        <span>Get Started</span> <ArrowRightCircle />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
