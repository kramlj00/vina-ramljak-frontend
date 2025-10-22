"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const HomeCta = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-strong rounded-2xl p-12 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-gradient-wine">
            {t("homeCta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("homeCta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t("homeCta.contact")}
              </Button>
            </Link>
            <Link href="/wines">
              <Button size="lg" variant="outline" className="border-border/50">
                {t("homeCta.shop")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;
