"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useTranslations } from "next-intl";

function NavMenu(props: NavigationMenuProps) {
    const t = useTranslations("Index");

    return (
        <NavigationMenu {...props}>
            <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="#features">{t("boilerplateName")}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="#pricing">{t("boilerplateName")}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="#faq">{t("boilerplateName")}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="#testimonials">{t("boilerplateName")}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default NavMenu;
