'use client';

import {useEffect, useState} from "react";
import HomeIndex from "@/components/pages/HomeIndex";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/PreLoader";
import {SmoothCursor} from "@/components/ui/smooth-cursor";

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
                {isLoading && <Preloader />}
            </AnimatePresence>
            <HomeIndex />
            <SmoothCursor />
        </>
    );
}


// 'use client'
// import {use, useEffect, useState} from "react";
// import { setRequestLocale } from "next-intl/server";
// import HomeIndex from "@/components/pages/HomeIndex";
// import {AnimatePresence} from "framer-motion";
// import Preloader from "../../components/PreLoader";
//
// export default function HomePage({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = use(params);
//   // Enable static rendering
//   setRequestLocale(locale);
//     const [isLoading, setIsLoading] = useState(true);
//
//     useEffect(() => {
//         (async () => {
//             const LocomotiveScroll = (await import("locomotive-scroll")).default;
//             const locomotiveScroll = new LocomotiveScroll();
//
//             setTimeout(() => {
//                 setIsLoading(false);
//                 document.body.style.cursor = "default";
//                 window.scrollTo(0, 0);
//             }, 2000);
//         })();
//     }, []);
//
//   return (
//       <>
//         <AnimatePresence mode="wait">
//           {isLoading && <Preloader />}
//         </AnimatePresence>
//         <HomeIndex />
//       </>
//   )
// }
