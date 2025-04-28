import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export const BentoGrid = ({
                              className,
                              children,
                          }: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full max-w-[800px] mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
                                  className,
                                  title,
                                  description,
                                  icon,
                                  image,
                              }: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    icon?: React.ReactNode;
    image?: string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const image = imageRef.current;

        if (card && image) {
            const tl = gsap.timeline({ paused: true })
                .to(image, {
                    scale: 1.15, // Scale up the image
                    rotate: 3, // Slight rotation
                    duration: 0.4,
                    ease: "power3.out",
                }, 0);

            card.addEventListener("mouseenter", () => tl.play());
            card.addEventListener("mouseleave", () => tl.reverse());

            return () => {
                card.removeEventListener("mouseenter", () => tl.play());
                card.removeEventListener("mouseleave", () => tl.reverse());
            };
        }
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "group/bento relative overflow-hidden rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-2xl bg-white dark:bg-gray-800",
                className
            )}
        >
            {/* Faded Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-400" />
            <div className="flex flex-row items-center gap-4">
                <div className="relative z-10 flex flex-col transition duration-200 group-hover/bento:translate-x-2 group-hover/bento:translate-y-2">
                    {icon}
                    <div className="mt-4 mb-2 font-sans font-bold text-neutral-800 dark:text-neutral-100 text-lg">
                        {title}
                    </div>
                    <div className="font-sans text-sm font-normal text-neutral-600 dark:text-neutral-300">
                        {description}
                    </div>
                </div>
                {image && (
                    <Image
                        ref={imageRef}
                        width={100}
                        height={100}
                        alt="bento image"
                        className="transition-transform duration-300 h-[125px] w-[145px] object-cover rounded-md"
                        src={image}
                    />
                )}
            </div>
        </div>
    );
};