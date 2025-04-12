import { cn } from "@/lib/utils";
import React from "react";

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
                "mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
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
                              }: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "group/bento relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition duration-300 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
                "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
                "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTI3LDEyNywxMjcsMC4yKSIvPjwvc3ZnPg==')] before:opacity-20 before:mix-blend-overlay",
                "hover:before:opacity-30",
                className
            )}
        >
            <div className="relative z-10 transition duration-200 group-hover/bento:translate-x-2">
                {icon}
                <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                    {title}
                </div>
                <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
                    {description}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
        </div>
    );
};