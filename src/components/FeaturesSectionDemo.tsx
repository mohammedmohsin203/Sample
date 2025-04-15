"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

interface CardData{
    category: string;
    title: string;
    src: string;
    content: React.ReactNode;
}

export function FeaturesSectionDemo() {
    const t = useTranslations("Index");

    // Combine software and hardware cards from translations
    const softwareCards = t.raw("carousel.software").map((item: CardData, index: number) => ({
        category: item.category,
        title: item.title,
        src: data[index % data.length].src, // Reuse Unsplash images by cycling through the original data array
        content: <DummyContent />,
    }));

    const hardwareCards = t.raw("carousel.hardware").map((item: CardData, index: number) => ({
        category: item.category,
        title: item.title,
        src: data[(index + softwareCards.length) % data.length].src, // Continue cycling through Unsplash images
        content: <DummyContent />,
    }));

    const cards = [...softwareCards, ...hardwareCards].map((card, index) => (
        <Card key={card.src + index} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20">
            <Carousel items={cards} />
        </div>
    );
}

const DummyContent = () => {
    return (
        <>
            {[...new Array(3).fill(1)].map((_, index) => {
                return (
                    <div
                        key={"dummy-content" + index}
                        className=" dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
                    >

                    </div>
                );
            })}
        </>
    );
};

// Unsplash image links from the original data
const data = [
    {
        src: "https://images.unsplash.com/photo-1531683760080-7bb28a630bd7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TG9naXN0aWNzfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1615576446086-23d3f016875a?q=80&w=2264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2Vic2l0ZXxlbnwwfDF8MHx8fDA%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];