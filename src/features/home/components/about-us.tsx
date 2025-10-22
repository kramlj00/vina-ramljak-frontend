"use client";

import { Wine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAboutUsDetails } from "../utils";

const AboutUs = () => {
  const { t } = useTranslation();

  const aboutUsDetails = getAboutUsDetails(t);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient-wine">
            {t("about.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl font-bold text-gradient-wine">
              {t("about.ourStory")}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story2")}
            </p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src="/images/winery-cellar.jpg"
              alt="Our Cellar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {aboutUsDetails.map((detail) => (
            <div
              key={detail.id}
              className="glass rounded-lg p-6 text-center hover-lift"
            >
              <Wine className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h4 className="font-playfair font-semibold text-xl mb-2">
                {detail.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
