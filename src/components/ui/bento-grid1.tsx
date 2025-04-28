import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export const BentoGrid1 = ({
                               className,
                               children,
                           }: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[900px] mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem1 = ({
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
            const tl = gsap.timeline({ paused: true }).to(
                image,
                {
                    scale: 1.15,
                    rotate: 3,
                    duration: 0.4,
                    ease: "power3.out",
                },
                0
            );

            const play = () => tl.play();
            const reverse = () => tl.reverse();

            const handleMouseMove = (e: MouseEvent) => {
                const bounds = card.getBoundingClientRect();
                const x = e.clientX - bounds.left;
                const percent = x / bounds.width - 0.5; // -0.5 to 0.5
                const moveX = percent * 30; // max 30px movement

                gsap.to(image, {
                    x: moveX,
                    duration: 0.4,
                    ease: "power3.out",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(image, {
                    x: 0,
                    duration: 0.4,
                    ease: "power3.out",
                });
            };

            card.addEventListener("mouseenter", play);
            card.addEventListener("mouseleave", reverse);
            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                card.removeEventListener("mouseenter", play);
                card.removeEventListener("mouseleave", reverse);
                card.removeEventListener("mousemove", handleMouseMove);
                card.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "group/bento relative overflow-hidden rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-2xl bg-white dark:bg-gray-800 flex flex-col justify-between min-h-[400px]",
                className
            )}
        >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex flex-col items-center text-center">
                    {icon && <div className="mb-2">{icon}</div>}
                    {title && (
                        <h3 className="mt-2 mb-1 font-sans font-bold text-neutral-800 dark:text-neutral-100 text-lg">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="font-sans text-sm font-normal text-neutral-600 dark:text-neutral-300">
                            {description}
                        </p>
                    )}
                </div>

                {image && (
                    <div className="relative w-full h-48 mt-4 overflow-hidden rounded-md">
                        <Image
                            ref={imageRef}
                            alt="bento image"
                            src={image}
                            fill
                            className="object-cover transition-transform duration-300"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
