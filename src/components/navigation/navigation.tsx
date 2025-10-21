"use client";

import { useState } from "react";
import { ShoppingCart, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { config } from "@/config";

interface IProps {
  cartItemsCount?: number;
}

const Navigation = ({ cartItemsCount = 0 }: IProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navLinks = [
    { path: "/", label: t("navigation.home") },
    { path: "/wines", label: t("navigation.wines") },
    { path: "/gallery", label: t("navigation.gallery") },
    { path: "/blog", label: t("navigation.blog") },
    { path: "/about", label: t("navigation.about") },
    { path: "/contact", label: t("navigation.contact") },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "hr" ? "en" : "hr";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass w-full">
      <div className="flex items-center justify-between h-20 px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 no-underline">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-gradient-wine">
            {config.metadata.name}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-inter font-medium transition-colors hover:text-accent no-underline ${
                pathname === link.path ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="hover:bg-white/10 hover:text-white py-1 px-2"
            aria-label={t("common.toggleLanguage")}
          >
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-xs">
              {i18n.language.split("-")[0].toUpperCase()}
            </span>
          </Button>

          <Link href="/cart" className="no-underline">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 hover:text-white py-1 px-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-[300px]">
              <div className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-inter font-medium transition-colors hover:text-accent no-underline ${
                      pathname === link.path ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
