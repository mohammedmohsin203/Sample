'use client';

import {useEffect, useState} from "react";
import HomeIndex from "@/components/pages/HomeIndex";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/PreLoader";
import {SmoothCursor} from "@/components/ui/smooth-cursor";
import {cn} from "@/lib/utils";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const LocomotiveScroll = (await import("locomotive-scroll")).default;
            new LocomotiveScroll();

            setTimeout(() => {
                setIsLoading(false);
                document.body.style.cursor = "default";
                window.scrollTo(0, 0);
            }, 2000);
        })();
    }, []);


    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <Preloader/>}
            </AnimatePresence>
            <div
                className={cn(
                    "absolute inset-0 z-[-10]",
                    "[background-size:20px_20px]",
                    "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                    "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                )}
            />
            <HomeIndex/>
            <SmoothCursor/>
        </>
    );
}

