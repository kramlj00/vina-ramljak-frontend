"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutPreview = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src="/images/winery-cellar.jpg"
              alt="Our Winery Cellar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gradient-wine">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.description")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.fullDescription")}
            </p>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 mt-6"
              >
                {t("about.learnMore")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
