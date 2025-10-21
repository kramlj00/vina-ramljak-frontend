"use client";

import { config } from "@/config";
import { Wine, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="glass border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wine className="h-6 w-6 text-primary" />
              <h3 className="font-playfair text-2xl font-bold text-gradient-wine">
                {config.metadata.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{t("footer.title")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold mb-4">
              {t("footer.quickLinks.title")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/wines"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("footer.quickLinks.wines")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("footer.quickLinks.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("footer.quickLinks.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("footer.quickLinks.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold mb-4">
              {t("footer.quickLinks.contactInfo.title")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{t("footer.quickLinks.contactInfo.country")}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+385 (0) XX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@vinumbibens.hr</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-playfair font-semibold mb-4">
              {t("footer.quickLinks.social.title")}
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {config.metadata.name}.{" "}
            {t("footer.copyright.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
