import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Menu,
  Phone,
  Mail,
  MapPin,
  Ship,
  Printer,
  Network,
  Server,
  Warehouse,
  Package,
  Truck,
  BarChart2,
  Scan,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "../ModeToggle";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import LanguageSwitcher from "../LanguageSwitcher";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import Image from "next/image";
import Logo from "../../../public/Logo.png";
import { FeaturesSectionDemo } from "@/components/FeaturesSectionDemo";
import Globes from "@/components/Globe";
import ContactCard from "@/components/ContactCard";

export default function HomeIndex() {
  const t = useTranslations("Index");
  const f = useTranslations("Footer");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isRTL, setIsRTL] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");

    const hasSelectedLanguage = localStorage.getItem("hasSelectedLanguage");
    if (!hasSelectedLanguage) {
      setIsLanguageDialogOpen(true);
    }
  }, []);

  const handleLanguageSelect = (locale: string) => {
    localStorage.setItem("hasSelectedLanguage", "true");
    const basePath = pathname.startsWith(`/${currentLocale}`)
        ? pathname.replace(`/${currentLocale}`, "")
        : pathname;
    const newPath = `/${locale}${basePath === "/" ? "" : basePath}`;
    router.push(newPath);
    setIsLanguageDialogOpen(false);
  };

  const softwareItems = [
    {
      title: t("services.software.portLogisticsApp"),
      description: t("services.software.portLogisticsAppDescription"),
      icon: <Ship className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.software.shippingApp"),
      description: t("services.software.shippingAppDescription"),
      icon: <Ship className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.software.customWebDev"),
      description: t("services.software.customWebDevDescription"),
      icon: <Globe className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.software.customMobileDev"),
      description: t("services.software.customMobileDevDescription"),
      icon: <Globe className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.software.inventoryManagement"),
      description: t("services.software.inventoryManagementDescription"),
      icon: <Package className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.software.vesselTracking"),
      description: t("services.software.vesselTrackingDescription"),
      icon: <Ship className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.software.warehouseAutomation"),
      description: t("services.software.warehouseAutomationDescription"),
      icon: <Warehouse className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.software.freightForwarding"),
      description: t("services.software.freightForwardingDescription"),
      icon: <Truck className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.software.supplyChainAnalytics"),
      description: t("services.software.supplyChainAnalyticsDescription"),
      icon: <BarChart2 className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
  ];

  const hardwareItems = [
    {
      title: t("services.hardware.barcodePrinters"),
      description: t("services.hardware.barcodePrintersDescription"),
      icon: <Printer className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.hardware.idCardPrinters"),
      description: t("services.hardware.idCardPrintersDescription"),
      icon: <Printer className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.hardware.networkPrinters"),
      description: t("services.hardware.networkPrintersDescription"),
      icon: <Printer className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.hardware.photocopiers"),
      description: t("services.hardware.photocopiersDescription"),
      icon: <Printer className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.hardware.networking"),
      description: t("services.hardware.networkingDescription"),
      icon: <Network className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.hardware.infrastructure"),
      description: t("services.hardware.infrastructureDescription"),
      icon: <Server className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.hardware.rfidReaders"),
      description: t("services.hardware.rfidReadersDescription"),
      icon: <Scan className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      title: t("services.hardware.portScanners"),
      description: t("services.hardware.portScannersDescription"),
      icon: <Scan className="h-4 w-4 text-primary" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2",
    },
    {
      title: t("services.hardware.logisticsTerminals"),
      description: t("services.hardware.logisticsTerminalsDescription"),
      icon: <Server className="h-4 w-4 text-primary" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1",
    },
  ];

  return (
      <div className="flex flex-col min-h-screen w-full">
        {/* Language Selection Dialog */}
        <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("selectLanguage")}</DialogTitle>
              <DialogDescription>{t("chooseLanguagePrompt")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                  onClick={() => handleLanguageSelect("en")}
                  variant={currentLocale === "en" ? "default" : "outline"}
              >
                English
              </Button>
              <Button
                  onClick={() => handleLanguageSelect("ar")}
                  variant={currentLocale === "ar" ? "default" : "outline"}
              >
                العربية (Arabic)
              </Button>
            </div>
            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem("hasSelectedLanguage", "true");
                    setIsLanguageDialogOpen(false);
                  }}
              >
                {t("close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <header
            className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-background">
          <Link className="flex items-center justify-center" href="/">
            <Image src={Logo} width={100} height={100} alt="logo" className="h-6 w-6 m-2 text-primary"/>
            <span className="font-bold text-xl hidden md:block">{t("boilerplateName")}</span>
            <span className="font-bold text-xl block md:hidden">{t("logo")}</span>
          </Link>
          <div className="flex items-center gap-4 hidden md:block">
            <Button variant="link" asChild>
              <Link href="#hero" className="text-foreground">
                {t('hero')}
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#about" className="text-foreground">
                {t('about')}
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#services" className="text-foreground">
                {t('services.title')}
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#contact" className="text-foreground">
                {t('contact')}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher/>
            <ModeToggle/>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6"/>
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-64">
                <div className="flex flex-col gap-4 mt-6">
                  <SheetClose asChild>
                    <Link href="#hero"
                          className="ml-4 p-2 rounded text-base sm:text-lg text-foreground hover:text-primary hover:font-bold hover:italic hover:bg-primary/20 hover:translate-x-2 transition-all duration-300 ease-in-out">
                      {t("hero")}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="#about"
                          className="ml-4 p-2 rounded text-base sm:text-lg text-foreground hover:text-primary hover:font-bold hover:italic hover:bg-primary/20 hover:translate-x-2 transition-all duration-300 ease-in-out">
                      {t("about")}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="#services"
                          className="ml-4 p-2 rounded text-base sm:text-lg text-foreground hover:text-primary hover:font-bold hover:italic hover:bg-primary/20 hover:translate-x-2 transition-all duration-300 ease-in-out">
                      {t("services.title")}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="#contact"
                          className="ml-4 p-2 rounded text-base sm:text-lg text-foreground hover:text-primary hover:font-bold hover:italic hover:bg-primary/20 hover:translate-x-2 transition-all duration-300 ease-in-out">
                      {t("contact")}
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full pt-16">
          {/* Hero Section */}
          <section id="hero" className="w-full pb-8 md:pb-12 lg:pb-20 bg-muted">
            <div className="px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div
                  className="flex items-center justify-center my-4 sm:my-0 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[600px] h-[300px] md:h-[600px]">
                <Globes/>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground">
                  {t("title")}
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-lg">
                  {t("description")}
                </p>
                <Button
                    title=""
                    className="inline-flex hover:scale-125 transition-all duration-5000 ease-in items-center px-6 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full hover:bg-yellow-400 focus:bg-yellow-400"
                    role="button"
                >
                  Locate Me 📍
                </Button>
              </div>
            </div>
          </section>

          {/* About Section with Scrollable Cards */}
          <section id="about" className="w-full py-8 md:py-12 lg:py-20">
            <div className="px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-6 text-foreground">
                {t("about")}
              </h2>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <Card className="shadow-lg relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl md:text-2xl">{t("about")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm sm:text-base">{t("aboutDescription")}</p>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                  <Card className="shadow-lg relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl md:text-2xl">{t("ourMission")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm sm:text-base">{t("missionDescription")}</p>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </section>

          {/* Services Section with Updated BentoGrid */}
          <section id="services" className="w-full py-8 md:py-12 lg:py-20 bg-muted">
            <div className="px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-6 text-foreground">
                {t("services.title")}
              </h2>
              <Separator className="my-6" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">
                {t("services.software.title")}
              </h3>
              <BentoGrid className="max-w-6xl mx-auto">
                {softwareItems.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        className={cn(
                            i === 0 || i === 3 || i === 6 ? "sm:col-span-2 md:col-span-2 lg:col-span-2" : "sm:col-span-1 md:col-span-1 lg:col-span-1",
                            "[&>p:text-sm]"
                        )}
                        icon={item.icon}
                    />
                ))}
              </BentoGrid>
              <Separator className="my-6" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">
                {t("services.hardware.title")}
              </h3>
              <BentoGrid className="max-w-6xl mx-auto">
                {hardwareItems.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        className={cn(
                            i === 1 || i === 4 || i === 7 ? "sm:col-span-2 md:col-span-2 lg:col-span-2" : "sm:col-span-1 md:col-span-1 lg:col-span-1",
                            "[&>p:text-sm]"
                        )}
                        icon={item.icon}
                    />
                ))}
              </BentoGrid>
              <FeaturesSectionDemo />
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="w-full py-8 md:py-12 lg:py-20">
            <div className="px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-7xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-6 text-foreground">
                {t("contact")}
              </h2>
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <p className="text-muted-foreground text-sm sm:text-base">{t("phone")}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <p className="text-muted-foreground text-sm sm:text-base">{t("email")}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="text-muted-foreground text-sm sm:text-base">{t("address")}</p>
                  </div>
                </div>
<ContactCard/>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 sm:px-6 md:px-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">{f("copyright")}</p>
            <nav className="flex flex-wrap gap-4">
              <Link href="#hero" className="text-xs hover:underline">
                {t("hero")}
              </Link>
              <Link href="#about" className="text-xs hover:underline">
                {t("about")}
              </Link>
              <Link href="#services" className="text-xs hover:underline">
                {t("services.title")}
              </Link>
              <Link href="#contact" className="text-xs hover:underline">
                {t("contact")}
              </Link>
            </nav>
          </div>
        </footer>
      </div>
  );
}